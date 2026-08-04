import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Gender } from '../models/gender.model';
import { MaritalStatus } from '../models/marital-status.model';
import { District } from '../models/district.model';
import { IfscRequest } from '../models/ifsc-Request.model';
import { IfscResponse } from '../models/ifsc-Response.model';

@Injectable({
  providedIn: 'root',
})
export class LookupService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}`;

  getGender(): Observable<Gender[]> {
    return this.http.get<Gender[]>(
        `${this.apiUrl}/CollegeRegistration/gender`
    );
}

getMaritalStatus(): Observable<MaritalStatus[]> {
    return this.http.get<MaritalStatus[]>(
        `${this.apiUrl}/CollegeRegistration/maritalStatus`
    );
}

getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(
        `${this.apiUrl}/CollegeRegistration/district`
    );
}
getIfscDetails(request: IfscRequest): Observable<IfscResponse | null> {
  return this.http.post<IfscResponse | null>(
    `${this.apiUrl}/Ifsc/details`,
    request
  );
}
}
