import { Component } from '@angular/core';
import {Category} from "../../model/category";
import {CategoryService} from "../../service/category.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-category',
  standalone: false,
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent {
  currentCategory: Category = new Category();
  isLoading: boolean = false;
  id: number;


  constructor(
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id != undefined) {
          this.id = Number(id);
        }
      });

    // get category by id
    this.getCategory(this.id);
  }

  getCategory(id: number): void {
    this.categoryService.get(id)
      .subscribe({
        next: response => {
          this.currentCategory = Category.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
