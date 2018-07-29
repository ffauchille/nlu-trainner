import { get, post } from "./common";
import { map } from "../../node_modules/rxjs/operators";
import { AppModel } from "../models/app";
import { Observable } from "../../node_modules/rxjs";
import { Intent } from "../models/intent";
import { Example } from "../models/example";


export const getApps = (): Observable<AppModel[]> => get("/apps").pipe(map(r => r as AppModel[]))
export const getAppIntents = (app: AppModel | string): Observable<Intent[]> => { 
    let aId: string = typeof app === 'string' ? app : app._id;
    return get(`/intents?appId=${aId}`).pipe(map(r => r as Intent[]))
}
export const getIntentExamples = (intent: Intent | string): Observable<Example[]> => {
    let iId: string = typeof intent === 'string' ? intent : intent._id;
    return get(`/examples?intent=${iId}`).pipe(map(r => r as Example[]))
}
export const createApp = (appCreate: Partial<AppModel>): Observable<any> => post("/apps", appCreate)
export const createIntent = (intentCreate: Partial<Intent>): Observable<any> => post("/intents", intentCreate)
export const createExample = (exampleCreate: Partial<Example>): Observable<any> => post("/examples", exampleCreate)


export const getStatus = get("/status")