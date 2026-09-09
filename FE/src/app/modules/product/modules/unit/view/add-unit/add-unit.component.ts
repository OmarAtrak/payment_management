import { Component } from '@angular/core';
import {Unit} from "../../model/unit";

@Component({
  selector: 'app-add-unit',
  standalone: false,
  templateUrl: './add-unit.component.html',
  styleUrl: './add-unit.component.css',
})
export class AddUnitComponent {
  unit: Unit = new Unit();
}
