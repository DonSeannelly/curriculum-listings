import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth.service';
import { UserService } from 'app/core/user.service';
import { NavbarDropdownService } from '../../core/navBarDropdown.service';


@Component({
  selector: 'clark-primary-navbar',
  templateUrl: './primary-navbar.component.html',
  styleUrls: ['./primary-navbar.component.scss'],
  providers: [NavbarDropdownService]
})
export class PrimaryNavbarComponent implements OnInit {

  showNav: boolean;
  levelsDropdown: boolean;
  userDropdown: boolean;
  isLoggedIn: boolean;
  isDesktop: boolean;
  isMSearch: boolean;
  isMHamburger: boolean;
  showTopics: boolean;
  showResources: boolean;
  topics: string[];
  resizeThreshold = 1024;
  externalResources: {name: string, link: string}[];
  academicLevels = ['Elementary', 'Middle', 'High', 'Undergraduate', 'Graduate', 'Post Graduate', 'Community College', 'Training'];


  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.isDesktop = (window.innerWidth >= this.resizeThreshold) ? true : false;
  }

  constructor(
    private auth: AuthService,
    private dropdowns: NavbarDropdownService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isDesktop = window.innerWidth >= this.resizeThreshold;
    this.auth.isLoggedIn.subscribe(val => {
      this.isLoggedIn = val;
    });
    this.dropdowns.isMHamburger.subscribe(val => {
      this.isMHamburger = val;
    });
    this.dropdowns.userDropdown.subscribe(val => {
      this.userDropdown = val;
    });
    this.dropdowns.levelsDropdown.subscribe(val => {
      this.levelsDropdown = val;
    });
    this.dropdowns.resourcesDropdown.subscribe(val => {
      this.showResources = val;
    });
    this.dropdowns.isMSearch.subscribe(val => {
      this.isMSearch = val;
    });
    this.dropdowns.topicDropdown.subscribe(val => {
      this.showTopics = val;
    });
    this.dropdowns.showNavbars.subscribe(val => {
      this.showNav = val;
    });
    this.externalResources = this.dropdowns.externalResources;
    this.topics = this.dropdowns.topics;

    this.dropdowns.setNavbarStatus();
  }

  gravatarImage(size): string {
    // r=pg checks the rating of the Gravatar image
    return this.userService.getGravatarImage(this.auth.user.email, size);
  }
}
