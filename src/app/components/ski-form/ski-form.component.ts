import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ski-form',
  templateUrl: './ski-form.component.html',
  styleUrls: ['./ski-form.component.scss']
})
export class SkiFormComponent {
  states = [
    'Alabama',
    'Alaska',
    'American Samoa',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Florida',
    'Georgia',
    'Guam',
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
    'Minor Outlying Islands',
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
    'Northern Mariana Islands',
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
    'U.S. Virgin Islands',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '600px',
      disableClose: true
    });
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
export class ConfirmationDialogComponent {
  constructor() {}
}
