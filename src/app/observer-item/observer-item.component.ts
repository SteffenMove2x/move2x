import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Orders } from '../models/Orders';

@Component({
  selector: 'app-observer-item',
  templateUrl: './observer-item.component.html',
  styleUrls: ['./observer-item.component.less']
})
export class ObserverItemComponent implements OnInit {
  @Input() orders:Orders;
  @Input() isPaused:boolean;
  @Output() updateOrdersList: EventEmitter<Orders> = new EventEmitter();
  @Output() openOrdersDetails: EventEmitter<Orders> = new EventEmitter();
  stopwatchTime = "00:00:00";
  siteUploadUrl: string = window.location.origin;


  constructor(private http: HttpClient) { 
  }

  ngOnInit(): void {
  }

  startTimeForOrders(event, orders){
    //when you check the start checkbox
    if(event.target.checked == true){

      //enable the end checkbox
      event.target.parentElement.children[1].disabled = false;

      //save time to a variable
      var newTime = new Date().getTime().toString();

      //save start-time in database for this order
      this.http.put(this.siteUploadUrl + "/api/orders/starttime/" + orders.id, {startTime:newTime, isStarted:1}).subscribe(data => {
        this.updateOrdersList.emit(orders);
    });
    }else{
      //remove time from db when checkbox is unchecked
      var nullTime = "";
      this.http.put(this.siteUploadUrl + "/api/orders/starttime/" + orders.id, {startTime:nullTime, isStarted:0}).subscribe(data => {
        this.updateOrdersList.emit(orders);

        //remove pauseDuration of the orders that is unchecked
        this.http.put(this.siteUploadUrl + "/api/orders/pauseduration/" + orders.id, {pauseDuration:"0"}).subscribe(data => {                 
        });
    });

      //disable the end checkbox again
      event.target.parentElement.children[1].disabled = true;
      
    }
  }


  endTimeForOrders(event, orders){
    //set end time on checking second checkbox
    var newTime = new Date().getTime().toString();

    //when ending time, get timestamp from the internal clock and save to db
    this.http.get(this.siteUploadUrl + "/returntime").subscribe(data => {
      //if time has been started
        if(data["date"] != null){
          //if time is not paused
          if(data["isPaused"] == false){

            //get the current time in HMS
            var timeInSeconds = Math.floor(data["timeBeforePause"] + (((new Date).getTime() - data["date"]) / 1000))
            this.secondsToHms(timeInSeconds);

            //set the endtime in database
            this.http.put(this.siteUploadUrl + "/api/orders/endtime/" + orders.id, {endTime:newTime, isEnded:1, finishTime:this.stopwatchTime}).subscribe(data => {
              
              //compare finish time with expected finish time
              this.http.get(this.siteUploadUrl + "/api/orders/" + orders.id).subscribe(data => {
                
                var ordersExpFinishTime = data["expFinishTime"];
                var ordersFinishTime = data["finishTime"];
                var ordersFinishTimeDiff = this.hmsToSeconds(ordersExpFinishTime) - this.hmsToSeconds(ordersFinishTime);

                //set the finish time difference in database
                this.http.put(this.siteUploadUrl + "/api/orders/finishTimeDiff/" + orders.id, {finishTimeDiff:ordersFinishTimeDiff}).subscribe(data => {

                  //basic score =
                  var finishScore = 10;
                  var negativePoints = 0;
                  var finalScore = 0;
                  
                  //calculate the points for this order
                  //if the orders is finished too early
                  if(ordersFinishTimeDiff > 0){
                    negativePoints = Math.floor((ordersFinishTimeDiff/120)*2)/2;
                    if(negativePoints >= 2.5){
                      negativePoints = 2.5;
                    }
                    
                  //if the orders is finish too late
                  }else if(ordersFinishTimeDiff < 0){
                    negativePoints = Math.floor(Math.abs(ordersFinishTimeDiff)/60);
                    if(negativePoints >= 5){
                      negativePoints = 5;
                    }
                  }

                  finalScore = finishScore - negativePoints;

                  //check how many fails have been made and add negative points accordingly
                  var negativePFails = orders.pFail
                  var negativeQFails = orders.qFail

                  if(negativePFails >= 5){
                    negativePFails = 5;
                  }

                  if(negativeQFails >= 5){
                    negativeQFails = 5;
                  }

                  finalScore = finalScore - negativePFails - negativeQFails;

                  //add final score to the orderss database
                  this.http.put(this.siteUploadUrl + "/api/orders/thisscore/" + orders.id, {thisScore:finalScore}).subscribe(data => {

                    //get current scenario id
                    this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
                      var currentScenarioID = data["scenarioID"];

                      //get currentScore and maxScore
                        this.http.get(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID).subscribe(data => {
                        
                        //add new score to scoreboard relevant scoreboard
                        var collectedScore = data["currentScore"] + finalScore;
                        var maxScore = data["maxScore"] + 10;

                        //set the score in database
                        this.http.put(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID, {currentScore:collectedScore, maxScore:maxScore}).subscribe(data => {
                        
                        //update orders-list
                        this.updateOrdersList.emit(orders);
                      });
                    });
                    });
                  });
                });
              });
              this.updateOrdersList.emit(orders);
            });
          }
        }else{
          //if time has not been started
          this.stopwatchTime = "00:00:00"
          this.http.put(this.siteUploadUrl + "/api/orders/endtime/" + orders.id, {endTime:newTime, isEnded:1, finishTime:this.stopwatchTime}).subscribe(data => {
              this.updateOrdersList.emit(orders);
            });
        }
      });

    //disable both checkboxes when the item has been finished
    event.target.parentElement.children[0].disabled = true;
    event.target.parentElement.children[1].disabled = true;

    //set used time without and with pauses
    this.http.get(this.siteUploadUrl + "/api/orders/" + orders.id).subscribe(data =>{
      var startTime = data["startTime"];
      var thisOrdersPauseDuration = data["pauseDuration"];
      var usedTime = parseInt(newTime) - parseInt(startTime);
      var usedTimeWithPauses = (usedTime - parseInt(thisOrdersPauseDuration)).toString();

      //set orders used time without pauses
      this.http.put(this.siteUploadUrl + "/api/orders/usedtime/" + orders.id, {usedTime:usedTime}).subscribe(data => {
        //set orders used time with pauses
        this.http.put(this.siteUploadUrl + "/api/orders/usedtimewithpauses/" + orders.id, {usedTimeWithPauses:usedTimeWithPauses}).subscribe(data => {
         //get current round/phase
         this.http.get(this.siteUploadUrl + "/returntime").subscribe(data => {
          //add finishRound to this orders in database
          this.http.put(this.siteUploadUrl + "/api/orders/finishround/" + orders.id, {finishRound:data["phase"]}).subscribe(data => {
          })
        });
      });
    });
    })
  }

  addOneProcessFail(orders){
    //get processfail for this order
    var thisProcessFails = orders.pFail;
    //add 1 to the current processfail
    var newProcessFails = thisProcessFails + 1;

    //add the fail in database
    this.http.put(this.siteUploadUrl + "/api/orders/processfail/" + orders.id, {processFails:newProcessFails}).subscribe(data => {
        var isFinished = orders["isEnded"];
        //if the orders is ended
        if(isFinished == 1){
          //if the fails is 5 or under
          if(newProcessFails <= 5){
            //get the current score from this orders
            this.http.get(this.siteUploadUrl + "/api/orders/" + orders.id).subscribe(data => {
              var currentScoreMinusOne = data["thisScore"] - 1;
              //subtract one score from the current score
              this.http.put(this.siteUploadUrl + "/api/orders/thisscore/" + orders.id, {thisScore:currentScoreMinusOne}).subscribe(data => {
                
                //get current scenario id
                this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
                  var currentScenarioID = data["scenarioID"];
                
                  //get currentScore and maxScore
                    this.http.get(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID).subscribe(data => {
                    //add new score to scoreboard
                    var currentScoreBoardMinusOne = data["currentScore"] - 1;
                    var maxScore = data["maxScore"];
                    this.http.put(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID, {currentScore:currentScoreBoardMinusOne, maxScore:maxScore}).subscribe(data => {
                    this.updateOrdersList.emit(orders);
                });   
                });
                });
              });
            });
          }
        }
        this.updateOrdersList.emit(orders);
    });
  }

  addOneQualityFail(orders){
    //get current quality fails
    var thisQualityFails = orders.qFail;
    //add 1 to current quality fails
    var newQualityFails = thisQualityFails + 1;
    
    this.http.put(this.siteUploadUrl + "/api/orders/qualityfail/" + orders.id, {qualityFails:newQualityFails}).subscribe(data => {
      var isFinished = orders["isEnded"];
      //if the orders is ended
      if(isFinished == 1){
        //if the fails is 5 or under
        if(newQualityFails <= 5){
          //get the current score from this orders
          this.http.get(this.siteUploadUrl + "/api/orders/" + orders.id).subscribe(data => {
            var currentScoreMinusOne = data["thisScore"] - 1;
            //subtract one score from the current score
            this.http.put(this.siteUploadUrl + "/api/orders/thisscore/" + orders.id, {thisScore:currentScoreMinusOne}).subscribe(data => {
              
               //get current scenario id
               this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
                var currentScenarioID = data["scenarioID"];
              
              //get currentScore and maxScore
              this.http.get(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID).subscribe(data => {
                //add new score to scoreboard
                var currentScoreBoardMinusOne = data["currentScore"] - 1;
                var maxScore = data["maxScore"];
                this.http.put(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID, {currentScore:currentScoreBoardMinusOne, maxScore:maxScore}).subscribe(data => {
                this.updateOrdersList.emit(orders);
              });   
              });
            });
            });
          });
        }
      }
        this.updateOrdersList.emit(orders);
    });
  }

  secondsToHms(d) {
    //turn second into HH:MM:SS
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    this.stopwatchTime = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

  hmsToSeconds(hmsTime){
    //turn HH.MM.SS into seconds
    var a = hmsTime.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    return seconds;
  }

  openUpOrders(orders){
    this.openOrdersDetails.emit(orders);
  }
}
