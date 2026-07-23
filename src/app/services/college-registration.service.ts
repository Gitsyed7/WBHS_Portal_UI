import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckHRMSResponse } from '../models/check-hrms-response';

@Injectable({
  providedIn: 'root'
})
export class CollegeRegistrationService {

  constructor(
    private http: HttpClient
) {

}
  checkHRMS(hrmsId: string): Observable<CheckHRMSResponse> {

    return this.http.post<CheckHRMSResponse>(
        'http://localhost:5114/api/CollegeRegistration',
        {
            hrmsId: hrmsId
        }
    );
}
}