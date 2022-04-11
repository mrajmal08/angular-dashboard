import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import {Router} from "@angular/router"
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submitted = false;
  message: boolean = false;

  constructor(
    private authSerivce: AuthServiceService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // this.formGroup = this.formBuilder.group(
    //   {
    //     email: ['',
    //      [
    //        Validators.required,
    //        Validators.email
    //       ]],
    //     password: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(6),
    //         Validators.maxLength(40)
    //       ]
    //     ],
    //   },
    // );
  }

  showDanger(message:any) {
    this.toastr.warning('Validation Error!', message);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  loginProcess(): void {
    this.submitted = true;
    if (this.formGroup.invalid) {
      setTimeout(() => {
        this.submitted = false;
        this.formGroup.reset();
      }, 2000);

      return;
    }
    
    this.authSerivce.login(this.formGroup.value).subscribe(
      (res) => {
        let data = res;
        if (data.status === true) {
          console.log(data.data.token);
          this.router.navigate(['/dashboard'])
        }
      },
      (error) => {
        if(error.status == 401){
          // this.message = true;
          this.showDanger('invalid email or password');
        };
      }
    );
  }
}
