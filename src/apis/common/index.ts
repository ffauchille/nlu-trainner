import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

const headers = { "Content-Type": "application/json" };

const host = process.env.NLU_TRAINER_API

console.log("host is ", process.env.NLU_TRAINER_API);

const withHost = (route: string) => host + (route.startsWith("/") ? route : "/" + route)

export function get<T>(route: string): Observable<T> { return ajax.getJSON<T>(withHost(route), headers) }
export function post<B, T>(route: string, body: B): Observable<T> { 
    return ajax.post(withHost(route), body, headers)
               .pipe(map(r => r.response as T))
}

export function del<B, T>(route: string): Observable<T> {
    return ajax.delete(withHost(route), headers).pipe(map(r => r.response as T))
}