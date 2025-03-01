import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { UTILITY_ROUTES } from './utility.routes';
import { AuthService } from '../auth-module/auth.service';
import { Observable, throwError } from 'rxjs';
import { Blog } from 'app/components/blogs/types/blog';
import { catchError } from 'rxjs/operators';

export class Downtime {
  constructor(public isDown: boolean, public message: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private http: HttpClient, private auth: AuthService) { }

  private _downtime: Downtime;

  get message() {
    return this._downtime;
  }

  /**
   * Gets all blogs from the database
   *
   * @returns An observable containing an array of blogs
   */
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(UTILITY_ROUTES.GET_BLOGS());
  }

  /**
   * Gets all blogs from the database
   *
   * @returns An observable containing an array of blogs
   */
  getRecentBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(UTILITY_ROUTES.GET_RECENT_BLOGS());
  }

  /**
   * Checks the client's version against the service
   *
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  async checkClientVersion(): Promise<void | Partial<{ message: string }>> {
    // Application version information
    const { version } = require('../../../../package.json');
    try {
      await this.http
        .get(UTILITY_ROUTES.GET_CLIENT_VERSION(version), {
          withCredentials: true,
          responseType: 'text',
        })
        .toPromise();
      return Promise.resolve();
    } catch (error) {
      if (error.status === 426) {
        return Promise.reject(error);
      } else {
        catchError(this.handleError);
      }
    }
  }

  /**
   * Gets all CARD resources
   * @returns list of card resources
   */
  async getAllResources(args?: {
    q?: string;
    page?: number;
    limit?: number;
    sort?: 1 | -1;
    sortType?: string;
    category?: string[];
    organizations?: string[];
    status?: string[];
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.cardUrl}/resources`, {})
        .toPromise()
        .then(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  async getOrganizations(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.cardUrl}/organizations`, {})
        .toPromise()
        .then(
          (res: any) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getDowntime(): Promise<Downtime> {
    return this.http.get(UTILITY_ROUTES.GET_DOWNTIME(), { withCredentials: true })
      .pipe(

        catchError(this.handleError)
      )
      .toPromise()
      .then((val: Downtime) => {
        return val;
      });
  }

  public openCard() {
    // Ask the user if they are sure they want to leave
    if (confirm('You are now leaving CLARK. You will be redirected to the CAE Resource Directory.')) {
      window.open('https://caeresource.clark.center', '_blank');
    }
  }

  private handleError(error: HttpErrorResponse | any) {
    if (
      error.error instanceof ErrorEvent ||
      (error.error && error.error.message)
    ) {
      // Client-side or network returned error
      return throwError(error.error);
    } else {
      // API returned error
      return throwError(error.error);
    }
  }
}
