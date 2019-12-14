import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './components/Login/';
import Main from './components/Main/';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Login} />
            <Route path="/dev/:id" component={Main} />
        </BrowserRouter>
    );
}