import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { autorun } from 'mobx';
import PropTypes from 'prop-types';

const Title = {
    fontSize: '1rem',
    color: 'gray',
    textAlign: 'left',
    display: 'inline-block',
    paddingLeft: '1rem',
    width: '80%'
}

const Positioner = {
    marginTop: '1.5rem',
    width: '500px',
    height: '60px',
    background: 'white',
    display: 'inline-block'
}

const Label = {
    fontSize: '1rem',
    color: 'gray',
    textAlign: 'right',
    display: 'inline-block',
    paddingRight: '1rem',
    width: '20%'
}

class SingleQuizItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bool : false,
            tagArray: [],
            checked : false
        }
    }

    componentDidMount() {
        let tag = this.props.tag;
        tag = tag.replace(/(\s*)/g,"");
        tag = tag.substring(1);
        let splitTag = tag.split('#');

        this.setState({
            tagArray: splitTag
        });
    }

    render() {
        let link_write = '/quiz/writequiz/'+this.props.num;
        let link_read = '/quiz/readquiz/'+this.props.num;

        const tag =
            this.state.tagArray.map(data => (
                <span><a style={{backgroundColor:'blue', color:'white', fontSize:'11px', padding:'0.1px'}} onClick={() => this.tagClick(data)}>{data}</a>&nbsp;&nbsp;</span>
                )
            )

        return (
            <div>
                <div style={Positioner} className='card-3'>
                    <Link to={ this.props.id == this.props.loginId ? link_write : link_read }>
                        <div style={Title}><b>{this.props.quizName}</b></div>
                    </Link>
                    <div style={Label}>{tag}</div>
                </div>
            </div>
        );
    }
}

export default SingleQuizItem;