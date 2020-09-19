import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FirebaseService } from '../../core/services/firebase.service';
import { states } from './states';

@Component({
  selector: 'app-ski-form',
  templateUrl: './ski-form.component.html',
  styleUrls: ['./ski-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class SkiFormComponent implements OnInit {
  loading = false;
  form: FormGroup;
  states = states;

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getSurveySubmissions();
    this.initializeForm();
  }

  /** Submits the survey response. */
  submitForm(): void {
    this.loading = true;
    this.firebaseService
      .addSurveySubmission(this.form.value)
      .then(
        () => this.openDialog(true),
        () => this.openDialog(false)
      )
      .catch(() => this.openDialog(false));
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      skiedBefore: [undefined, [Validators.required]],
      lastTimeSkiing: [undefined, [Validators.required]],
      placesSkied: this.formBuilder.group({
        marquetteMountain: false,
        pineMountain: false,
        skiBrule: false,
        bigPowderHorn: false
      }),
      numberOfPeople: [undefined, [Validators.required]],
      leaveDayOrNight: [undefined, [Validators.required]],
      canSkiWeekday: [undefined, [Validators.required]],
      contactInformation: this.formBuilder.group({
        firstName: [undefined, [Validators.required]],
        lastName: [undefined, [Validators.required]],
        email: [undefined, [Validators.required, Validators.email]],
        address1: [undefined, [Validators.required]],
        address2: undefined,
        city: [undefined, [Validators.required]],
        state: [undefined, [Validators.required]],
        zip: [undefined, [Validators.required, Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)]]
      }),
      additionalSpecials: false,
      recaptcha: [undefined, [Validators.required]]
    });
  }

  /** Opens the dialog */
  private openDialog(success: boolean): void {
    this.loading = false;
    this.dialog.open(DialogComponent, {
      maxWidth: '600px',
      disableClose: true,
      data: { success }
    });
  }
}

export interface DialogData {
  success: boolean;
}

@Component({
  selector: 'app-dialog',
  template: `<div *ngIf="success">
      <p>
        Thank you for completing this survey. Your free or discounted lifted tickets will be processed and sent out
        shortly.
      </p>
      <p>
        Limit 2 free or discounted lift tickets per family or group. Lift tickets are non transferable, id required.
        Lift tickets are good for the 2020/2021 ski season.
      </p>
      <p>Thank you and we look forward to seeing you on the slopes this winter.</p>
      <p>You may now close this window.</p>
    </div>
    <div *ngIf="!success">
      <p>An error occurred, please refresh and try again.</p>
    </div>`
})
export class DialogComponent implements OnInit {
  success = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.success = this.data.success;
  }
}
