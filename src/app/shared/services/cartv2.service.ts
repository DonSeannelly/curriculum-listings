import { USER_ROUTES } from './../../../environments/route';
import { Injectable, OnInit } from '@angular/core';
import { LearningObject, User } from '@cyber4all/clark-entity';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { saveAs as importedSaveAs } from 'file-saver';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class CartV2Service {
  private user;
  private headers = new Headers();

  public cartItems: Array<LearningObject> = [];

  constructor(private http: Http, private auth: AuthService) {
    this.updateUser();
  }

  updateUser() {
    // get new user from localStorage
    this.user = this.auth.user || undefined;

    // reset headers with new users auth token
    this.headers = new Headers();
    // this.headers.append('Content-Type', 'application/json');
  }

  openLearningObject(url: string) {
    window.open(url);
  }

  getCart(reloadUser = false): Promise<Array<LearningObject>> | boolean {
    return this.user
      ? this.http
          .get(USER_ROUTES.GET_CART(this.user.username), {
            withCredentials: true,
            headers: this.headers
          })
          .toPromise()
          .then(val => {
            this.cartItems = val
              .json()
              .map(object => LearningObject.instantiate(object));
            return this.cartItems;
          })
      : false;
  }

  async addToCart(
    author: string,
    learningObjectName: string,
    download?: boolean
  ): Promise<Array<LearningObject> | boolean> {
    return this.user
      ? this.http
          .post(
            USER_ROUTES.ADD_LEARNING_OBJECT_TO_CART(
              this.user.username,
              author,
              learningObjectName
            ),
            {},
            { headers: this.headers, withCredentials: true }
          )
          .toPromise()
          .then(async val => {
            this.cartItems = val
              .json()
              .map(object => LearningObject.instantiate(object));
            return this.cartItems;
          })
      : false;
  }

  removeFromCart(
    author: string,
    learningObjectName: string
  ): Promise<Array<LearningObject>> | boolean {
    // tslint:disable-next-line:max-line-length
    return this.user
      ? this.http
          .delete(
            USER_ROUTES.CLEAR_LEARNING_OBJECT_FROM_CART(
              this.user.username,
              author,
              learningObjectName
            ),
            { headers: this.headers, withCredentials: true }
          )
          .toPromise()
          .then(val => {
            this.cartItems = val
              .json()
              .map(object => LearningObject.instantiate(object));
            return this.cartItems;
          })
      : false;
  }

  clearCart(): Promise<boolean> | boolean {
    // tslint:disable-next-line:curly
    if (this.user) {
      return this.http
        .delete(USER_ROUTES.CLEAR_CART(this.user.username), {
          headers: this.headers,
          withCredentials: true
        })
        .toPromise()
        .then(val => {
          this.cartItems = [];
          return true;
        });
    } else {
      return false;
    }
  }

  checkout() {
    // tslint:disable-next-line:max-line-length
    this.http
      .get(USER_ROUTES.GET_CART(this.user.username) + '?download=true', {
        headers: this.headers,
        responseType: ResponseContentType.Blob,
        withCredentials: true
      })
      .subscribe(
        res => {
          importedSaveAs(res.blob(), `${Date.now()}.zip`);
        },
        err => console.log,
        () => {
          console.log('Downloaded');
        }
      );
  }

  downloadLearningObject(author: string, learningObjectName: string) {
    this.http
      .post(
        USER_ROUTES.DOWNLOAD_OBJECT(
          this.user.username,
          author,
          learningObjectName
        ),
        {},
        {
          headers: this.headers,
          responseType: ResponseContentType.Blob,
          withCredentials: true
        }
      )
      .subscribe(
        res => {
          importedSaveAs(res.blob(), `${Date.now()}.zip`);
        },
        err => console.log,
        () => {
          console.log('Downloaded');
        }
      );
  }
}
