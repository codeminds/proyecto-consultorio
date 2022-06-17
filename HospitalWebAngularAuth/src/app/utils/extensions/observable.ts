import { APIResponse } from "@services/http/http.types";
import { map, Observable } from "rxjs";

declare module 'rxjs' {
    interface Observable<T> {
        mapObjectResponse<N>(callback: (item: object) => N): Observable<APIResponse<N>>; 
        mapArrayResponse<N>(callback: (item: object) => N): Observable<APIResponse<N[]>>; 
    }
}

Observable.prototype.mapObjectResponse = function<N>(callback: (item: object) => N) {
    return this.pipe(map((response: APIResponse<object>) => ({ ...response, data: callback(response?.data) })));
}

Observable.prototype.mapArrayResponse = function<N>(callback: (item: object) => N) {
    return this.pipe(map((response: APIResponse<object[]>) => ({ ...response, data: response?.data?.map(callback) || [] })));
}