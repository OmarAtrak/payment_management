import { Component } from '@angular/core';
import {Category} from "../../model/category";

@Component({
  selector: 'app-add-category',
  standalone: false,
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent {
  category: Category = new Category();
}
