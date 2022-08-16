import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, SubscriptionLike as ISubscription } from 'rxjs';
import { AuthService } from 'app/core/auth.service';
import { ProfileService } from 'app/core/profiles.service';
@Component({
  selector: 'clark-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {
  private _loading = new BehaviorSubject<boolean>(true);
  @Input() set loading(val: boolean) {
    this._loading.next(val);
  }
  get loading() {
    return this._loading.value;
  }
  subscription: ISubscription;
  user: any;
  isUser = false;
  userCollectionMetaData = [];
  allUserContributions = [];

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private profileService: ProfileService,
  ) {}

  async ngOnInit() {
    this._loading.next(true);
    this.subscription = this.route.data.subscribe(async val => {
      this.user = val.user;
      // Check to see if current user is on their profile
      this.isUser = this.user.username === this.auth.username;
      await this.initProfileData();
      // await this.getCollectionsData();
      // await this.getUserLearningObjects();
    });
  }
  async initProfileData() {
    await this.profileService
      .getCollectionData(this.user.username).then( (collectionMeta) => {
        const tempObjects = [];
        collectionMeta.map(async (objectMeta) => {
          const params = {
            author: undefined,
            cuid: objectMeta.cuid
          };
          try {
            await this.profileService
              .fetchLearningObject(params)
              .then((obj: Object) => {
                tempObjects.push(obj);
              });
          } catch(e) {
            throw e;
          }
        });
        this.userCollectionMetaData = collectionMeta;
        this.allUserContributions = tempObjects;
        this._loading.next(false);
    });
  }

  async getCollectionsData() {
    if(!this.loading) {
      this.loading = true;
    }
    await this.profileService
      .getCollectionData(this.user.username).then( collectionMeta => {
      this.userCollectionMetaData = collectionMeta;
    });
  }

  async getUserLearningObjects() {
    if(!this.loading) {
      this.loading = true;
    }
    this.userCollectionMetaData.map( async objectMeta => {
      const params = {
        author: undefined,
        cuid: objectMeta.cuid
      };
      try {
        await this.profileService
          .fetchLearningObject(params)
          .then((obj: Object) => {
            this.allUserContributions.push(obj);
          });
      } catch(e) {
        throw e;
      }
      this._loading.next(false);
    });
  }

  ngOnDestroy() {

  }
}
