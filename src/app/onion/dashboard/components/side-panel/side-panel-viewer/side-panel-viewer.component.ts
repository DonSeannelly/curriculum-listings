import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidePanelOptions } from '../panel.directive';
import { fade } from '../panel.animations';

/*
[@slide]="{
          value: ':enter',
          params: {
            pixels: contentWidth + 40,
            outSpeed: outSpeed,
            inSpeed: inSpeed
          }
        }"
        */

@Component({
  selector: 'clark-side-panel-viewer',
  template: `
    <ng-container>
      <div *ngIf="isOpen" (activate)="close.emit()" [@fade] class="overlay"></div>
      <div
        [style.width]="contentWidth + 'px'"
        (activate)="$event.stopPropagation()"
        class="side-panel" [ngClass]="{'side-panel--no-padding': options && !options.padding}"
      >
        <ng-content></ng-content>
      </div>
    </ng-container>
  `,
  styleUrls: ['./side-panel-viewer.component.scss'],
  animations: [fade]
})
export class SidePanelViewerComponent implements OnInit, OnDestroy {
  _controller$: BehaviorSubject<boolean>;
  contentWidth = 400;

  options: SidePanelOptions;

  isOpen = true;

  @Output() close = new EventEmitter<void>();

  private defaultWidth = 350;
  private destroyed$: Subject<void> = new Subject();

  constructor() { }

  /**
   * Calculate the speed necessary to open te side panel
   *
   * @readonly
   * @memberof SidePanelViewerComponent
   */
  get outSpeed() {
    return 350 + (this.contentWidth - this.defaultWidth) * 0.3;
  }

  /**
   * Calculate the speed necessary to close the side panel
   *
   * @readonly
   * @memberof SidePanelViewerComponent
   */
  get inSpeed() {
    return 250 + (this.contentWidth - this.defaultWidth) * 0.3;
  }

  ngOnInit() {
    this.close.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.isOpen = false;
    })
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
