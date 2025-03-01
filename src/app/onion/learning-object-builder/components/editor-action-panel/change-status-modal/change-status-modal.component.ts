import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { LearningObject } from '@entity';
import { BUILDER_ACTIONS, BuilderStore } from '../../../builder-store.service';
import { ChangelogService } from 'app/core/learning-object-module/changelog/changelog.service';
import { carousel } from './clark-change-status-modal.animations';
import { Router } from '@angular/router';
import { ToastrOvenService } from 'app/shared/modules/toaster/notification.service';

@Component({
  selector: 'clark-change-status-modal',
  templateUrl: './change-status-modal.component.html',
  styleUrls: ['./change-status-modal.component.scss'],
  animations: [carousel]
})
export class ChangeStatusModalComponent implements OnInit {
  @Input() shouldShow;
  @Input() learningObject: LearningObject;
  @Output() closed = new EventEmitter();
  selectedStatus: string;
  changelog: string;
  reason: string;
  statuses = [];

  page: 1 | 2 = 1;
  direction: 'prev' | 'next' = 'next';

  serviceInteraction: boolean;

  constructor(
    private builderStore: BuilderStore,
    private changelogService: ChangelogService,
    private toaster: ToastrOvenService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setValidStatusMoves();
  }

  closeModal() {
    this.closed.next();
    this.selectedStatus = undefined;
    this.changelog = undefined;
    this.reason = undefined;
    this.page = 1;
  }

  hasNextModalPage() {
    return [
      LearningObject.Status.RELEASED,
      LearningObject.Status.REJECTED,
    ].includes(this.selectedStatus as LearningObject.Status);
  }

  /**
   * Sets the valid status moves depending on which status the learning
   * object is currently
   */
  private setValidStatusMoves() {
    switch (this.learningObject.status) {
      case LearningObject.Status.WAITING:
        this.statuses = [LearningObject.Status.REVIEW];
        break;
      case LearningObject.Status.REVIEW:
        this.statuses = [
          LearningObject.Status.ACCEPTED_MINOR,
          LearningObject.Status.ACCEPTED_MAJOR,
          LearningObject.Status.PROOFING,
        ];
        break;
      case LearningObject.Status.ACCEPTED_MINOR:
      case LearningObject.Status.ACCEPTED_MAJOR:
        this.statuses = [LearningObject.Status.WAITING, LearningObject.Status.PROOFING];
        break;
      case LearningObject.Status.PROOFING:
        this.statuses = [LearningObject.Status.RELEASED, LearningObject.Status.REJECTED];
    }
  }

  /**
   * Navigates the user to the map and tag builder
   */
  private moveToMapAndTag() {
    // Set a small timeout before navigating so that the change in status applies
    setTimeout(() => {
      this.router.navigate(['onion', 'relevancy-builder', this.learningObject.cuid, 'outcomes']);
    }, 1000);
  }

  /**
   * Navigates the user to the admin dashboard
   */
  private moveToAdminDashboard() {
    this.router.navigate(['admin', 'learning-objects']);
  }

  /**
   * Navigate to the RTF to create a changelog
   */
  advance() {
    this.direction = 'next';
    this.cd.detectChanges();
    this.page = 2;
  }

  /**
   * Navigate to the list of available statuses
   */
  regress() {
    this.direction = 'prev';
    this.cd.detectChanges();
    this.page = 1;
  }

  /**
   * Gets the text of the status to move to
   *
   * @param status The status to get the text of
   * @returns A string description
   */
  getStatusText(status: string) {
    switch (status) {
      case LearningObject.Status.RELEASED:
        return `Release this Learning Object`;
      case LearningObject.Status.PROOFING:
        return 'Move to Proofing';
      case LearningObject.Status.REVIEW:
        return 'Move to Review';
      case LearningObject.Status.WAITING:
        return 'Move to Waiting';
      case LearningObject.Status.ACCEPTED_MINOR:
        return 'Request Minor Changes';
      case LearningObject.Status.ACCEPTED_MAJOR:
        return 'Request Major Changes';
      case LearningObject.Status.REJECTED:
        return 'Reject this Learning Object';
    }
  }

  /**
   * Update the status of the learning object to the selected value
   */
  async updateStatus() {
    this.serviceInteraction = true;
    let unableToUpdate = false;

    await Promise.all([
      this.builderStore
        .execute(BUILDER_ACTIONS.CHANGE_STATUS, { status: this.selectedStatus, reason: this.reason })
        .catch(error => {
          // Set a variable to track update state and throw up a error toaster.
          unableToUpdate = true;
          if (error.status === 400) {
            this.toaster.error('Error!', error.error.message);
          } else {
            this.toaster.error('Error!', 'There was an error trying to update the status of this learning object. Please try again later!');
          }
          return;
        }),
    ]).then(() => {
      // If we can't update the status, just close the modal after showing an error.
      if (unableToUpdate) {
        this.closeModal();
        this.serviceInteraction = false;
        return;
      }

      // Create a changelog.
      this.changelog ? this.createChangelog() : undefined;

      // If the object released, move to map and tag, else update the valid status moves
      this.learningObject.status = this.selectedStatus as LearningObject.Status;
      if (this.selectedStatus === LearningObject.Status.RELEASED) {
        this.moveToAdminDashboard();
      } else if (this.learningObject.status === LearningObject.Status.REJECTED) {
        this.moveToAdminDashboard();
      } else {
        this.setValidStatusMoves();
      }

      // Then close the modal
      this.closeModal();
      this.serviceInteraction = false;
    }).catch(error => {
      this.serviceInteraction = false;
    });
  }

  /**
   * Create a new changelog for the active learning object
   */
  async createChangelog(): Promise<{}> {
    return this.changelogService.createChangelog(
      this.builderStore.learningObjectEvent.getValue().cuid,
      this.changelog,
    );
  }
}
