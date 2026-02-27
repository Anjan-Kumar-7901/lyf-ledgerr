import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  private apiUrl = 'https://localhost:7035/api/Days';

  constructor(private http: HttpClient) {}

  getDays() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
