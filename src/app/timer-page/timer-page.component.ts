import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.less']
})
export class TimerPageComponent implements OnInit {

  stopwatchTime: string = "00:00:00";
  stopwatchTimeInSeconds: number;
  siteUploadUrl: string = window.location.origin;
  newOrderss = [];

  constructor(private http: HttpClient) { 

    //Set a interval that runs every half second and triggers the functions
    const source = interval(500);
    source.subscribe(x => {
      //Run the "returntime" function in the back-end 
      this.http.get(this.siteUploadUrl + "/returntime").subscribe(data => {
        //if the date variable is not null, then the time has been started
        if(data["date"] != null){
          //if the isPaused variable is false, then the time is currently running
          if(data["isPaused"] == false){
            //make the timeInSeconds variable equal to the current timeStamp that has been saved minus the current time --
            //plus the time that is has been running before it was paused, and make it into seconds. 
            var timeInSeconds = Math.floor(data["timeBeforePause"] + (((new Date).getTime() - data["date"]) / 1000))
            this.secondsToHms(timeInSeconds);
          }else{
            //if it is paused, just show the amount of time before it was paused,
            var thisTimeInSeconds = Math.floor(data["timeBeforePause"])
            this.secondsToHms(thisTimeInSeconds);
          }
        }else{
          //if it is not started, just make the stopwatchTime be 00:00:00
          this.stopwatchTime = "00:00:00"
        }
      });
    });
  }

  ngOnInit(): void {
  }

  //Stopwatch function
  //turn seconds into HH:MM:SS
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    this.stopwatchTime = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

  //start the stopwatch
  start(){
    //only start trigger if time is not already running
    this.http.get(this.siteUploadUrl + "/returntime").subscribe(data => {
      //if the time is paused/or not startet - start the time
        if(data["isPaused"] == true){
          //trigger "starttime" function in back-end
          this.http.get(this.siteUploadUrl + "/starttimer").subscribe(data => {
            //if the current time is not 00:00:00 it is not the first time the time starts
            //then it is a pause that is ending
            if(this.stopwatchTime != "00:00:00"){
              //get the latest pause that is started in the database
              this.http.get(this.siteUploadUrl + "/api/pauseid").subscribe(data => {
                var pauseID = data["id"];
                var startDate = data["pauseStart"];
                var newDate =  new Date().getTime().toString();
      
                var pauseDuration = (parseInt(newDate) - parseInt(startDate)).toString();

                //insert pause end time in database
                this.http.put(this.siteUploadUrl + "/api/pauseend/" + pauseID, {pauseEndTime:newDate, pauseDuration:pauseDuration}).subscribe(data => {
                  //get all the orderss in the database
                  this.http.get(this.siteUploadUrl + "/api/orders").subscribe(data => {
                    //for each prdocut in the databse do something
                    for(let key in data){
                      if(data.hasOwnProperty(key)){
                        //if orders time is started but not ended, add pauseDuration for the orders in database
                        if(data[key].isStarted == 1 && data[key].isEnded == 0){
                          console.log(data[key].id + " should add: " + pauseDuration);

                          var thisOrdersNewPauseDuration = (parseInt(data[key].pauseDuration) + parseInt(pauseDuration)).toString();
                          
                          this.http.put(this.siteUploadUrl + "/api/orders/pauseduration/" + data[key].id, {pauseDuration:thisOrdersNewPauseDuration}).subscribe(data => { 
                          });
                        }
                      }
                    }
                  });
                });
              });
            }
          });
        }
      });
  }

  //pause function
  pause(){
    //trigger "pausetimer" function in back-end
    this.http.get(this.siteUploadUrl + "/pausetimer").subscribe(data => {
      //if the timer is not 00:00:00 the time has been started
      if(this.stopwatchTime != "00:00:00"){
        var newDate =  new Date().getTime().toString();

        //create pause in the database with startTime(pauseStart)
        this.http.post(this.siteUploadUrl + "/api/pausestart", {pauseStartTime:newDate}).subscribe(data => {
        });
      }
    });
  }

  //trigger reset function in back-end
  reset(){
    this.http.get(this.siteUploadUrl + "/resettimer").subscribe(data => {
      //make scenario for this team
      this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
        var teamID = data["teamID"];
        console.log(teamID);

        if(teamID != 0){
          //there is a current team
          console.log("there is a current team");

        //create scenario for the team
        this.http.post(this.siteUploadUrl + "/api/scenario", {fk_team:teamID}).subscribe(data => {
          //get id of the scenario you just made
          this.http.get(this.siteUploadUrl + "/api/scenario/" + teamID).subscribe(data => {
            var scenarioArray = [];
            
            for(let key in data){
              if(data.hasOwnProperty(key)){
                scenarioArray.push(data[key]);
              }
            }
            var currentScenarioID = data[scenarioArray.length - 1].id;
  
            //set scenario id in back-end to the current scenario id
            this.http.get(this.siteUploadUrl + "/setscenarioid/" + currentScenarioID).subscribe(data => {
              console.log("reight before u should make score");
              //create score for this sceanario
              this.http.post(this.siteUploadUrl + "/api/scorefk", {fk_scenario:currentScenarioID, currentScore:0, maxScore:0}).subscribe(data => {
                console.log("reight after u should make score");
              });
              
              //add all orders that should be in the scenario
              //get the preset that has been used for this team
              this.http.get(this.siteUploadUrl + "/returncurrentpreset").subscribe(data => {
                if(data["preset"] == "first"){
                  //add first preset object
                  console.log("add first preset");

                  this.newOrderss = [
                    {name: "10001",
                    expFinishTime: "00:05:00",
                    products: [
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10002",
                    expFinishTime: "00:06:00",
                    products: [
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10003",
                    expFinishTime: "00:08:00",
                    products: [
                      {id:1211, amount:1},
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10004",
                    expFinishTime: "00:15:00",
                    products: [
                      {id:1213, amount:1}
                    ]
                    },
                    {name: "10005",
                    expFinishTime: "00:20:00",
                    products: [
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10006",
                    expFinishTime: "00:25:00",
                    products: [
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10010",
                    expFinishTime: "00:27:00",
                    products: [
                      {id:1214, amount:2}
                    ]
                    },
                    {name: "10007",
                    expFinishTime: "00:35:00",
                    products: [
                      {id:1212, amount:1},
                      {id:6002, amount:1}
                    ]
                    },
                    {name: "10008",
                    expFinishTime: "00:38:00",
                    products: [
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10009",
                    expFinishTime: "00:40:00",
                    products: [
                      {id:1214, amount:1},
                      {id:6001, amount:1}
                    ]
                    },
                    {name: "10011",
                    expFinishTime: "00:40:00",
                    products: [
                      {id:1212, amount:1},
                      {id:6002, amount:1}
                    ]
                    },
                    {name: "10012",
                    expFinishTime: "00:47:00",
                    products: [
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10013",
                    expFinishTime: "00:49:00",
                    products: [
                      {id:1214, amount:1},
                      {id:6001, amount:1}
                    ]
                    },
                    {name: "10014",
                    expFinishTime: "00:45:00",
                    products: [
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10015",
                    expFinishTime: "00:47:00",
                    products: [
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10016",
                    expFinishTime: "00:50:00",
                    products: [
                      {id:1211, amount:1},
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10017",
                    expFinishTime: "00:55:00",
                    products: [
                      {id:1213, amount:3}
                    ]
                    },
                    {name: "10018",
                    expFinishTime: "01:00:00",
                    products: [
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10019",
                    expFinishTime: "01:10:00",
                    products: [
                      {id:6002, amount:1},
                      {id:6001, amount:1}
                    ]
                    },
                    {name: "10020",
                    expFinishTime: "01:15:00",
                    products: [
                      {id:1214, amount:2}
                    ]
                    },
                    {name: "10021",
                    expFinishTime: "01:17:00",
                    products: [
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10022",
                    expFinishTime: "01:20:00",
                    products: [
                      {id:1214, amount:1},
                      {id:1212, amount:2}
                    ]
                    },
                    {name: "10023",
                    expFinishTime: "01:22:00",
                    products: [
                      {id:1212, amount:1},
                      {id:1213, amount:1},
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10024",
                    expFinishTime: "01:26:00",
                    products: [
                      {id:1214, amount:1},
                      {id:8101, amount:1},
                      {id:8102, amount:1}
                    ]
                    },
                    {name: "10025",
                    expFinishTime: "01:30:00",
                    products: [
                      {id:1214, amount:2}
                    ]
                    },
                    {name: "10026",
                    expFinishTime: "01:36:00",
                    products: [
                      {id:8101, amount:1},
                      {id:8102, amount:1}
                    ]
                    },
                    {name: "10027",
                    expFinishTime: "01:38:00",
                    products: [
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10028",
                    expFinishTime: "01:40:00",
                    products: [
                      {id:1213, amount:1}
                    ]
                    },
                    {name: "10029",
                    expFinishTime: "01:42:00",
                    products: [
                      {id:1211, amount:2}
                    ]
                    },
                    {name: "10030",
                    expFinishTime: "01:50:00",
                    products: [
                      {id:1212, amount:1},
                      {id:1213, amount:1},
                      {id:1214, amount:1},
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10031",
                    expFinishTime: "01:54:00",
                    products: [
                      {id:1213, amount:3}
                    ]
                    },
                    {name: "10032",
                    expFinishTime: "01:56:00",
                    products: [
                      {id:8102, amount:1},
                      {id:8101, amount:2}
                    ]
                    },
                    {name: "10033",
                    expFinishTime: "02:00:00",
                    products: [
                      {id:1211, amount:5}
                    ]
                    },
                    {name: "10034",
                    expFinishTime: "02:10:00",
                    products: [
                      {id:6001, amount:1}
                    ]
                    },
                    {name: "10035",
                    expFinishTime: "02:15:00",
                    products: [
                      {id:1211, amount:1},
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10036",
                    expFinishTime: "02:17:00",
                    products: [
                      {id:8101, amount:2}
                    ]
                    },
                    {name: "10037",
                    expFinishTime: "02:30:00",
                    products: [
                      {id:1212, amount:2}
                    ]
                    },
                    {name: "10038",
                    expFinishTime: "02:35:00",
                    products: [
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10039",
                    expFinishTime: "02:41:00",
                    products: [
                      {id:1213, amount:1},
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10040",
                    expFinishTime: "02:42:00",
                    products: [
                      {id:1214, amount:1},
                      {id:1212, amount:2},
                      {id:1211, amount:1}
                    ]
                    },
                    {name: "10041",
                    expFinishTime: "02:50:00",
                    products: [
                      {id:8101, amount:1},
                      {id:8102, amount:1}
                    ]
                    },
                    {name: "10042",
                    expFinishTime: "02:59:00",
                    products: [
                      {id:1211, amount:2},
                      {id:1212, amount:2}
                    ]
                    },
                    {name: "10043",
                    expFinishTime: "01:05:00",
                    products: [
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10044",
                    expFinishTime: "01:36:00",
                    products: [
                      {id:1214, amount:1}
                    ]
                    },
                    {name: "10045",
                    expFinishTime: "01:45:00",
                    products: [
                      {id:1211, amount:1},
                      {id:1212, amount:1}
                    ]
                    },
                    {name: "10046",
                    expFinishTime: "01:55:00",
                    products: [
                      {id:1213, amount:3}
                    ]
                    }
                  ];


                }else if(data["preset"] == "second"){
                  //add second preset object
                  console.log("add second preset");

                  this.newOrderss = [
                    {name: "10003",
                    expFinishTime: "00:08:00",
                    products: [
                      {id:1211, amount:1},
                      {id:1212, amount:1}
                    ]
                    }
                  ];


                }else{
                  //No preset has been chosen
                  console.log("no preset has been chosen");
                }


              //ADD ALL THE PRODUCTORDERS
              //loop trough all the orders and add them to database one by one
              for(let key in this.newOrderss){
                if(this.newOrderss.hasOwnProperty(key)){
                  this.http.post(this.siteUploadUrl + "/api/orders", {name:this.newOrderss[key].name, expFinishTime:this.newOrderss[key].expFinishTime, fk_scenario:currentScenarioID}).subscribe(data => {
                  
                    //get orders id:
                    this.http.get(this.siteUploadUrl + "/api/orders/" + this.newOrderss[key].name + "/" + currentScenarioID).subscribe(data =>{
                     
                      //after order is added - add the products that is in the order
                      //loop trough the orders products
  
                      for(let x in this.newOrderss[key].products){
                        if(this.newOrderss.hasOwnProperty(x)){
                          this.http.post(this.siteUploadUrl + "/api/ordersproduct", {amount:this.newOrderss[key].products[x].amount, fk_orders:data["id"], fk_product:this.newOrderss[key].products[x].id}).subscribe(data => {
                          });
                        }
                      }
                    });
                  });
                }
              }

              });
            });  
          })
        });

        }else{
          //there is NOT a current team
          console.log("there is NOT a current team");
          
        }
      })
    })
  }
}
