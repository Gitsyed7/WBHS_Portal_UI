import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollegeRegistrationService {

  constructor(private service: CollegeRegistrationService) {}
  
}