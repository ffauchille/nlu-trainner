import { get, post } from "./common";
import { map } from "rxjs/operators";
import { AppModel } from "../models/app";
import { Observable, of } from "rxjs";
import { Intent } from "../models/intent";
import { Example } from "../models/example";


export const getApps = (): Observable<AppModel[]> => get("/apps").pipe(map(r => r as AppModel[]))
export const getAppIntents = (app: AppModel | string): Observable<Intent[]> => { 
    if (app) {
        let aId: string = typeof app === 'string' ? app : app._id;
        return get(`/intents?appId=${aId}`).pipe(map(r => r as Intent[]))
    } else return of([])
}
export const getIntentExamples = (intent: Intent | string): Observable<Example[]> => {
    if (intent) {

        let iId: string = typeof intent === 'string' ? intent : intent._id;
        return get(`/examples?intent=${iId}`).pipe(map(r => r as Example[]))
    } else return of([])
}
export const createApp = (appCreate: Partial<AppModel>): Observable<any> => post("/apps", appCreate)
export const createIntent = (intentCreate: Partial<Intent>): Observable<any> => post("/intents", intentCreate)
export const createExample = (exampleCreate: Partial<Example>): Observable<any> => post("/examples", exampleCreate)
export const trainApp = (app: AppModel): Observable<any> => {
    var obs = of(app)
    switch (app.type) {
        case "RASA": {
            obs = post("/rasa/models/train", { project: app.name })
            break;
        }
        default:
    }
    return obs;
}

export const getStatus = get("/status")