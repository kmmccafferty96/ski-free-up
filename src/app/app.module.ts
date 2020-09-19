import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DialogComponent, SkiFormComponent } from './components/ski-form/ski-form.component';

@NgModule({
  declarations: [AppComponent, SkiFormComponent, DialogComponent],
  imports: [CommonModule, BrowserModule, CoreModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
