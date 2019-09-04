import React, { Component } from 'react';
import { SingleQuiz } from 'components/SingleQuiz';
import { connect } from 'react-redux';
import axios from 'axios';
import update from 'react-addons-update';

class noneExistQuiz extends React.Component {

    constructor(props) {
        super(props);

        this.newlink = this.newlink.bind(this);
    }

    newlink(){
        this.props.history.push('/quiz/newquiz');
    }

    render() {
        return (
            <SingleQuiz newlink={this.newlink} type='noneExist'/>
        );
    }
}
 
export default noneExistQuiz;