import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import { UtilityService } from 'app/core/utility-module/utility.service';
@Component({
  selector: 'onion-column-wrapper',
  templateUrl: './column-wrapper.component.html',
  styleUrls: ['./column-wrapper.component.scss']
})
export class ColumnWrapperComponent implements OnInit {

  @ViewChild('columnWrapper') columnWrapper: ElementRef;

  @Input() columns = 'lmr';

  messageBar: boolean;

  columnOffset: number;
  columnHeight: number;

  constructor(private utilityService: UtilityService) { }

  async ngOnInit() {
    try {
      this.messageBar = !!(await this.utilityService.getDowntime()).message;
    } catch (error) {
      // FIXME this suppresses the error resulting in the lambda function for messages being disabled
    }

    // calculate the height of the scroll wrapper
    this.columnOffset = (this.columnWrapper
      .nativeElement as HTMLElement).offsetTop;

    this.columnHeight =
      window.innerHeight -
      this.columnOffset -
      (this.messageBar
        ? (document.querySelector('clark-message .wrapper') as HTMLElement)
          .offsetHeight
        : 0) +
      30; // this +30 offsets the wrappers -30 offset

    // set overflow of body to hidden to prevent parent scrolling
    if (this.columnHeight >= 560) {
      // this check prevents obsucring the outcomes sidebar
      document.body.style['overflow-y'] = 'hidden';
      document.body.style['overflow-x'] = 'auto';
    }
  }
  get rightColumn(): boolean {
    return this.columns.indexOf('r') >= 0;
  }

  get leftColumn(): boolean {
    return this.columns.indexOf('l') >= 0;
  }

  showColumn(value: 'l' | 'm' | 'r'): boolean {
    return this.columns.indexOf(value) >= 0;
  }

  OnDestroy() {
    // remove any lingering styles from the document body
    document.body.style.overflow = 'visible';
  }
}
