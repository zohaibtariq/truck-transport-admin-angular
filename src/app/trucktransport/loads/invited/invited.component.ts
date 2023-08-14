import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invited',
  templateUrl: './invited.component.html',
  styleUrls: ['./invited.component.scss']
})
export class InvitedComponent implements OnInit {

  heading = 'Invited';
  status = 'assigned'; // it should be invited but actually it is assigned as per client glossary

  constructor(){ }

  ngOnInit(): void {
  }

}
