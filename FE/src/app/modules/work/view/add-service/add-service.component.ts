import { Component } from '@angular/core';
import {Service} from "../../model/service";

@Component({
  selector: 'app-add-service',
  standalone: false,
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css',
})
export class AddServiceComponent {
  service: Service = new Service();
}
