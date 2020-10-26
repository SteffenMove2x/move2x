import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { Orders } from '../models/Orders';

@Component({
  selector: 'app-observer-page',
  templateUrl: './observer-page.component.html',
  styleUrls: ['./observer-page.component.less']
})
export class ObserverPageComponent implements OnInit {

  siteUploadUrl: string = window.location.origin;
  stopwatchTime: string = "00:00:00";
  orderssUrl = this.siteUploadUrl + "/api/orders";
  orderss = [];
  products = [];


  timerIsPaused = true;


  constructor(private http: HttpClient) { 

    //check the timer in the back-end every half second
    const source = interval(500);
    source.subscribe(x => {
      //return the time of the back-end timer
      this.http.get(this.siteUploadUrl + "/returntime").subscribe(data => {
        //if the date is not null, the time has been started
        if(data["date"] != null){
          //if the time is not paused
          if(data["isPaused"] == false){
            //display timestamp - current time + the time it has been paused
            var timeInSeconds = Math.floor(data["timeBeforePause"] + (((new Date).getTime() - data["date"]) / 1000))
            this.secondsToHms(timeInSeconds);
          }else{
            //display the time it has been paused
            var thisTimeInSeconds = Math.floor(data["timeBeforePause"])
            this.secondsToHms(thisTimeInSeconds);
          }
        }else{
          this.stopwatchTime = "00:00:00"
        }

      this.timerIsPaused = data["isPaused"];
      
      });
    });
  }

  ngOnInit(): void {
    //get current scenario id
    this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {

      //getting all orderss from db
      this.http.get(this.siteUploadUrl + "/api/orderss/" + data["scenarioID"]).subscribe(data => {
     
      //reset orderss array
      this.orderss = [];

      //add all oders to orderss array
      for(let key in data){
        if(data.hasOwnProperty(key)){
          this.orderss.push(data[key]);
        }
      }
      });
    });
  }

  //turn seconds into HH:MM:SS
  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    this.stopwatchTime = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

  //update orders list when fails is added

  updateOrdersList(){
    //get current scenario id
    this.http.get(this.siteUploadUrl + "/returnids").subscribe(data => {

      //getting all orderss from db
      this.http.get(this.siteUploadUrl + "/api/orderss/" + data["scenarioID"]).subscribe(data => {

      //reset orderss array
      this.orderss = [];

      //add all oders to orderss array
      for(let key in data){
        if(data.hasOwnProperty(key)){
          this.orderss.push(data[key]);
        }
      }
      });
    });
  }

  openOrdersDetails(orders){
    //open orders details by changing the divs height from 0px to 100vh
    document.getElementById("ordersDetails").style.height = "100vh";
    //change the order number inside order details
    document.getElementById("detailsOrdersNumber").innerHTML = "Order Number: " + orders.name;
   
    //get all products that is inside the order
    this.http.get(this.siteUploadUrl + "/api/ordersproduct/" + orders.id).subscribe(data =>{

    //reset products array
    this.products = [];

      //loop trough all orders-products, and get the amount 
      for(let key in data){
        if(data.hasOwnProperty(key)){

          var thisProductsAmount = data[key].amount;

          //get the product info that is relevant for the orders-product
          this.http.get(this.siteUploadUrl + "/api/product/" + data[key].fk_product).subscribe(data =>{
            this.products.push({amount:thisProductsAmount, id:data["id"], bottom:data["bottom"], cover:data["cover"], fuse:data["fuse"]});
          });
        }
      }
    });
  }

  exitOrdersDetails(){
    //set the orders details height back to 0;
    document.getElementById("ordersDetails").style.height = "0px";
  }

}
