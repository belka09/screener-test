import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './components/toaster/toaster.component';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToasterComponent,
    LoaderComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
