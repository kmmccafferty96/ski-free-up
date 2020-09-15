import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  logo = '../../assets/logo.png';
  navigation = [
    { link: 'home', label: 'Home' },
    { link: 'menu', label: 'Menu' },
    { link: 'location', label: 'Location' },
    { link: 'events', label: 'Events' },
    { link: 'contact', label: 'Contact' }
  ];
}
