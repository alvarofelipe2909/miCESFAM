import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent   {
  resetForm: FormGroup;

  constructor(
    private auths: AuthService,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      email:['', Validators.required]
    })
  }
  
  submitEmail(){
    this.auths.passwordReset(this.resetForm.value.email)
  }

}
