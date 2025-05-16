import { Component } from '@angular/core';
import { CarouselComponent } from "./components/carousel/carousel.component";
import { DrawerComponent } from './components/drawer/drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CarouselComponent, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boilerplate-angular'
}
