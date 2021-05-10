import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})

export class DataServiceService {
  
  constructor(private http : HttpClient) { }

  getDateObj () {
    let today: any = new Date();
    let dd: any = today.getDate()-1;

    let mm: any = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) {
      dd =`0${dd}`;
    }
    if(mm<10) {
      mm=`0${mm}`;
    } 
    today = `${mm}-${dd}-${yyyy}`;
    return today;
  }

  private golbalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.getDateObj()}.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, {responseType: 'text'})
      .pipe(map(result => {
        let rows = result.split('\n');
        let mainData = [];
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          // console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw : DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw);
          })
        })
        
        return mainData;
      }))
  }

  getGlobalData() {
    return this.http.get(this.golbalDataUrl, {responseType: 'text'}).pipe(
      map(result =>{
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }
          let temp: GlobalDataSummary = raw[cs.country];
          if(temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            
            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        })

        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}
