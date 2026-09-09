import { Component } from '@angular/core';
import {Product} from "../../model/product";

@Component({
  selector: 'app-add-product.',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  product: Product = new Product();
}
