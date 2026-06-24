import { Component } from '@angular/core';

@Component({
  selector: 'app-whats-new',
  imports: [],
  templateUrl: './whats-new.html',
  styleUrl: './whats-new.scss',
})
export class WhatsNew {
  notices = [

    {
      message: 'Fresh Enrolment of Employees & Pensioners of Govt. of WB under West Bengal Health Scheme is now open till 31.07.2026.',
      reference: 'See G.O. No. 51-F(MED)WB dtd. 02/06/2026',
      url: '/pdf/51-F(MED)WB.pdf'
    },

    {
      message: 'Updated list of Inadmissible Items Under WBHS',
      reference: ''
    },

    {
      message: 'New Hospital Registration Guidelines',
      reference: ''
    }

  ];

}

