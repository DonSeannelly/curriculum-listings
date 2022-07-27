import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavbarDropdownService {
    //mobile or desktop
    public isDesktop = new BehaviorSubject<boolean>(true);
    //user options main navbar
    public userDropdown = new BehaviorSubject<boolean>(false);

    public levelsDropdown = new BehaviorSubject<boolean>(false);
    public topicDropdown = new BehaviorSubject<boolean>(false);
    public collectionsDropdown = new BehaviorSubject<boolean>(false);
    public resourcesDropdown = new BehaviorSubject<boolean>(false);
    //mobile slideouts
    public isMHamburger = new BehaviorSubject<boolean>(false);
    public isMSearch = new BehaviorSubject<boolean>(false);

    public closeMobileMenus(): void {
        if(this.isMHamburger.getValue()) {
            this.isMHamburger.next(false);
        }
        if(this.isMSearch.getValue()) {
            this.isMSearch.next(false);
        }
    }

    public toggleUserDropdown(): void {
        this.userDropdown.next(!this.userDropdown.getValue());
    }

    public toggleMobileHamburger(): void {
        this.isMHamburger.next(!this.isMHamburger.getValue());
    }

    public toggleMobileSearch(): void {
        this.isMSearch.next(!this.isMSearch.getValue());
    }

    public toggleLevelsDropdown(): void {
        this.levelsDropdown.next(!this.levelsDropdown.getValue());
    }

    public toggleTopicDropdown(): void {
        this.topicDropdown.next(!this.topicDropdown.getValue());
    }

    public toggleCollectionDropdown(): void {
        this.collectionsDropdown.next(!this.collectionsDropdown.getValue());
    }

    public toggleResourcesDropdown(): void {
        this.resourcesDropdown.next(!this.resourcesDropdown.getValue());
    }


}
