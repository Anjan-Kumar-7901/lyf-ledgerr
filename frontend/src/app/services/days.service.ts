import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  private apiUrl = 'http://localhost:5130/api/Days';

  constructor(private http: HttpClient) {}

  getDays() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
