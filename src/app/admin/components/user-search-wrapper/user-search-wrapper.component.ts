import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '@entity';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { UserService } from 'app/core/user.service';
import { AuthService } from 'app/core/auth.service';

@Component({
  selector: 'clark-user-search-wrapper',
  templateUrl: './user-search-wrapper.component.html',
  styleUrls: ['./user-search-wrapper.component.scss']
})
export class UserSearchWrapperComponent implements OnInit, OnDestroy {
    // fires every time an input event occurs on the search input element
    userSearchInput$: Subject<string> = new Subject();
    // fires when this component is destroyed
    destroyed$: Subject<void> = new Subject();
    // true if the component is actively querying the services, false otherwise
    loading = false;
    // array of User objects returned from service
    searchResults: User[] = [];
    // search query string, modeled to the search
    query: string;
    // Array of users to add ori remove from
    // This array is used when rendering + or x next to user
    @Input() users: User[];
    // Fired when user is selected
    @Output() selectedUser: EventEmitter<User> = new EventEmitter();

  constructor(
    private user: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
      // subscribe to the search input and fire search after debounce
      this.userSearchInput$.pipe(
        debounceTime(650),
        takeUntil(this.destroyed$)
      ).subscribe((val: string) => {
        this.findUser(val.trim());
      });

      this.userSearchInput$.pipe(
        takeUntil(this.destroyed$)
      ).subscribe((val: string) => {
        if (val && val !== '') {
          this.loading = true;
        } else {
          this.clearSearch();
          this.loading = false;
        }
      });
  }

  /**
   * Queries the UserService with query text and sets the searchResults variable
   *
   * @memberof UserSearchWrapperComponent
   */
  findUser(query: string) {
    if (query && query !== '') {
      this.user.searchUsers({ text: query }).then((results: User[]) => {
        // remove current user from results
        this.searchResults = results.filter(result => result.username !== this.authService.username);
        this.loading = false;
      });
    }
  }

  /**
   * Fires event with selected user index
   *
   * @memberof UserSearchWrapperComponent
   */
  selectUser(index: number) {
    this.selectedUser.emit(this.searchResults[index]);
    this.searchResults = [];
    this.clearSearch();
  }

  /**
   * Clear's the current search text and results
   *
   * @memberof UserSearchWrapperComponent
   */
  clearSearch() {
    this.query = '';
    this.searchResults = [];
    this.loading = false;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
