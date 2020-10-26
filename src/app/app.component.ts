import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Move2x';
  stopwatchTime: string = "00:00:00";


  constructor(private http: HttpClient){
  }
  

  move(){
    document.getElementById("button-holder").style.visibility = "hidden";
  }


//TIMER SET FROM DATE AND DATABASE

  // millisToMinutesAndSeconds(millis) {
  //   var minutes = Math.floor(millis / 60000);
  //   var seconds = ((millis % 60000) / 1000).toFixed(0);
  //   return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
  // }

  // saveDate(){
  //   var newestDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
  //   this.http.post("http://localhost:5000/api/time", {startTime:newestDate}).subscribe(data => {
  //     console.log(newestDate);
  //     //is uploadeing in mysql datetype 
  //   });
  // }

  // getDate(){
  // const source = interval(1000);

  //   if(this.isStarted == false && this.isRunning == false){
  //     //set time and start interval
  //     this.firstDate = new Date();
  //     // console.log(this.date);
  //     //is displaying js date format
  //     this.isStarted = true;
  //     this.isRunning = true;
  //     source.subscribe(x => {

  //     var diff = Math.abs(new Date().getTime() - this.firstDate.getTime());
  //     console.log(this.millisToMinutesAndSeconds(diff));

  //     });
  //   }else if(this.isStarted == true && this.isRunning == true){
  //     //stop or pause interval
  //       //source.unsubscribe()
  //   }else if(this.isStarted == true && this.isRunning == false){
  //     //start from where it was paused
  //       source.subscribe(x => {

  //       var diff = Math.abs(new Date().getTime() - this.firstDate.getTime());
  //       console.log(this.millisToMinutesAndSeconds(diff));
  
  //       });
  //   }
    
  // }

  // stopDate(){
    
  // }


}
