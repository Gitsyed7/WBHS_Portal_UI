import { Component, OnInit } from '@angular/core';
import { CircularsService } from '../../../services/circulars.service';
import { News } from '../../../models/news.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-circulars',
  imports: [],
  standalone: true,
  templateUrl: './circulars.html',
  styleUrl: './circulars.scss',
})
export class Circulars implements OnInit {

  // Properties
  circulars: News[] = [];

  loading = true;
  // Constructor
  constructor(private circularsService: CircularsService,
  private cdr: ChangeDetectorRef) { }
  

  // Lifecycle Method
  ngOnInit(): void {

  console.log("1. Before API Call");

  this.circularsService.getCirculars().subscribe({

    next: (data) => {

      console.log("2. Inside next()");
      console.log(data);

      this.circulars = data;
      
      this.loading = false;
this.cdr.detectChanges();

console.log("View updated");


      
      console.log("3. Loading =", this.loading);

    },

    error: (err) => {

      console.log("4. ERROR");
      console.error(err);

      this.loading = false;

    },

    complete: () => {

      console.log("5. Completed");

    }

  });

}

}