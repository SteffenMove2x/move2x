import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.less']
})
export class SetupPageComponent implements OnInit {

  siteUploadUrl: string = window.location.origin;
  newOrderss = [];
  presetName = null;
  redColor = "#E02F2F";
  greenColor = "#3db426";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addTeamToDatabase(){
    var firstCheck = <HTMLInputElement>document.getElementById("firstCheck");
    var secondCheck = <HTMLInputElement>document.getElementById("secondCheck");
    var teamInputName = (<HTMLInputElement>document.getElementById("teamInput")).value;

    //check if input is not empty
    if(teamInputName != "" && teamInputName != null){
      //check if preset is selected
      if(firstCheck.checked || secondCheck.checked){
        //if a checkbox is checked, allow creation of new team
  //get name from facilitator input
  var currentDateString = new Date().toString().substring(0,24);
  //add team to database
  this.http.post(this.siteUploadUrl + "/api/team", {teamName:teamInputName, date:currentDateString}).subscribe(data => {
    //get id of the team you just created
    this.http.get(this.siteUploadUrl + "/api/team/" + teamInputName).subscribe(data => {
      var thisTeamId = data["id"];
      
      //add the id to the back-end to keep track of it
      this.http.get(this.siteUploadUrl + "/setteamid/" + thisTeamId).subscribe(data => {
        
        //create first scenario for the new team
        this.http.post(this.siteUploadUrl + "/api/scenario", {fk_team:thisTeamId}).subscribe(data => {

          //get id of the scenario you just made
          this.http.get(this.siteUploadUrl + "/api/scenario/" + thisTeamId).subscribe(data => {

            //get all scenarios with this fk, and add them to array
            var scenarioArray = [];
            
            for(let key in data){
              if(data.hasOwnProperty(key)){
                scenarioArray.push(data[key]);
              }
            }

            //subtract 1 from the lenght of the array to get index of the latest scenario
            var currentScenarioID = data[scenarioArray.length - 1].id;

            //set scenario id in back-end to the current scenario id
            this.http.get(this.siteUploadUrl + "/setscenarioid/" + currentScenarioID).subscribe(data => {

              //add all orders that should be in the scenario
              //create score for this sceanario
              this.http.post(this.siteUploadUrl + "/api/scorefk", {fk_scenario:currentScenarioID, currentScore:0, maxScore:0}).subscribe(data => {
              });

              //reset time on stopwatch
              this.http.get(this.siteUploadUrl + "/resettimer").subscribe(data => {
              });
  
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
               //add preset name to the back-end
              this.http.get(this.siteUploadUrl + "/setcurrentpreset/" + this.presetName).subscribe(data => {
              });
            });
          });
        });
      });
    });
  });
  
  //remove value from input
  (<HTMLInputElement>document.getElementById("teamInput")).value = "";

  //remove preset check
  var cbs = document.getElementsByClassName("cb");

  for (var i = 0; i < cbs.length; i++) {
    (<HTMLInputElement>cbs[i]).checked = false;
  }

  //send success message
  this.triggerMessage("Team has been added successfully.", this.greenColor);

      }else{
        //no checkbox is checked
        console.log("Choose a preset");
        this.triggerMessage("Choose a preset.", this.redColor);
      };

    }else{
      //nothing inserted in team input
      console.log("Insert name");
      this.triggerMessage("Insert name of the team.", this.redColor);
    }
  }

  returnIDs(){
    //get ids from back-end
    this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
      console.log(data);
    });
    //get presets from back-end
    this.http.get(this.siteUploadUrl + "/returncurrentpreset").subscribe(data => {
      console.log(data);
    });
  }

  triggerMessage(msg, color){
    //trigger indecation on change
    document.getElementById("infoText").style.backgroundColor = color;
    document.getElementById("infoText").style.height = "40px";
    document.getElementById("infoText").innerHTML = msg;

    setTimeout(this.resetMsgHeight, 2000);
  }

  resetMsgHeight(){
    //resetting trigger msg height
    document.getElementById("infoText").style.height = "0px";
  }

  cbChange(obj) {
    //get all checkboxes
    var cbs = document.getElementsByClassName("cb");
    //set them all to false
    for (var i = 0; i < cbs.length; i++) {
        (<HTMLInputElement>cbs[i]).checked = false;
    }
    //set the one you clicked on to true
    obj.checked = true;

    if(obj.id == "firstCheck"){

      console.log("add firstCheck to newOrderss");

      //HARD CODET PRESET NAME
      //First = Awareness game
      
      this.presetName = "first";
      //setting newOrderss to first preset
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

    }else if(obj.id == "secondCheck"){

      console.log("add secondCheck to newOrderss");

      //HARD CODET PRESET NAME
      this.presetName = "second";

      //setting newOrderss to second preset
      this.newOrderss = [
        {name: "10003",
        expFinishTime: "00:08:00",
        products: [
          {id:1211, amount:1},
          {id:1212, amount:1}
        ]
        }
      ];
    }
}

}
