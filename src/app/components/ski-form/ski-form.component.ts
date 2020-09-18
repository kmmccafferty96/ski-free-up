import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

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
  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'Washington D.C.',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  form: FormGroup;

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
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
      additionalSpecials: false
    });
  }

  /** Opens the success dialog */
  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '600px',
      disableClose: true
    });
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `<p>
      Thank you for completing this survey. Your free or discounted lifted tickets will be processed and sent out
      shortly.
    </p>
    <p>
      Limit 2 free or discounted lift tickets per family or group. Lift tickets are non transferable, id required. Lift
      tickets are good for the 2020/2021 ski season.
    </p>
    <p>Thank you and we look forward to seeing you on the slopes this winter.</p>`
})
export class ConfirmationDialogComponent {}
