import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataList = [];

  constructor(
    private http: HttpClient
  ) {
    setInterval(()=>{
      this.dataList = [];
      this.getSlotData()
    }, 10000)
  }

  ngOnInit() {
  }

  getSlotData() {
    this.http.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=395&date=28-06-2021')
    .subscribe((data)=>{
      this.filterData(data)
      console.log(this.dataList);
    })
  }

  filterData(data) {
    data.centers.filter((center)=>{
      if(center.sessions && center.sessions.length) {
        center.sessions.filter((session)=>{
          if(session.vaccine === "COVISHIELD" && session.min_age_limit === 45) {
            this.dataList.push({
              name: center.name,
              type: center.fee_type,
              pincode: center.pincode,
              address: center.address,
              count: session.available_capacity_dose2
            })
          }
        })
      }
    })
  }
}
