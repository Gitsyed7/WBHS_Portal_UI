import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckHRMSResponse } from '../models/check-hrms-response';

@Injectable({
  providedIn: 'root'
})
export class CollegeRegistrationService {
private apiUrl =
    environment.apiUrl;

  constructor(
    private http: HttpClient
) {

}
  checkHRMS(hrmsId: string): Observable<CheckHRMSResponse> {

    return this.http.post<CheckHRMSResponse>(
        `${this.apiUrl}/CollegeRegistration/check-hrms`,
        {
            hrmsId: hrmsId
        }
    );
    
}
saveCollegeRegistration(request: any) {
  return this.http.post<any>(
    `${this.apiUrl}/CollegeRegistration/save-college-registration`,
    request
  );

}
savePersonalInformation(request: any): Observable<any> {
  return this.http.post<any>(
    `${environment.apiUrl}/CollegeRegistration/save-personal-information`,
    request
  );
}
getPersonalInformation(
  appId: string,
  hrmsId: string
): Observable<any> {

  return this.http.post<any>(
    `${environment.apiUrl}/CollegeRegistration/get-personal-information`,
    {
      appId,
      hrmsId
    }
  );
}
}