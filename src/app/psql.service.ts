import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mines } from './_models/mines';

@Injectable({
  providedIn: 'root'
})
export class PsqlService {

  constructor(private http: HttpClient) { }
  baseUrl = 'https://www.warshipapi.booshay.info/'

  test() {
    return this.http.get(this.baseUrl)
  }

  getCoords(type: string, user: any): Observable<Mines[]> {
    const body = { type, user }; // Structure the request body
    return this.http.post<any>(`${this.baseUrl}get${type}`, body); // Send the structured body
  }

  addCoord(type: string, data: any, user: any): Observable<Mines[]> {
    const body = { ...data, user }; // Attach user to data object
    return this.http.post<any>(`${this.baseUrl}${type}`, body); // Post structured data
  }

  deleteCoord(type: string, id: number): Observable<Mines[]> {
    return this.http.delete<any>(`${this.baseUrl}${type}/${id}`); // Direct delete
  }

  updateCoord(type: string, id: number, enhancement: any): Observable<Mines[]> {
    const body = { enhanced: enhancement }; // Structured body for update
    return this.http.put<any>(`${this.baseUrl}${type}/${id}`, body); // Put request
  }

  runQuery(query: { query: string }): Observable<Mines[]> {
    //  const body = { query }; // Wrap query string in body
    return this.http.post<any>(`${this.baseUrl}query`, query); // Post query
  }

  coordCheck(coords: any): Observable<Mines[]> {
    const body = { position: coords }; // Structured body for coordCheck
    return this.http.post<any>(`${this.baseUrl}coordCheck`, body); // Post request
  }

  checkIfCoordExists(type: string, position: any, user: any): Observable<any> {
    const body = { position, user }; // Structured body for duplicate check
    console.log(`${this.baseUrl}${type}check`, body);
    return this.http.post<any>(`${this.baseUrl}${type}check`, body); // Post request
  }

  /*   getCoords(type, user): Observable<any> {
    console.log(this.baseUrl + "get" + type, user)
    return this.http.post<any>(this.baseUrl + "get" + type, user)
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
  } */
}
