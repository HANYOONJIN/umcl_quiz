import React, { Component } from 'react';
import { Authentication } from 'components/Auth';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/authentication';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(id, pw){
        return this.props.loginRequest(id, pw).then(
            (response) => {
                if(this.props.status === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id,
                        _id: response
                    };
 
                    console.log(response);

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
 
                    Materialize.toast('반갑습니다, ' + id + '!', 2000);
                    this.props.history.push('/');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">아이디 또는 비밀번호가 일치하지 않습니다.</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return (
            <Authentication mode={true} onLogin={this.handleLogin}/>
        );
    }
}
 
const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id,pw));
        }
    };
};
 
 
export default connect(mapStateToProps, mapDispatchToProps)(Login);