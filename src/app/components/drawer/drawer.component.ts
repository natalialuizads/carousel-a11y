// drawer.component.ts
import {
  Component, Input, Output, EventEmitter,
  TemplateRef, ContentChild, HostListener,
  ElementRef, ViewChild, Renderer2,
  AfterViewInit, OnDestroy, booleanAttribute
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
  animations: [
    trigger('drawerAnimation', [
      state('void', style({ transform: '{{ hiddenTransform }}' }),
        { params: { hiddenTransform: 'translateX(-100%)' } }),
      state('visible', style({ transform: 'none' })),
      transition('void <=> visible', animate('300ms ease-in-out'))
    ])
  ]
})
export class DrawerComponent implements AfterViewInit, OnDestroy {
  @Input({ transform: booleanAttribute }) dismissible: boolean = true;
  @Input({ transform: booleanAttribute }) showCloseButton: boolean = true;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() width: string = '300px';
  @Input() height: string = '100%';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  @ContentChild('header') headerTemplate?: TemplateRef<any>;

  @ViewChild('drawer') drawer!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  isVisible = false;
  hiddenTransform = 'translateX(-100%)';
  private focusableElements: HTMLElement[] = [];
  private lastFocusedElement?: HTMLElement;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setupPosition();
    this.setupFocusableElements();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  toggle(): void {
    this.isVisible ? this.hide() : this.show();
  }

  show(): void {
    if (this.isVisible) return;

    this.lastFocusedElement = document.activeElement as HTMLElement;
    this.isVisible = true;
    this.setupPosition();
    this.blockPageScroll(true);
    this.visibleChange.emit(true);
    this.onShow.emit();
    setTimeout(() => this.setFocusToFirstElement(), 300);
  }

  hide(): void {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.blockPageScroll(false);
    this.visibleChange.emit(false);
    this.onHide.emit();
    this.lastFocusedElement?.focus();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isVisible && this.dismissible) {
      this.hide();
    }
  }

  private setupPosition(): void {
    const isVertical = this.position === 'top' || this.position === 'bottom';
    const drawerEl = this.drawer.nativeElement;

    this.renderer.setStyle(drawerEl, 'width', isVertical ? '100%' : this.width);
    this.renderer.setStyle(drawerEl, 'height', isVertical ? this.height : '100%');

    switch (this.position) {
      case 'right':
        this.hiddenTransform = 'translateX(100%)';
        break;
      case 'top':
        this.hiddenTransform = 'translateY(-100%)';
        break;
      case 'bottom':
        this.hiddenTransform = 'translateY(100%)';
        break;
      default:
        this.hiddenTransform = 'translateX(-100%)';
    }
  }

  private blockPageScroll(block: boolean): void {
    const body = document.body;
    block ?
      this.renderer.setStyle(body, 'overflow', 'hidden') :
      this.renderer.removeStyle(body, 'overflow');
  }

  private setupFocusableElements(): void {
    this.focusableElements = Array.from(
      this.content.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  private setFocusToFirstElement(): void {
    this.focusableElements[0]?.focus();
  }
}
