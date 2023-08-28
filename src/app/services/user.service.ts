import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/*
* WebStorage services for Angular: https://www.npmjs.com/package/ngx-webstorage-service
* More about HTML Web Storage: https://www.w3schools.com/html/html5_webstorage.asp
* Local Storage vs Session Storage vs Cookie: https://scotch.io/@PratyushB/local-storage-vs-session-storage-vs-cookie
*/
import { StorageService } from 'ngx-webstorage-service';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './../model/user';
//import { RegistrationForm } from './../model/registration-form';
//import {ServiceResponse} from "../model/service-response";


const STORAGE_KEY = 'current-user';
export const USER_SERVICE_STORAGE =
    new InjectionToken<StorageService>('USER_SERVICE_STORAGE');

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class UserService {
    private loggedInUserSubject:BehaviorSubject<User>;
    public loggedInUser$:Observable<User>;

    baseUrl = "http://localhost:8080";
    endpoint = this.baseUrl + "/api/authenticate";

    constructor(private http:HttpClient,
                @Inject(USER_SERVICE_STORAGE) private storage: StorageService) {
        this.loggedInUserSubject = new BehaviorSubject<User>(this.getUserFromStorage());
        this.loggedInUser$ = this.loggedInUserSubject.asObservable();
    }

    
    public setLoggedUser(loggedUser:User):void {
        this.storage.set(STORAGE_KEY, loggedUser);
        this.loggedInUserSubject.next(this.getUserFromStorage());
    }
    public getUserFromStorage(): User {
        const currentUser: User = this.storage.get(STORAGE_KEY) || null;
        return currentUser;
    }

    public getLoggedUser():User {
        return this.loggedInUserSubject.value;
    }

    public getTestCall():Observable<any> {
        return this.http.get(this.baseUrl + "/test")
            .pipe(
                map(res => {
                    console.log("Test call res: `${res}`");
                    return res;
                }),
                catchError(error => {
                    console.log("Test call error: `${error}`");
                    return throwError(error);
                })
            );
    }

    login(user:User):Observable<any> {

        return this.http.post(this.endpoint + "/login", user)
            .pipe(
                map(res => {
                    console.log("res",res);
                    return res;
                }),
                catchError(error => {
            
                    return throwError(error);
                }));
    }

    logout():Observable<any> {
        window.sessionStorage.clear();
        return this.http.get(this.endpoint + "/logout")
            .pipe(
                map(res => {
                    this.setLoggedUser(null as any);
                    return res;
                }),
                catchError(error => {
                    return of(error);
                }));
    }

    // register(registrationForm:RegistrationForm):Observable<any> {
    //     return this.http.post(this.endpoint + "/register", registrationForm)
    //         .pipe(
    //             map(res => {
    //                 return res;
    //             }),
    //             catchError(error => {
    //                 //return of(error);
    //                 return throwError(error);
    //             })
    //         );
    // }
    // getUsersBySearchCondition(searchText?: string):Observable<any> {
    //     return this.http.get(this.endpoint + "/all", {params: { searchLikeAttr: searchText } })
    //         .pipe(
    //             map(res => {
    //                 return res;
    //             }),
    //             catchError((error:any) => {
    //                 return of(error);
    //             })
    //         );
    // }
    getUsersPage(requestParams?:any):Observable<any> {
        return this.http.get(this.endpoint, {params: requestParams})
            .pipe(
                map(res => {
                    return res;
                }),
                catchError((error:any) => {
                    return of(error);
                })
            );
    }
}
