import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PsqlService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://www.warshipapi.booshay.info/'

  test() {
    return this.http.get(this.baseUrl)
  }

  /*   getCoords(type, user): Observable<any> {
      console.log(this.baseUrl + "get" + type, user)
      return this.http.post<any>(this.baseUrl + "get" + type, user)
    } */

  getCoords(type: string, user: any): Observable<any> {
    const body = { type, user }; // Structure the request body
    console.log(`${this.baseUrl}get${type}`, body); // Logging for debugging

    return this.http.post<any>(`${this.baseUrl}get${type}`, body); // Send the structured body
  }


  addCoord(type, data, user) {
    data.user = user
    return this.http.post(this.baseUrl + type, data)
  }

  deleteCoord(type, id) {
    return this.http.delete(`${this.baseUrl}${type}/${id}`)
  }

  updateCoord(type, id, enhancement) {
    const body = { enhanced: enhancement }
    return this.http.put(`${this.baseUrl}${type}/${id}`, body)
  }

  runQuery(query) {
    return this.http.post<any>(this.baseUrl + 'query', query)
  }

  //for the admin's quick coord check button
  coordCheck(coords) {
    const body = { position: coords }
    return this.http.post<any>(this.baseUrl + 'coordCheck', body);
  }

  //duplicate checker before adding a new coord
  checkIfCoordExists(type, position, user) {
    const data = { position: position, user: user }
    console.log(this.baseUrl + type + 'check', data)

    return this.http.post<any>(this.baseUrl + type + 'check', data);
  }
}
