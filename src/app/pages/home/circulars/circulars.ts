import { Component, OnInit } from '@angular/core';
import { CircularsService } from '../../../services/circulars.service';
import { News } from '../../../models/news.model';

@Component({
  selector: 'app-circulars',
  imports: [],
  templateUrl: './circulars.html',
  styleUrl: './circulars.scss',
})
export class Circulars implements OnInit {

  // Properties
  circulars: News[] = [];

  // Constructor
  constructor(private circularsService: CircularsService) { }

  // Lifecycle Method
  ngOnInit(): void {

    this.circularsService.getCirculars().subscribe(data => {

  console.log("API Length:", data.length);

  this.circulars = [...data];

  console.log("Component Length:", this.circulars.length);

  console.log("First Item:", this.circulars[0]);

});
  }

}