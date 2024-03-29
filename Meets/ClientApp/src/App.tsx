import * as React from 'react';
import { Component } from 'react';
import Layout from './shared/Layout';

import userService from 'api/UserService';
import { useSelector } from 'react-redux';
import { stat } from 'fs';
import { RootState, useAppDispatch } from './store/createStore';
import { updateCurrentUser } from './store/currentUser';


const App = () => {

    return (<>
        <Layout />
    </>);
}

export default App;