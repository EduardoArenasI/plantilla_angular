
export interface Model {
    id: string;
}

export interface ListWCursor<T> {

}
export interface FilterParams<T> {

}

export interface SortOrder<T> {
    field: any;
    order: string;

}

export interface Range<T> {
    nonInclusive: any;
    field: any;
    start: number;
    end: number;

}
export interface WhereIn<T> {
    values: any;
    field: any;

}

export interface WhereContains<T> {
    values: any;
    field: any;

}

