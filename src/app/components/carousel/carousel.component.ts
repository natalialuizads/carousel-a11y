import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  currentPanelIndex = 0;
  autoplayActive = true;
  alerts: string[] = [];
  panels = ['rose', 'tulip', 'sunflower'];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDirection(direction: 'previous' | 'next') {
    this.currentPanelIndex = direction === 'previous'
      ? (this.currentPanelIndex === 0 ? this.panels.length - 1 : this.currentPanelIndex - 1)
      : (this.currentPanelIndex === this.panels.length - 1 ? 0 : this.currentPanelIndex + 1);

    this.showAlert(`Showing panel ${this.currentPanelIndex + 1} of ${this.panels.length}`);
  }

  toggleAutoplay() {
    this.autoplayActive = !this.autoplayActive;
    if (this.autoplayActive) this.startAutoplay();
  }

  private startAutoplay() {
    timer(3000, 3000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.autoplayActive) {
        this.handleDirection('next');
      }
    });
  }

  private showAlert(message: string) {
    this.alerts.push(message);
    setTimeout(() => {
      this.alerts = [];
    }, 2000);
  }
}
