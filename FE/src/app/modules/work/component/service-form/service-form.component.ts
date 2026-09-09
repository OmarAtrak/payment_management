import {Component, Input, OnInit} from '@angular/core';
import {Service} from "../../model/service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WorkService} from "../../service/work.service";
import {NotificationService} from "../../../application/services/notification.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Tax} from "../../../product/modules/tax/model/tax";
import {TaxService} from "../../../product/modules/tax/service/tax.service";

@Component({
  selector: 'app-service-form',
  standalone: false,
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css',
})
export class ServiceFormComponent implements OnInit {
  @Input()
  service: Service;
  form: FormGroup;
  taxes: Array<Tax> = [];
  isLoadingTaxes = false;

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['link']
    ]
  };

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly workService: WorkService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly taxService: TaxService,
  ) {
    this.form = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      price: [100, [Validators.required, Validators.min(0)]],
      tax: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.service.id) {
      this.form.controls['code'].setValue(this.service.code);
      this.form.controls['name'].setValue(this.service.name);
      this.form.controls['description'].setValue(this.service.descriptionHtml ?? null);
      this.form.controls['price'].setValue(this.service.price ?? 0);
    }

    this.loadTaxes();
  }

  loadTaxes(): void {
    this.taxes = [];
    this.isLoadingTaxes = false;

    this.taxService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.taxes = data.map((item: any) => Tax.fromJson(item));
          this.isLoadingTaxes = true;

          if (this.service.id) {
            this.form.controls['tax'].setValue(this.service.tax.id ?? null);
          }
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.service.code = values.code;
      this.service.name = values.name;
      this.service.descriptionHtml = values.description;
      this.service.description = values.description
        ?
        values.description
          .replace(/<\/p>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim()
        :
        '';
      this.service.price = values.price;

      const tax: Tax = new Tax();
      tax.id = values.tax;
      this.service.tax = tax;

      this.workService.save(this.service)
        .subscribe({
          next: (savedService: Service) => {
            if (savedService) {
              if (!this.service.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.router.navigateByUrl('/services');
            }
          },
          error: err => {
            console.error(err)
            if (!this.service.id) {
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
