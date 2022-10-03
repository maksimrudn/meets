import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import App from './App';
import { createStore } from './store/createStore';

require('dotenv').config();

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
export const history = createBrowserHistory({ basename: baseUrl });
const rootElement = document.getElementById('root');


const store = createStore();



ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    rootElement
);

