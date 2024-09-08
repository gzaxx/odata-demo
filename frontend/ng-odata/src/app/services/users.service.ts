import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public getUsers<T>(params: HttpParams): Observable<Response<T>> {
    params = params.append('$count', 'true');

    return this.http.get<Response<T>>('/api/odata/Users', {
      params: params,
    });
  }
}
