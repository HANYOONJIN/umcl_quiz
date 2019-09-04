import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SingleQuiz } from 'components/SingleQuiz';
import 'whatwg-fetch';
import axios from 'axios';
import update from 'react-addons-update';

class SingleQuizC extends React.Component {

    constructor(props) {
        super(props);

        this.newlink = this.newlink.bind(this);

    }

    newlink(){
        this.props.history.push('/quiz/newquiz');
    }

    render() {
        return (
            <SingleQuiz type='all' newlink={this.newlink}/>
        );
    }
}

export default SingleQuizC;