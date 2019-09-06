import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'arch-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  @Input() isServerError: boolean;

  constructor() { }

  ngOnInit() {
  }

}
