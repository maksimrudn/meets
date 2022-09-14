import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Layout from './shared/Layout';

import mapStateToProps from 'store/mapStateToProps';
import mapDispatchToProps from 'store/mapDispatchToProps';

import userService from 'api/UserService';

import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import TopMenu from 'shared/TopMenu';
import LeftMenu from 'shared/LeftMenu';



interface UserInfo {
    userName: string
    user: any
    isAuthenticated: boolean
    isAdmin: boolean
    hasGeolocation: boolean
}

interface AppProps {
    userInfo: UserInfo
}

type AppState = {
    loadErrorFlag: boolean,
    loadErrorMessage: string
}

class App extends Component<any, any> {
    static displayName = App.name;

    constructor(props: AppProps) {
        super(props);

        this.state = {
            collapsed: false,
            loadErrorFlag: false,
            loadErrorMessage: ''
        };


    }

    componentWillMount() {
        try {
            var userInfo = userService.getAuthInfo();
            this.props.UpdateUserInfo(userInfo);
        }
        catch (err: any) {
            this.setState({
                loadErrorFlag: true,
                loadErrorMessage: err.message
            });
        }
    }


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {


        return (
            <Layout loadErrorFlag={this.state.loadErrorFlag} loadErrorMessage={this.state.loadErrorMessage} />

        );
    }
}


export default connect(mapStateToProps("App"), mapDispatchToProps("App"))(App);