import {Component, Input} from '@angular/core';
import {Category} from "../../model/category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../service/category.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent {
  @Input()
  category: Category;
  form: FormGroup;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.category.id) {
      this.form.controls['name'].setValue(this.category.name);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.category.name = values.name;

      this.categoryService.save(this.category).subscribe({
        next: (savedCategory: Category) => {
          if (savedCategory) {
            if (!this.category.id) {
              this.notificationService.saveSuccessMessage();
            }
            else {
              this.notificationService.editSuccessMessage();
            }
            this.router.navigateByUrl('/categories');
          }
        },
        error: err => {
          console.error(err)
          if (!this.category.id) {
            this.notificationService.saveFailedMessage();
          }
          else {
            this.notificationService.editFailedMessage();
          }
        }
      });
    }
  }
}
