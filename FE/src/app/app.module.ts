import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AppRoutingModule} from './app.routing.model';
import {AppComponent} from './app.component';
import {authInterceptor} from 'src/app/modules/authentification/services/auth.interceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DATE_PIPE_DEFAULT_OPTIONS, DatePipe} from "@angular/common";
import {RegisterComponent} from 'src/app/modules/authentification/views/register/register.component';
import {LoginComponent} from 'src/app/modules/authentification/views/login/login.component';
import {ForgotPasswordComponent} from 'src/app/modules/authentification/views/forgot-password/forgot-password.component';
import {UserProfileComponent} from 'src/app/modules/authentification/views/user-profile/user-profile.component';
import {NavBarComponent} from 'src/app/modules/application/components/nav-bar/nav-bar.component';
import {SidebarComponent} from 'src/app/modules/application/components/sidebar/sidebar.component';
import {CheckTokenComponent} from 'src/app/modules/authentification/components/check-token/check-token.component';
import {ResetPasswordComponent} from 'src/app/modules/authentification/views/reset-password/reset-password.component';
import {FooterComponent} from 'src/app/modules/application/components/footer/footer.component';
import {HomeComponent} from "./modules/application/views/home/home.component";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FontAwesomeService} from 'src/plugins/font-awesome.service';
import {AuthorisationComponent} from "src/app/modules/authentification/views/authorisation/authorisation.component";
import {
  HeaderOfIndexModelComponent
} from 'src/app/modules/application/components/header-of-index-model/header-of-index-model.component';

// import {NgxPaginationModule} from 'ngx-pagination';
import {DatetimeComponent} from './modules/shared/components/datetime/datetime.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {PaginationComponent} from "./modules/shared/components/pagination/pagination.component";

import {FullCalendarModule} from '@fullcalendar/angular';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {PageNotFoundComponent} from "./modules/application/components/page-not-found/page-not-found.component";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {TaxComponent} from "./modules/product/modules/tax/view/tax/tax.component";
import {AddTaxComponent} from "./modules/product/modules/tax/view/add-tax/add-tax.component";
import {EditTaxComponent} from "./modules/product/modules/tax/view/edit-tax/edit-tax.component";
import {TaxFormComponent} from "./modules/product/modules/tax/component/tax-form/tax-form.component";
import {UnitComponent} from "./modules/product/modules/unit/view/unit/unit.component";
import { AddUnitComponent } from './modules/product/modules/unit/view/add-unit/add-unit.component';
import { EditUnitComponent } from './modules/product/modules/unit/view/edit-unit/edit-unit.component';
import { UnitFormComponent } from './modules/product/modules/unit/component/unit-form/unit-form.component';
import { CategoryFormComponent } from './modules/product/modules/category/component/category-form/category-form.component';
import { AddCategoryComponent } from './modules/product/modules/category/view/add-category/add-category.component';
import { EditCategoryComponent } from './modules/product/modules/category/view/edit-category/edit-category.component';
import { CategoryComponent } from './modules/product/modules/category/view/category/category.component';
import { ProductFormComponent } from './modules/product/component/product-form/product-form.component';
import { AddProductComponent } from './modules/product/view/add-product/add-product.component';
import { EditProductComponent } from './modules/product/view/edit-product/edit-product.component';
import { ProductComponent } from './modules/product/view/product/product.component';
import { DetailsProductComponent } from './modules/product/view/details-product/details-product.component';
import {ServiceFormComponent} from "./modules/work/component/service-form/service-form.component";
import {AddServiceComponent} from "./modules/work/view/add-service/add-service.component";
import {EditServiceComponent} from "./modules/work/view/edit-service/edit-service.component";
import {ServiceComponent} from "./modules/work/view/service/service.component";
import {DetailsServiceComponent} from "./modules/work/view/details-service/details-service.component";
import { CustomerComponent } from './modules/customer/view/customer/customer.component';
import { DetailsCustomerComponent } from './modules/customer/view/details-customer/details-customer.component';
import { EditCustomerComponent } from './modules/customer/view/edit-customer/edit-customer.component';
import { AddCustomerComponent } from './modules/customer/view/add-customer/add-customer.component';
import { CustomerFormComponent } from './modules/customer/component/customer-form/customer-form.component';
import { VehicleCustomerFormComponent } from './modules/customer/component/vehicle-customer-form/vehicle-customer-form.component';
import { InvoiceFormComponent } from './modules/invoice/component/invoice-form/invoice-form.component';
import { AddInvoiceComponent } from './modules/invoice/view/add-invoice/add-invoice.component';
import { EditInvoiceComponent } from './modules/invoice/view/edit-invoice/edit-invoice.component';
import { DetailsInvoiceComponent } from './modules/invoice/view/details-invoice/details-invoice.component';
import { InvoiceComponent } from './modules/invoice/view/invoice/invoice.component';
import { AboutComponent } from './modules/application/views/about/about.component';
import {FormCompanyComponent} from "./modules/company/view/form-company/form-company.component";
import { ProductForInvoiceComponent } from './modules/invoice/component/product-for-invoice/product-for-invoice.component';
import { ServiceForInvoiceComponent } from './modules/invoice/component/service-for-invoice/service-for-invoice.component';
import {InvoiceFileComponent} from "./modules/invoice/component/invoice-file/invoice-file.component";
import {QuillModule} from "ngx-quill";
import {
  PaymentForInvoiceComponent
} from "./modules/invoice/component/payment-for-invoice/payment-for-invoice-component";
import {MatTooltip} from "@angular/material/tooltip";
import {ExpenseTypeFormComponent} from './modules/expense/modules/expenseType/component/expense-type-form/expense-type-form.component';
import {
  AddExpenseTypeComponent
} from "./modules/expense/modules/expenseType/view/add-expense-type/add-expense-type.component";
import { EditExpenseTypeComponent } from './modules/expense/modules/expenseType/view/edit-expense-type/edit-expense-type.component';
import { ExpenseTypeComponent } from './modules/expense/modules/expenseType/view/expense-type/expense-type.component';
import {ExpenseFormComponent} from "./modules/expense/component/expense-form/expense-form.component";
import {AddExpenseComponent} from "./modules/expense/view/add-expense/add-expense.component";
import {EditExpenseComponent} from "./modules/expense/view/edit-expense/edit-expense.component";
import {DetailsExpenseComponent} from "./modules/expense/view/details-expense/details-expense.component";
import {ExpenseComponent} from "./modules/expense/view/expense/expense.component";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ForgotPasswordComponent,
        UserProfileComponent,
        NavBarComponent,
        SidebarComponent,
        CheckTokenComponent,
        ResetPasswordComponent,
        FooterComponent,
        HomeComponent,
        AuthorisationComponent,
        HeaderOfIndexModelComponent,
        DatetimeComponent,
        PaginationComponent,
        PageNotFoundComponent,
        TaxComponent,
        AddTaxComponent,
        EditTaxComponent,
        TaxFormComponent,
        UnitComponent,
        AddUnitComponent,
        EditUnitComponent,
        UnitFormComponent,
        CategoryFormComponent,
        AddCategoryComponent,
        EditCategoryComponent,
        CategoryComponent,
        ProductFormComponent,
        AddProductComponent,
        EditProductComponent,
        ProductComponent,
        DetailsProductComponent,
        ServiceFormComponent,
        AddServiceComponent,
        EditServiceComponent,
        ServiceComponent,
        DetailsServiceComponent,
        CustomerComponent,
        DetailsCustomerComponent,
        EditCustomerComponent,
        AddCustomerComponent,
        CustomerFormComponent,
        VehicleCustomerFormComponent,
        InvoiceFormComponent,
        AddInvoiceComponent,
        EditInvoiceComponent,
        DetailsInvoiceComponent,
        InvoiceComponent,
        AboutComponent,
        FormCompanyComponent,
        ProductForInvoiceComponent,
        ServiceForInvoiceComponent,
        InvoiceFileComponent,
        PaymentForInvoiceComponent,
        ExpenseTypeFormComponent,
        AddExpenseTypeComponent,
        EditExpenseTypeComponent,
        ExpenseTypeComponent,
        ExpenseFormComponent,
        AddExpenseComponent,
        EditExpenseComponent,
        DetailsExpenseComponent,
        ExpenseComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        // NgxPaginationModule,
        NgSelectModule,
        FullCalendarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        // configuration of toastrModule for Notification in Application
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
            closeButton: true,
            progressBar: true,
        }),
        CommonModule,
        BrowserAnimationsModule,
        QuillModule.forRoot(),
        MatTooltip
    ],
    providers: [
        DatePipe,
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: { dateFormat: "longDate" }
        },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    ] })

export class AppModule {
  constructor(public readonly fontAwesomeService: FontAwesomeService) {}
}
