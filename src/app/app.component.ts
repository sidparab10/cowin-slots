import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataList = [];

  selectedDose = 2;
  selectedAge = 45;
  selectedDist = 0;
  districtList = [
    {
      id: 395,
      name: "Mumbai",
      selected: true
    },
    {
      id: 392,
      name: "Thane"
    },
    {
      id: 374,
      name: "Sindhudurg"
    },
    {
      id: 394,
      name: "Palghar"
    },
    {
      id: 363,
      name: "Pune"
    }
  ]
  selectedDate = '28-06-2021';

  intTimer: any = 0;
  refreshTime = 10;

  constructor(
    private http: HttpClient
  ) {
    this.getSlotData();
  }

  ngOnInit() {
  }

  getSlotData() {
    this.dataList = [];
    this.getData();
    this.intTimer = setInterval(() => {
      this.dataList = [];
      this.getData();
    }, this.refreshTime * 1000);
  }

  getData() {
    const distId = this.districtList[this.selectedDist].id;
    this.http.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + distId + '&date=' + this.selectedDate)
      .subscribe((data) => {
        this.filterData(data)
        console.log(this.dataList);
      });
  }

  filterData(data) {
    data.centers.filter((center) => {
      if (center.sessions && center.sessions.length) {
        center.sessions.filter((session) => {
          if (session.vaccine === "COVISHIELD" && session.min_age_limit === this.selectedAge) {
            this.dataList.push({
              name: center.name,
              type: center.fee_type,
              pincode: center.pincode,
              address: center.address,
              count: this.selectedDose == 1 ? session.available_capacity_dose1 : session.available_capacity_dose2
            })
          }
        })
      }
    })
  }


  reloadTable(dose, age, dmy, district, time) {
    this.selectedAge = Number(age);
    this.selectedDose = Number(dose);
    this.selectedDist = Number(district);
    this.refreshTime = !!time ? time : this.refreshTime;
    if (!!dmy) {
      const date = new Date(dmy);
      const dd = date.getDate();
      let mm = date.getMonth() + 1;
      mm = mm < 10 ? Number(`0${mm}`) : mm;
      const yyyy = date.getFullYear();
      this.selectedDate = `${dd}-${mm}-${yyyy}`;
    }
    clearInterval(this.intTimer);
    this.getSlotData();
  }
}
