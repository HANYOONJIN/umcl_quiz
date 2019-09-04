import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Wrapper = {
    marginTop: '0.5rem'
}

const Wrapper2 = {
    marginTop: '1rem',
    height: '2rem'
}

const Title = {
    marginTop: '1rem',
    fontSize: '1.3rem',
    color: 'gray',
    textAlign: 'center',
    background: 'white'
}

const Label = {
    fontSize: '1rem',
    color: 'gray',
    marginBottom: '0.2rem'
}

const Label2 = {
    fontSize: '1rem',
    color: 'red',
    marginBottom: '0.25rem'
}

const ButtonStyle = {
    marginTop: '0.8rem',
    paddingTop: '0.3rem',
    paddingBottom: '0.3rem',
    background: '#c1c1c1',
    color: 'white',
    textAlign: 'center',
    fontSize: '1.1rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: '.2s all',
    width: '100%',
}

const linkDiv = {
    marginTop: '1rem',
    textAlign: 'center',
    color: 'blue',
    fontSize: '0.8rem',
    display: 'inline-block'
}

const linkStyle = {
    color: 'gray',
    fontSize: '1rem'
}

const Positioner = {
    position: 'absolute',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -90%)'
}

// 너비, 그림자 설정
const ShadowedBox = {
    background: 'white',
    marginTop: '1rem'
}

// 로고
const LogoWrapper = {
    background: 'gray',
    height: '0.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

// children 이 들어가는 곳
const Contents = {
    background: 'white',
    padding: '2rem',
    height: 'auto'
}

class Authentication extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username:"",
            password:"",
            cpassword:"",
            pwcheck:""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    
   
      handleChange(e){
          let nextState = {};
          nextState[e.target.name] = e.target.value;
          this.setState(nextState);
      }

      handleKeyPress(e){
        if(e.charCode==13) {
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
      }

      
      handleRegister(){
        let id = this.state.username;
        let pw = this.state.password;
        let pw2 = this.state.cpassword;

        if(pw!=pw2){
          this.setState({
              cpassword: '',
              pwcheck: 'Passwords do not match'
          });
          return;
        }
 
        this.props.onRegister(id, pw).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: '',
                        cpassword: '',
                        pwcheck:''
                    });
                }
            });
        }

        handleLogin(){
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            });
        }


    render() {

        const loginView = (
            <div>
                <div style={Wrapper}>
                    <input name="username" placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.username}/>
                </div>
                <div style={Wrapper}>
                    <input name="password" placeholder="Password" type="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    onKeyPress={this.handleKeyPress} autocomplete="off"/>
                </div>
                <div style={Wrapper2}></div>
                <button onClick={this.handleLogin} className="b01_simple_rollover">SignIN</button>
                <div style={linkDiv}>&nbsp;&nbsp;회원가입을 원하십니까?&nbsp;
                <Link to='/auth/register' style={linkStyle}>SignUP</Link>
                </div>
            </div>
        );

        const registerView = (
            <div>
                <div style={Wrapper}>
                    <input name="username1" placeholder="Email"
                    onChange={this.handleChange}
                    value={this.state.username}/>
                </div>
                <div style={Wrapper}>
                    <input name="password1" placeholder="Password" type="password"
                    onChange={this.handleChange}
                    value={this.state.password} autocomplete="off"/>
                </div>
                <div style={Wrapper}>
                    <input name="cpassword1" placeholder="Check Password" type="password"
                    onChange={this.handleChange}
                    value={this.state.cpassword}
                    onKeyPress={this.handleKeyPress} autocomplete="off" />
                </div>
                <div style={Wrapper2}>
                    <div style={Label2} name="pwcheck">{this.state.pwcheck}</div>
                </div>
                <button onClick={this.handleRegister} className="b01_simple_rollover">SignUP</button>
                <div style={linkDiv}>&nbsp;&nbsp;가입한 아이디가 있으십니까?&nbsp;
                <Link to='/auth/login' style={linkStyle}>SignIN</Link>
                </div>
            </div>
        );
        return (
            <div style={Positioner}>
                <div style={ShadowedBox} className="ShadowedBox card-1">
                   <div style={LogoWrapper}></div>
                   <div style={Title}>{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    <div style={Contents}>
                        {this.props.mode ? loginView : registerView }
                    </div>
                </div>
            </div>
        );
    }
}

export default Authentication;