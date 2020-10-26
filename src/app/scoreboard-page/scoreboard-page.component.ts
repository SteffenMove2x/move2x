import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Score } from '../models/Score';
import { interval } from 'rxjs';

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.less']
})
export class ScoreboardPageComponent implements OnInit {

  siteUploadUrl: string = window.location.origin;
  currentScore = 0;
  percentageScore = 0;
  

  constructor(private http: HttpClient) {

    //emit value in sequence every 1 second
    const source = interval(1000);
    source.subscribe(x => {

    //get current scenario id
    this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {
      var currentScenarioID = data["scenarioID"];

      //if there is a scenario running
      if(currentScenarioID != 0){
        //get score data from db with this scenario fk
        this.http.get(this.siteUploadUrl + "/api/scorefk/" + currentScenarioID).subscribe(data => {
        //set the currentScore in app, to the currentScore in database
        this.currentScore = Math.ceil(data["currentScore"]);
        //calculate size of mesure-bar from currentScore and scale it
        var size = 2.94 * Math.ceil(data["currentScore"]);
        document.getElementById("mesure-bar").style.height= size + "px";
        document.getElementById("mesure-bar").style.bottom= size + "px";
        //calculate the percentage of the efficiency from the database
        this.percentageScore = data["currentScore"] / data["maxScore"] * 100;
  
       });
      }
      
    });
  });

  }

  
  ngOnInit(): void {

  }

}
