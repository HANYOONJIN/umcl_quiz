import React, { Component } from 'react';
import { PackageList } from 'components/Quiz';
import { connect } from 'react-redux';
import axios from 'axios';
import update from 'react-addons-update';

class PackageListC extends React.Component {

    constructor(props) {
        super(props);

        this.newlink = this.newlink.bind(this);
    }
/*
    componentDidMount(){
        this.getSession();
    }

    getSession() {
        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        let loginData = getCookie('key');
        if(typeof loginData === "undefined") return;
        loginData = JSON.parse(atob(loginData));
        if(!loginData.isLoggedIn) return;

        this.setState({loginData: loginData});
    }
*/
    newlink(){
        this.props.history.push('/quiz/newpackage');
    }

    render() {
        return (
            <PackageList newlink={this.newlink} type='all'/>
        );
    }
}
 
export default PackageListC;