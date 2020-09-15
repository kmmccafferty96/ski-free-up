import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [],
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, FontAwesomeModule],
  exports: [MatSidenavModule, MatToolbarModule, MatButtonModule, FontAwesomeModule]
})
export class CoreModule {
  constructor(private iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(faBars, faFacebook, faInstagram, faTwitter);
  }
}
