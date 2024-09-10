import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { LearningObject } from '@entity';
import { CookieService } from 'ngx-cookie-service';
import { catchError, takeUntil } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { FileUploadMeta } from '../learning-object-builder/components/content-upload/app/services/typings';
import { SUBMISSION_ROUTES } from '../../core/learning-object-module/submissions/submissions.routes';
import { BUNDLING_ROUTES } from '../../core/learning-object-module/bundling/bundling.routes';
import { OUTCOME_ROUTES } from '../../core/learning-object-module/outcomes/outcome.routes';
import { REVISION_ROUTES } from '../../core/learning-object-module/revisions/revisions.routes';
import { FILE_ROUTES } from '../../core/learning-object-module/file/file.routes';
import { BundlingService } from 'app/core/learning-object-module/bundling/bundling.service';
import { UserService } from 'app/core/user-module/user.service';
import { SEARCH_ROUTES } from 'app/core/learning-object-module/search/search.routes';
import * as querystring from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectService {
  learningObjects: LearningObject[] = [];
  private headers: HttpHeaders = new HttpHeaders();

  // Observable boolean to toogle download spinner in components
  private _loading$ = new BehaviorSubject<boolean>(false);

  // Public get for loading observable
  get loaded() {
    return this._loading$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private bundlingService: BundlingService,
    private userService: UserService,
  ) {
    const token = this.cookies.get('presence');
    if (token !== null) {
      this.headers = new HttpHeaders().append(
        'Authorization',
        `${'Bearer ' + token}`
      );
    }
  }

  /**
   * Calls LO service to update the packageable status of toggled files
   *
   * @param learningObjectID The current learning object's ID
   * @param fileIDs An array of file IDs that need to be updated
   * @param state The new packageable property to update to
   * @returns A promise
   */
  // TODO: Move to bundling service
  toggleBundle(
    learningObjectId: string,
    fileIDs: string[],
    state: boolean
  ) {
    const route = BUNDLING_ROUTES.TOGGLE_BUNDLE_FILE({ learningObjectId });

    return this.http
      .patch(
        route,
        {
          fileIDs: fileIDs,
          packagable: state
        },
        { headers: this.headers, withCredentials: true }
      )
      .pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Creates a Revision of an existing learning object
   *
   * @param learningObjectId
   * @param authorUsername
   */
  // TODO: Move to revisions service
  createRevision(cuid: string) {
    const route = REVISION_ROUTES.CREATE_REVISION(cuid);
    return this.http
      .post(
        route, {},
        { withCredentials: true }
      )
      .pipe(

        catchError(this.handleError)
      )
      .toPromise().then(response => {
        return response;
      });
  }

  /**
   * Fetches user's Learning Objects (partial)
   *
   * @returns {Promise<LearningObject[]>}
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the search service
  getLearningObjects(
    authorUsername: string,
    filters?: any,
  ): Promise<LearningObject[]> {
    const route = SEARCH_ROUTES.GET_USERS_LEARNING_OBJECTS(authorUsername, filters);
    return this.http
      .get(route, { headers: this.headers, withCredentials: true })
      .pipe(

        catchError(this.handleError)
      )
      .toPromise()
      .then((response: any) => {
        return response.objects.map(object => new LearningObject(object));
      });
  }

  /**
   * Fetches user's Learning Objects (partial)
   *
   * @returns {Promise<LearningObject[]>}
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the search service
  getDraftLearningObjects(
    authorUsername: string,
    filters?: any,
    query?: string
  ): Promise<LearningObject[]> {
    return this.http
      .get(
        SEARCH_ROUTES.GET_USERS_LEARNING_OBJECTS(authorUsername, `draftsOnly=true&limit=200&${querystring.stringify(filters, query)}`),
        { headers: this.headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      )
      .toPromise()
      .then((learningObjects: any[]) => {
        return learningObjects.map(learningObject => new LearningObject(learningObject));
      });
  }

  /**
   * Modify an outcome by sending a partial learning outcome
   *
   * @param {{ id: string, [key: string]: any }} outcome the properties of the outcome to change
   * @returns {Promise<any>}
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the outcomes service
  saveOutcome(
    outcome: { id: string;[key: string]: any }
  ): Promise<any> {
    const outcomeId = outcome.id;
    delete outcome.id;

    return this.http
      .patch(
        OUTCOME_ROUTES.UPDATE_OUTCOME(outcomeId),
        { ...outcome },
        { headers: this.headers, withCredentials: true },
      )
      .pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Deletes an outcome on a given learning object
   *
   * @param outcomeId The outcome Id
   */
  // TODO: This needs to be moved to the outcomes service
  deleteOutcome(outcomeId: string): Promise<any> {
    return this.http
      .delete(OUTCOME_ROUTES.DELETE_OUTCOME(outcomeId), { headers: this.headers, withCredentials: true })
      .pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Publish a learning object
   *
   * @param {LearningObject} learningObject the learning object to be published
   * @param {string} collection the abreviated name of the collection to which to submit this learning object
   */
  // TODO: This needs to be moved to the submissions service
  submit(learningObject: LearningObject, collection: string): Promise<{}> {
    const route = SUBMISSION_ROUTES.SUBMIT_LEARNING_OBJECT({
      learningObjectId: learningObject.id,
    });
    return this.http
      .post(
        route,
        { collection },
        { headers: this.headers, withCredentials: true, responseType: 'text' }
      )
      .pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

  /**
   * Function to initiate the bundling process for new and updated learning objects
   *
   * @param username Authors username of current learning object
   * @param learningObjectId id current learning object
   */
  // This level of abstraction is unnecessary and should be removed, call bundling service directly
  async triggerBundle(learningObjectId: string) {
    await this.bundlingService.bundleLearningObject(learningObjectId);
  }

  // TODO: This needs to be moved to the file service
  async updateReadme(id: string): Promise<any> {
    return await this.http.patch(
      FILE_ROUTES.UPDATE_PDF(id),
      {},
      {
        headers: this.headers,
        withCredentials: true,
        responseType: 'text'
      }
    )
      .pipe(
        catchError(this.handleError)
      ).toPromise();
  }

  /**
   * Adds file meta to a Learning Object's materials
   * Adding files are handled by a job queue to avoid sending too large of a payload to the server
   *
   * @param {string} authorUsername [The Learning Object's author's username]
   * @param {string} objectId [The Id of the Learning Object]
   * @param {FileUploadMeta[]} files [List of file meta to be added]
   * @returns {Promise<string[]>}
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the file service
  addFileMeta({
    objectId,
    files
  }: {
    objectId: string;
    files: FileUploadMeta[];
  }): Promise<string[]> {
    const route = FILE_ROUTES.UPLOAD_FILE_META(objectId);
    return this.handleFileMetaRequests(files, route);
  }

  /**
   * Handles file meta data requests
   *
   * *** NOTE ***
   * Requests are handled in batches if data payload is too large (Will only send at most `MAX_PER_REQUEST` file meta in a single request)
   *
   * @private
   * @param {FileUploadMeta[]} files [List of file meta to be added]
   * @param {string} route [Route to make request to]
   * @returns
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the file service
  private handleFileMetaRequests(
    files: FileUploadMeta[],
    route: string
  ): Promise<string[]> {
    const MAX_PER_REQUEST = 100;
    const responses$: Promise<string[]>[] = [];
    const completed$: Subject<boolean> = new Subject<boolean>();
    const sendNextBatch$: Subject<void> = new Subject<void>();

    const response = new Promise<string[]>((resolve, reject) => {
      sendNextBatch$.pipe(takeUntil(completed$)).subscribe(() => {
        const batch = files.splice(0, MAX_PER_REQUEST);
        if (batch.length) {
          this.handleFileMetaBatch(route, batch, responses$, sendNextBatch$);
        } else {
          this.handleFileMetaRequestQueueCompletion(completed$, responses$)
            .then(resolve)
            .catch(reject);
        }
      });
    });
    sendNextBatch$.next();
    return response;
  }

  /**
   * Handles making request to upload batch of file meta
   *
   * @private
   * @param {string} route [Route to make request to]
   * @param {FileUploadMeta[]} batch [Batch of file meta to be added]
   * @param {Promise<string[]>[]} responses$ [List of response promises to append to]
   * @param {Subject<void>} sendNextBatch$ [Observable used to signal that the next batch should be sent]
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the file service
  private handleFileMetaBatch(
    route: string,
    batch: FileUploadMeta[],
    responses$: Promise<string[]>[],
    sendNextBatch$: Subject<void>
  ) {
    const response$ = this.http
      .post(route,
        { fileMeta: batch },
        {
          headers: this.headers,
          withCredentials: true
        })
      .pipe(
        catchError(this.handleError)
      )
      .toPromise()
      .then((res: { fileMetaId: string[] }) => res.fileMetaId);
    responses$.push(response$);
    sendNextBatch$.next();
  }
  /**
   * Handles completion of requests for all file metadata that was enqueued
   *
   * @private
   * @param {Subject<boolean>} completed$ [Observable used to signal that all batches have been completed]
   * @param {Promise<string[]>[]} responses$ [List of response promises to resolve]
   * @returns
   * @memberof LearningObjectService
   */
  private async handleFileMetaRequestQueueCompletion(
    completed$: Subject<boolean>,
    responses$: Promise<string[]>[]
  ): Promise<string[]> {
    completed$.next(true);
    completed$.unsubscribe();
    const fileIdsArrays = await Promise.all(responses$);
    const fileIds = flattenDeep(fileIdsArrays);
    return fileIds;
  }


  /**
   * Makes request to update file description
   *
   * @param {string} authorUsername
   * @param {string} objectId
   * @param {string} fileId
   * @param {string} description
   * @returns {Promise<any>}
   * @memberof LearningObjectService
   */
  // TODO: This needs to be moved to the file service
  updateFileDescription(
    authorUsername: string,
    objectId: string,
    fileId: string,
    description: string
  ): Promise<any> {
    const route = FILE_ROUTES.UPDATE_FILE(
      authorUsername,
      objectId,
      fileId
    );
    return this.http
      .patch(
        route,
        { description },
        { headers: this.headers, withCredentials: true, responseType: 'text' }
      )
      .pipe(

        catchError(this.handleError)
      )
      .toPromise();
  }

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

/**
 * Flattens nested arrays
 *
 * Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 *
 * @param {any[]} arr1 [Array with nested arrays to be flattened]
 * @returns
 */
function flattenDeep(arr1: any[]): any[] {
  return arr1.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  );
}
