import React, { Component } from 'react';
import { PackageList } from 'components/Quiz';
import { connect } from 'react-redux';
import axios from 'axios';
import update from 'react-addons-update';

class anotherPackageList extends React.Component {

    constructor(props) {
        super(props);

        this.newlink = this.newlink.bind(this);
    }

    newlink(){
        this.props.history.push('/quiz/newpackage');
    }

    render() {
        return (
            <PackageList newlink={this.newlink} type='another'/>
        );
    }
}
 
export default anotherPackageList;