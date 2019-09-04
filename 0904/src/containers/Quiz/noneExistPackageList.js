import React, { Component } from 'react';
import { PackageList } from 'components/Quiz';
import { connect } from 'react-redux';
import axios from 'axios';
import update from 'react-addons-update';

class noneExistPackageList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: {}
        }

        this.newlink = this.newlink.bind(this);
    }

    newlink(){
        this.props.history.push('/quiz/newpackage');
    }

    render() {
        return (
            <PackageList newlink={this.newlink} type='noneExist'/>
        );
    }
}
 
export default noneExistPackageList;