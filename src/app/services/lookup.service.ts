import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Gender } from '../models/gender.model';
import { MaritalStatus } from '../models/marital-status.model';
import { District } from '../models/district.model';

@Injectable({
  providedIn: 'root',
})
export class LookupService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/CollegeRegistration`;

  getGender(): Observable<Gender[]> {
    return this.http.get<Gender[]>(
        `${this.apiUrl}/gender`
    );
}

getMaritalStatus(): Observable<MaritalStatus[]> {
    return this.http.get<MaritalStatus[]>(
        `${this.apiUrl}/maritalStatus`
    );
}

getDistrict(): Observable<District[]> {
    return this.http.get<District[]>(
        `${this.apiUrl}/district`
    );
}

}
