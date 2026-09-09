import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-check-token',
  templateUrl: './check-token.component.html',
  standalone: false,
})

export class CheckTokenComponent implements OnInit {
  checkTokenForm:FormGroup
  email:string;

  constructor(private formBuilder:FormBuilder, private router:Router, private userService:UserService, private activatedRoute:ActivatedRoute) {
    this.checkTokenForm = this.formBuilder.group({
      token1: ['', Validators.required],
      token2: ['', Validators.required],
      token3: ['', Validators.required],
      token4: ['', Validators.required],
      token5: ['', Validators.required],
      token6: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const email = params.get('email');
      if (email != undefined) {
        this.email = email.toString();
      }
    });
  }

  async checkToken() {
    if (this.checkTokenForm.valid) {
      const token = this.checkTokenForm.get('token1')?.value +
                    this.checkTokenForm.get('token2')?.value +
                    this.checkTokenForm.get('token3')?.value +
                    this.checkTokenForm.get('token4')?.value +
                    this.checkTokenForm.get('token5')?.value +
                    this.checkTokenForm.get('token6')?.value;

      await this.userService.checkToken(token, this.email)
      .subscribe((response) => {
        if (response != undefined) {
          if (response === 'Token Valid') {
            this.router.navigate([`reset-password/${this.email}/${token}`]);
          }
        }
      });
    }
  }

  enterToken(index:number) {
    if(this.checkTokenForm.controls['token'+index].value !== '') {
      (document.getElementById('token'+(index+1)) as HTMLInputElement).focus();
    }
  }

  // cancel validation token
  cancelCheckToken() {
    this.router.navigate(['login']);
  }
}
