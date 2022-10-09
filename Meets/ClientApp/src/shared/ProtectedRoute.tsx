import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import useAccountStore from '../hooks/useAccountStore';




const ProtectedRoute = ({ ...props }) => {

    const accountStore = useAccountStore();


    return accountStore.isSignedIn ?
        <Route {...props} /> : <Redirect to={'/'} />
};

export default ProtectedRoute;