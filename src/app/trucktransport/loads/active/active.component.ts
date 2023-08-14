import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  heading = 'Active';
  status = 'pending,tender,active,assigned,enroute';

  constructor(){ }

  ngOnInit(): void {
    //
  }

}
