import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  loading = false;
  placesSkiedArr = [];
  states = states;

  get placesSkiedFormArray(): FormArray {
    return this.form.controls.placesSkied as FormArray;
  }

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getSurveySubmissions();
    this.initializeForm();
  }

  /** Adds the form value to the places skied form array when one is checked. */
  onCheckboxChange(e: any): void {
    if (e.checked) {
      this.placesSkiedFormArray.push(new FormControl(e.source.value));
    } else {
      let i = 0;
      this.placesSkiedFormArray.controls.forEach((item: FormControl) => {
        if (item.value === e.source.value) {
          this.placesSkiedFormArray.removeAt(i);
          return;
        }
        i++;
      });
    }
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
      placesSkied: this.formBuilder.array([]),
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
      recaptcha: [undefined, [Validators.required]],
      uniqueId: this.generateRandomId(12)
    });

    this.getRandomPlacesSkied(4);
  }

  private getRandomPlacesSkied(numPlacesToSelect: number): void {
    const allPossiblePlacesArr = [
      'Big Snow Resort',
      'Mont Ripley',
      'Big Powderhorn',
      'Mount Bohemia',
      'Marquette Mountain',
      'Pine Mountain',
      'Ski Brule',
      'Mount Zion',
      'Porcupine Mountains'
    ];

    this.placesSkiedArr = this.selectRandomArrayValues(allPossiblePlacesArr, numPlacesToSelect);
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

  private selectRandomArrayValues(array: any[], n: number): any[] {
    return array.sort(() => Math.random() - Math.random()).slice(0, n);
  }

  private generateRandomId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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
