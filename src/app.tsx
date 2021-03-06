import * as React from "react";
import { Provider } from "react-redux";
import { routerMiddleware, connectRouter, ConnectedRouter, push } from "connected-react-router";
import { createStore, combineReducers, applyMiddleware } from "redux";
import reducers from "./reducers";
import { Route, Redirect, Switch } from "react-router";
import { createBrowserHistory, History } from "history";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import epics from "./epics";
import Apps from "./apps/apps";
import TestBox from "./testbox/testbox";
import Categories from "./categories/categories";
import Layout from "./layout";

import "../semantic/dist/semantic.min.css"
import "./app.css"
import { startPolling } from "./utils";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";
import { rasaStatusUpdated } from "./apps/actions/rasa";
import BatchPane from "./testbox/batchpane";

const epicMiddleware = createEpicMiddleware();
export const history: History = createBrowserHistory();

let middlewares = applyMiddleware(epicMiddleware, routerMiddleware(history))
let tools = process.env.MODE === 'dev' ? composeWithDevTools(middlewares) : middlewares

export const store = createStore(
  connectRouter(history)(combineReducers(reducers)),
  tools
);

epicMiddleware.run(epics);


export class App extends React.Component<any, {}> {
  rasaStatusPoll$: Subscription
  
  constructor(props) {
    super(props);
    this.rasaStatusPoll$ = startPolling("/rasa/models/status", 3000).pipe(map(status => store.dispatch(rasaStatusUpdated(status)))).subscribe()
  }

  render() {
    return (
      <Provider store={store}>
        <Layout>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/testbox/:app/:batchId" component={BatchPane}/>
              <Route path="/testbox/:app" component={TestBox}/>
              <Route path="/:app/:category/:intentName" component={Categories} />
              <Route path="/:app/:category" component={Categories} />
              <Route path="/:app" component={Categories} />
              <Route path="/" component={Apps} />
              <Redirect push to="/" />
            </Switch>
          </ConnectedRouter>
        </Layout>
      </Provider>
    );
  }

  componentWillUnmount() {
    this.rasaStatusPoll$.unsubscribe();
  }
}
