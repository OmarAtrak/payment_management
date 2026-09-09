import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.css'],
  standalone: false,
})
export class DatetimeComponent implements OnInit {
  public currentDateTime: Date;

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime(): void {
    this.currentDateTime = new Date();
  }
}
