import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assigned',
  templateUrl: './assigned.component.html',
  styleUrls: ['./assigned.component.scss']
})
export class AssignedComponent implements OnInit {

  heading = 'Assigned';
  status = 'active';

  constructor(){ }

  ngOnInit(): void {

  }

}
