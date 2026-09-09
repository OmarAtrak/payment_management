import {Component, Input} from '@angular/core';
import {Unit} from "../../model/unit";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../../../application/services/notification.service";
import {Router} from "@angular/router";
import {UnitService} from "../../service/unit.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-unit-form',
  standalone: false,
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.css',
})
export class UnitFormComponent {
  @Input()
  unit: Unit;
  form: FormGroup;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  constructor(
    private readonly unitService: UnitService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      abbreviation: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.unit.id) {
      this.form.controls['name'].setValue(this.unit.name);
      this.form.controls['abbreviation'].setValue(this.unit.abbreviation);
    }
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.unit.name = values.name;
      this.unit.abbreviation = values.abbreviation;

      this.unitService.save(this.unit).subscribe({
        next: (savedUnit: Unit) => {
          if (savedUnit) {
            if (!this.unit.id) {
              this.notificationService.saveSuccessMessage();
            }
            else {
              this.notificationService.editSuccessMessage();
            }
            this.router.navigateByUrl('/units');
          }
        },
        error: err => {
          console.error(err)
          if (!this.unit.id) {
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
