import React from 'react';
import { Register, Login } from 'containers/Auth';
import { Route } from 'react-router-dom';

class Auth extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Route path="/auth/register" component={Register}/>
                <Route path="/auth/login" component={Login}/>
            </div>
        );
    }
}

export default Auth;