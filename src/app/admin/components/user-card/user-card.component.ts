import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from '@entity';
import { PrivilegeService } from 'app/admin/core/privilege.service';
import { UserService } from 'app/core/user.service';
import { userCardAnimations } from './user-card.component.animations';

@Component({
  selector: 'clark-admin-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: userCardAnimations
})
export class AdminUserCardComponent {
  @Input() user: User;
  @Input() reviewer = false;
  @Input() canEditPrivilege = false;

  @Output() navigateToUserObjects = new EventEmitter<string>();
  @Output() removeMember = new EventEmitter<string>();
  showAddEvaluator = false;
  showAddEvaluatorButton = false;

  loading = false;
  @Output() editPrivileges: EventEmitter<void> = new EventEmitter();

  showMiddle: boolean;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private privilegeService: PrivilegeService
    ) {}

  /**
   * Toggle the menu items on the card hover value
   *
   * @param {boolean} value true if the menu should display, false otherwise
   * @memberof AdminUserCardComponent
   */
  async toggleCardMenu(value: boolean) {
    this.showMiddle = value;
    await this.canAddEvaluator();
    this.cd.detectChanges();
  }

  /**
   * Retrieve the gravatar image for the card's user
   *
   * @returns
   * @memberof AdminUserCardComponent
   */
  getGravatar() {
    return this.userService.getGravatarImage(
      this.user.email,
      200,
    );
  }

  /**
   * Emit an event to the parent component instructing it to navigate to the user's objects
   *
   * @memberof AdminUserCardComponent
   */
  showUserObjects() {
    this.navigateToUserObjects.emit();
  }

  /**
   * Emit an event to the parent component instructing it edit the card's user's privileges
   *
   * @memberof AdminUserCardComponent
   */
  editUserPrivileges() {
    this.editPrivileges.emit();
  }

  /**
   * Emit an event to the parent component instructing it to remove the card's user as a reviewer from the active collection
   *
   * @memberof AdminUserCardComponent
   */
  removeReviewer() {
    this.removeMember.emit(this.user.id);
  }

  toggleAddEvaluator(show: boolean) {
    this.showAddEvaluator = show;
  }

  async canAddEvaluator() {
    const roles = await this.privilegeService.getCollectionRoles(this.user.id);
    this.showAddEvaluatorButton = roles.length > 0;
  }
}
