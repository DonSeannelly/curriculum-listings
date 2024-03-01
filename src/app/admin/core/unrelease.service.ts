import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LearningObject } from '@entity';
import { LEGACY_ADMIN_ROUTES } from '../../core/learning-object-module/learning-object/learning-object.routes';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { REVISION_ROUTES } from '../../core/learning-object-module/revisions/revisions.routes';

@Injectable({
  providedIn: 'root'
})
export class UnreleaseService {

  constructor(private http: HttpClient) { }

  /**
   * Unreleases a learning object, moving it back to a
   * in review status (waiting, review, or proofing)
   *
   * @param username The username of the author
   * @param cuid The cuid of the learning object
   * @returns A promise of the request
   */
  unreleaseLearningObject(username: string, cuid: string) {
    return this.http
      .post(
        LEGACY_ADMIN_ROUTES.UNRELEASE_OBJECT(username, cuid),
        { status: LearningObject.Status.PROOFING },
        { withCredentials: true, responseType: 'text' }
      ).pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Deletes a revision of a learning object. This is designed to allow an editor to create a new
   * revision when it is necessary for the editorial process to continue.
   *
   * @param username username of the author
   * @param cuid cuid of the learning object
   * @returns
   */
  deleteRevision(username: string, cuid: string, version: number) {
    return this.http
      .delete(
        REVISION_ROUTES.DELETE_REVISION(username, cuid, version),
        { withCredentials: true, responseType: 'text' }
      ).pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Generic error-handling function for errors through from the HttpClient module
   *
   * @private
   * @param {HttpErrorResponse} error
   * @returns
   * @memberof PrivilegeService
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network returned error
      return throwError(error.error.message);
    } else {
      // API returned error
      return throwError(error);
    }
  }
}
