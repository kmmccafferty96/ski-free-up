import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  surveySubmissionsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {}

  getSurveySubmissions(): AngularFireList<any> {
    this.surveySubmissionsRef = this.db.list('survey-submission-list');
    return this.surveySubmissionsRef;
  }

  addSurveySubmission(formValue: any): void {
    this.surveySubmissionsRef.push(formValue);
  }
}
