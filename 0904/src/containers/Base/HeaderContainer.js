import React, { Component } from 'react';
import Header from 'components/Base/Header';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest  } from 'actions/authentication';

class HeaderContainer extends Component {

    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
        this.Loginlink = this.Loginlink.bind(this);
        this.Registerlink = this.Registerlink.bind(this);
    }

    componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
   
        // get loginData from cookie
        let loginData = getCookie('key');
   
        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined") return;
   
        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));
   
        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;
   
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        _id: '',
                        username: ''
                    };
   
                    document.cookie='key=' + btoa(JSON.stringify(loginData));
   
                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">다시 로그인해주세요!</span>');
                    Materialize.toast($toastContent, 4000);
                }
            }
        );
    }

    handleLogout(){
        this.props.logoutRequest().then(
            () => {
                //Materialize.toast('Good Bye!', 2000);
 
                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: '',
                    _id: ''
                };
 
                document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                location.href='/';
            }
        );
    }

    Loginlink(){
        this.props.history.push('/auth/login');
    }

    Registerlink(){
        this.props.history.push('/auth/register');
    }
  
    render() {
        return (
            <div>
                <Header isLoggedIn={this.props.status.isLoggedIn} onLogout={this.handleLogout} Loginlink={this.Loginlink} Registerlink={this.Registerlink}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);