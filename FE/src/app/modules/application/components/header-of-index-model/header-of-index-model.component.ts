import {Component, Input} from '@angular/core';
import {capitalizeFirstLetter} from '../../app.global';

@Component({
  selector: 'app-header-of-index-model',
  templateUrl: './header-of-index-model.component.html',
  standalone: false,
})

export class HeaderOfIndexModelComponent {
  @Input()
  model:string;
  @Input()
  length:number;
  capitalizeFirstLetter = capitalizeFirstLetter;
}
