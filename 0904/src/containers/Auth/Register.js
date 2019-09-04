import React, { Component } from 'react';
import { Authentication } from 'components/Auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';


class Register extends Component {

    constructor(props) {
        super(props);

        this.handleRegister = this.handleRegister.bind(this);

    }

    handleRegister(id, pw){
        return this.props.registerRequest(id, pw).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('가입완료! 로그인해주세요.', 2000);
                    this.props.history.push('/auth/login');
                    return true;
                } else {
                    /*
                        ERROR CODES:
                            1: BAD USERNAME
                            2: BAD PASSWORD
                            3: USERNAME EXISTS
                    */
                    let errorMessage = [
                        'e-mail을 작성해주세요.',
                        '비밀번호가 짧습니다.',
                        '존재하는 아이디입니다.'
                    ];
 
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }
    render() {
        return (
            <div>
                <Authentication mode={false} onRegister={this.handleRegister}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw) => {
            return dispatch(registerRequest(id, pw));
        }
    };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(Register);
