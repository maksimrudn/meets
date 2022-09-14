import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
//import { history } from './store/history';

import initialState from './store/initialState';
import mySaga from './store/sagas';

import { BrowserRouter } from 'react-router-dom';
import App from './App';


import configureStore from './store/configureStore';

//import registerServiceWorker from './registerServiceWorker';


require('dotenv').config();

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
export const history = createBrowserHistory({ basename: baseUrl });
const rootElement = document.getElementById('root');

const sagaMiddleware = createSagaMiddleware();
const store = configureStore(history, initialState, sagaMiddleware);

sagaMiddleware.run(mySaga);


//ReactDOM.render(
//    <Provider store={store}>
//        <ConnectedRouter history={history}>
//            <App />
//        </ConnectedRouter>
//    </Provider>,
//    rootElement);

ReactDOM.render(
    <Provider store={store}>
       
            <App />
        
    </Provider>,
  rootElement);

// Uncomment the line above that imports the registerServiceWorker function
// and the line below to register the generated service worker.
// By default create-react-app includes a service worker to improve the
// performance of the application by caching static assets. This service
// worker can interfere with the Identity UI, so it is
// disabled by default when Identity is being used.
//
////registerServiceWorker();
