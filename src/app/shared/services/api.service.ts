import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListWCursor, FilterParams, SortOrder, Range, WhereIn, WhereContains } from './interfaces';


export abstract class ApiService<T> {

  private readonly api: string = '/api';

  constructor(protected http: HttpClient) { }

  /**
   * This is the base of the api url, for example: in the url: `http://myserver.com/api/<users>`
   * - `users`: is the root
   *
   * When implementing this class, you should return the root as mentioned above.
   *
   * **Example:**
   *
   * ```ts
   * class UserService extends ApiService<User> {
   *
   *  constructor(http: HttpClient) {
   *    super(http);
   *  }
   *   v
   * ```
   */
  public abstract root(): string;

  /**
   * This getter takes the default `api` const string (on top of this class) and the
   * `root()` to create the api uri to make requests.
   * @internal
   */
  protected get uri(): string {
    return `${this.api}/${this.root()}`;
  }

  /**
   * Calls the default `GET http://myserver.com/api/<root>` to list all the entities,
   * also depending on the filter params provided.
   * @param {FilterParams} params The optional filter params to be sent in the request
   * @return {Observable} an `Observable` of a `ListWCursor<T>` inside, containing the entities and a cursor for pagination
   */
  public list(params?: FilterParams<T>): Observable<ListWCursor<T>> {
    /*const options = Object.assign({}, params) as FilterParams<T>;
    let hp: HttpParams = new HttpParams();

    if ('in' in options) {
      const wIn: WhereIn<T> = options['in'] as WhereIn<T>;
      delete options[wIn.field];
    }

    if ('contains' in options) {
      const wContains: WhereContains<T> = options['contains'] as WhereContains<T>;
      delete options[wContains.field];
    }

    Object.keys(options)
      .filter(key => !isNullEmptyOrZero(options[key]))
      .forEach(key => {
        let value = `${options[key]}`;
        if (key as keyof FilterParams<T> === 'orderBy') {
          const orderBy: SortOrder<T> = options[key] as SortOrder<T>;
          const sign = orderBy.order === 'asc' ? '~' : '-';
          value = `${sign}${orderBy.field}`;
        }
        if (key as keyof FilterParams<T> === 'in') {
          const whereIn: WhereIn<T> = options[key] as WhereIn<T>;
          value = `${whereIn.field}(${whereIn.values.toString()})`;
        }
        if (key as keyof FilterParams<T> === 'range') {
          value = '';
          const range: Range<T> = options[key] as Range<T>;
          const { field, start, end } = range;
          const i = range.nonInclusive ? '*' : '';
          if (typeof start === typeof end) {
            switch (typeof start) {
              case 'string':
              case 'number':
                value = `${i + field}^${start}~${end}`;
                break;
              case 'object': {
                const $start = moment(start).format('YYYY-MM-DD');
                const $end = moment(end).format('YYYY-MM-DD');
                value = `${i + field}^${$start}~${$end}`;
                break;
              }
            }
          }
        }
        hp = hp.set(key, value);
      });*/
    return this.http.get<ListWCursor<T>>(`${this.uri}`, { params: getParams(params) });
  }

  /**
   * Calls the default `POST http://myserver.com/api/<root>` to save a new entity of
   * type `<T>`
   * @param e The entity to be saved as new
   * @param relations A flag which means if you want the server to make relationships of virtual properties
   * @return an `Observable` of the saved entity of type `<T>`
   */
  public store(e: T, relations: boolean = true): Observable<T> {
    return this.http.post<T>(this.uri, e, { params: { rel: `${relations}` } });
  }

  /**
   * Calls the default `GET http://myserver.com/api/<root>/{id}` to retrieve a single entity of
   * type `<T>` with the corresponding `id`
   * @param id The `id` of the entity to search for
   * @return an `Observable` of the found entity of type `<T>`
   */
  public single(id: string, relations: boolean = true): Observable<T> {
    return this.http.get<T>(`${this.uri}/${id}${!relations ? `?rel=${relations}` : ''}`);
  }

  /**
   * Calls the default `PUT http://myserver.com/api/<root>/{id}` to save an existing entity of
   * type `<T>` (updating it).
   * @param id The current `id` of the entity to be updated
   * @param e The entity with the updated fields
   * @param relations A flag which means if you want the server to make relationships of virtual properties
   * @return an `Observable` of the updated entity of type `<T>`
   */
  public update(id: string, e: T, relations: boolean = true): Observable<T> {
    return this.http.put<T>(`${this.uri}/${id}`, e, { params: { rel: `${relations}` } });
  }
  /**
   * Calls the default `DELETE http://myserver.com/api/<root>/{id}` to delete an existing entity of
   * type `<T>` with the corresponding `id`
   * @param id The current `id` of the entity to be deleted
   * @return an `Observable` of the saved entity of type `<T>`
   */
  public destroy(id: string): Observable<T> {
    return this.http.delete<T>(`${this.uri}/${id}`);
  }
}

export function isNullEmptyOrZero(value: any): boolean {
  switch (value) {
    case undefined:
    case null:
    case '':
    case 0:
      return true;
    default:
      return false;
  }
}

export function getParams<T>(params?: FilterParams<T>): HttpParams {
  const options = Object.assign({}, params) as FilterParams<T>;
  let hp: HttpParams = new HttpParams();

  if ('in' in options) {
    const wIn: WhereIn<T> = options['in'] as WhereIn<T>;
    delete options[wIn.field];
  }

  if ('contains' in options) {
    const wContains: WhereContains<T> = options['contains'] as WhereContains<T>;
    delete options[wContains.field];
  }

  Object.keys(options)
    .filter(key => !isNullEmptyOrZero(options[key]))
    .forEach(key => {
      let value = `${options[key]}`;
      if (key as keyof FilterParams<T> === 'orderBy') {
        const orderBy: SortOrder<T> = options[key] as SortOrder<T>;
        const sign = orderBy.order === 'asc' ? '~' : '-';
        value = `${sign}${orderBy.field}`;
      }

      if (key as keyof FilterParams<T> === 'in') {
        const whereIn: WhereIn<T> = options[key] as WhereIn<T>;
        value = `${whereIn.field}(${whereIn.values.toString()})`;
      }

      if (key as keyof FilterParams<T> === 'contains') {
        const whereContains: WhereContains<T> = options[key] as WhereContains<T>;
        value = `${whereContains.field}(${whereContains.values.toString()})`;
      }

      if (key as keyof FilterParams<T> === 'range') {
        value = '';
        const range: Range<T> = options[key] as Range<T>;
        const { field, start, end } = range;
        const i = range.nonInclusive ? '*' : '';
        if (typeof start === typeof end) {
          switch (typeof start) {
            case 'string':
            case 'number':
              value = `${i + field}^${start}~${end}`;
              break;
            case 'object': {
              //const $start = moment(start).format('YYYY-MM-DD');
              // const $end = moment(end).format('YYYY-MM-DD');
              //value = `${i + field}^${$start}~${$end}`;
              break;
            }
          }
        }
      }
      hp = hp.set(key, value);
    });
  return hp;
}
function moment(start: any) {
  throw new Error('Function not implemented.');
}

