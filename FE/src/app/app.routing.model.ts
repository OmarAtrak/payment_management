import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from 'src/app/modules/authentification/services/auth.guard.service';

// reset password
import {ResetPasswordComponent} from 'src/app/modules/authentification/views/reset-password/reset-password.component';

// token of reset password
import {CheckTokenComponent} from 'src/app/modules/authentification/components/check-token/check-token.component';

// login
import {LoginComponent} from 'src/app/modules/authentification/views/login/login.component';

// dashboard
import {HomeComponent} from 'src/app/modules/application/views/home/home.component';

// profile
import {UserProfileComponent} from 'src/app/modules/authentification/views/user-profile/user-profile.component';

// authorisation
import {AuthorisationComponent} from "src/app/modules/authentification/views/authorisation/authorisation.component";

import {PageNotFoundComponent} from "./modules/application/components/page-not-found/page-not-found.component";
import {TaxComponent} from "./modules/product/modules/tax/view/tax/tax.component";
import {AddTaxComponent} from "./modules/product/modules/tax/view/add-tax/add-tax.component";
import {EditTaxComponent} from "./modules/product/modules/tax/view/edit-tax/edit-tax.component";
import {UnitComponent} from "./modules/product/modules/unit/view/unit/unit.component";
import {AddUnitComponent} from "./modules/product/modules/unit/view/add-unit/add-unit.component";
import {EditUnitComponent} from "./modules/product/modules/unit/view/edit-unit/edit-unit.component";
import {CategoryComponent} from "./modules/product/modules/category/view/category/category.component";
import {AddCategoryComponent} from "./modules/product/modules/category/view/add-category/add-category.component";
import {EditCategoryComponent} from "./modules/product/modules/category/view/edit-category/edit-category.component";
import {ProductComponent} from "./modules/product/view/product/product.component";
import {AddProductComponent} from "./modules/product/view/add-product/add-product.component";
import {EditProductComponent} from "./modules/product/view/edit-product/edit-product.component";
import {DetailsProductComponent} from "./modules/product/view/details-product/details-product.component";
import {ServiceComponent} from "./modules/work/view/service/service.component";
import {AddServiceComponent} from "./modules/work/view/add-service/add-service.component";
import {EditServiceComponent} from "./modules/work/view/edit-service/edit-service.component";
import {DetailsServiceComponent} from "./modules/work/view/details-service/details-service.component";
import {CustomerComponent} from "./modules/customer/view/customer/customer.component";
import {AddCustomerComponent} from "./modules/customer/view/add-customer/add-customer.component";
import {EditCustomerComponent} from "./modules/customer/view/edit-customer/edit-customer.component";
import {DetailsCustomerComponent} from "./modules/customer/view/details-customer/details-customer.component";
import {AboutComponent} from "./modules/application/views/about/about.component";
import {InvoiceComponent} from "./modules/invoice/view/invoice/invoice.component";
import {AddInvoiceComponent} from "./modules/invoice/view/add-invoice/add-invoice.component";
import {EditInvoiceComponent} from "./modules/invoice/view/edit-invoice/edit-invoice.component";
import {DetailsInvoiceComponent} from "./modules/invoice/view/details-invoice/details-invoice.component";
import {FormCompanyComponent} from "./modules/company/view/form-company/form-company.component";
import {ExpenseTypeComponent} from "./modules/expense/modules/expenseType/view/expense-type/expense-type.component";
import {
  AddExpenseTypeComponent
} from "./modules/expense/modules/expenseType/view/add-expense-type/add-expense-type.component";
import {
  EditExpenseTypeComponent
} from "./modules/expense/modules/expenseType/view/edit-expense-type/edit-expense-type.component";
import {ExpenseComponent} from "./modules/expense/view/expense/expense.component";
import {DetailsExpenseComponent} from "./modules/expense/view/details-expense/details-expense.component";
import {AddExpenseComponent} from "./modules/expense/view/add-expense/add-expense.component";
import {EditExpenseComponent} from "./modules/expense/view/edit-expense/edit-expense.component";


const routes: Routes = [
  // dashboard
  {
    path: '',
    component: HomeComponent,
  },
  // {
  //   path: 'dashboard',
  //   redirectTo: ''
  // },

  // login
  {
    path: 'login',
    component: LoginComponent
  },

  // token of reset password
  {
    path: 'check-token/:email',
    component: CheckTokenComponent
  },

  // reset password
  {
    path: 'reset-password/:email/:token',
    component: ResetPasswordComponent
  },

  // profile
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/:email',
    component: UserProfileComponent,
    canActivate: [AuthGuardService]
  },

  // tax
  {
    path: 'taxes',
    component: TaxComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'taxes/add',
    component: AddTaxComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'taxes/edit/:id',
    component: EditTaxComponent,
    canActivate: [AuthGuardService]
  },

  // unit
  {
    path: 'units',
    component: UnitComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'units/add',
    component: AddUnitComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'units/edit/:id',
    component: EditUnitComponent,
    canActivate: [AuthGuardService]
  },

  // categories
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'categories/add',
    component: AddCategoryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'categories/edit/:id',
    component: EditCategoryComponent,
    canActivate: [AuthGuardService]
  },

  // products
  {
    path: 'products',
    component: ProductComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'products/add',
    component: AddProductComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'products/edit/:id',
    component: EditProductComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'products/details/:id',
    component: DetailsProductComponent,
  },

  // services
  {
    path: 'services',
    component: ServiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'services/add',
    component: AddServiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'services/edit/:id',
    component: EditServiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'services/details/:id',
    component: DetailsServiceComponent,
    canActivate: [AuthGuardService]
  },

  // customers
  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'customers/add',
    component: AddCustomerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'customers/edit/:id',
    component: EditCustomerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'customers/details/:id',
    component: DetailsCustomerComponent,
    canActivate: [AuthGuardService]
  },

  // company
  {
    path: 'my-company',
    component: FormCompanyComponent,
    canActivate: [AuthGuardService]
  },

  // about
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuardService]
  },

  // invoices
  {
    path: 'invoices',
    component: InvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoices/add',
    component: AddInvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoices/edit/:id',
    component: EditInvoiceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoices/details/:id',
    component: DetailsInvoiceComponent,
    canActivate: [AuthGuardService]
  },

  // authorisation
  {
    path: 'users',
    component: AuthorisationComponent,
    canActivate: [AuthGuardService]
  },

  // expenses types
  {
    path: 'expense-types',
    component: ExpenseTypeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'expense-types/add',
    component: AddExpenseTypeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'expense-types/edit/:id',
    component: EditExpenseTypeComponent,
    canActivate: [AuthGuardService]
  },


  // expenses
  {
    path: 'expenses',
    component: ExpenseComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'expenses/details/:id',
    component: DetailsExpenseComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'expenses/add',
    component: AddExpenseComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'expenses/edit/:id',
    component: EditExpenseComponent,
    canActivate: [AuthGuardService]
  },


  // page not found
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
