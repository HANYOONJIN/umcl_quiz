import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SingleQuizItem from './SingleQuizItem';
import 'whatwg-fetch';
import axios from 'axios';
import update from 'react-addons-update';

const Positioner = {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    marginTop:'3%', 
    textAlign:'center',
    marginBottom:'5%'
}

const linkDiv = {
    marginBottom: '1rem',
    textAlign: 'right',
    color: 'gray'
}


class SingleQuiz extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            quizListData: [],
            loginData: {}
        }

        this.type = this.type.bind(this);
        this.getQuizList = this.getQuizList.bind(this);
    }

    componentDidMount() {
        this.type();
    }

    type() {
        const { type } = this.props;

        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
        let loginData = getCookie('key');
        loginData = JSON.parse(atob(loginData));

        this.setState({loginData: loginData});

        let id = loginData._id;

        if(type=='all'){
            this.getQuizList();
        }else if(type=='mine'){
            this.mine(id);
        }else if(type=='another'){
            this.another(id);
        }else if(type=='exist'){
            this.exist(id);
        }else if(type=='noneExist'){
            this.noneExist(id);
        }
    }

    getQuizList() {
        axios.get('/api/board/quizList')
		.then((response) => {
            this.setState({
                quizListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        quizname: info.quizname,
                        tag: info.tag,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching quizList',err);
        });
    }

    mine(id) {
        axios.post('/api/board/mineQuiz', {id})
		.then((response) => {
            this.setState({
                quizListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        quizname: info.quizname,
                        tag: info.tag,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching mine',err);
        });
    }

    another(id) {
        axios.post('/api/board/anotherQuiz', {id})
		.then((response) => {
            this.setState({
                quizListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        quizname: info.quizname,
                        tag: info.tag,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching another',err);
        });
    }

    exist(id) {
        axios.post('/api/board/existQuiz', {id})
		.then((response) => {
            this.setState({
                quizListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        quizname: info.quizname,
                        tag: info.tag,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching exist',err);
        });
    }

    noneExist(id) {
        axios.post('/api/board/noneExistQuiz', {id})
		.then((response) => {
            this.setState({
                quizListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        quizname: info.quizname,
                        tag: info.tag,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching noneExist',err);
        });
    }

    render() {
        const bar = (
            <div className="header-wrap">
                <button className="singlebutton6" style={{right:'10px', position:'fixed'}} onClick={this.props.newlink}>CREATE</button>
            </div>
        );

        const View = (
            this.state.quizListData.map((data, i) => {
                return (<SingleQuizItem num={data.num}
                                arrayNum={i}
                                quizName={data.quizname}
                                tag={data.tag}
                                id={data.id}
                                loginId={this.state.loginData._id}
                                key={i}/>);
                }
            )
        );
        return (
            <div>
                <div style={Positioner}>
                    {View}
                </div>
                {bar}
            </div>
            
        );
    }
}

export default SingleQuiz;