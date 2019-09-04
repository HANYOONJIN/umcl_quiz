import React, { Component } from 'react';
import { connect } from 'react-redux';
import { QuizItem } from 'components/Quiz';
import axios from 'axios';
import update from 'react-addons-update';

import { decorate, observable, action } from 'mobx';
import {observer} from "mobx-react"

const Wrapper = {
    marginTop: '1rem'
}


const Positioner = {
    position: 'absolute',
    left: '50%',
    marginTop: '4rem',
    marginBottom: '4rem',
    transform: 'translate(-50%, 0)'
}

const Positioner2 = {
    position:'fixed',
    right:'5%',
    top:'50%',
    cursor: 'pointer'
}

// 너비, 그림자 설정
const ShadowedBox = {
    marginTop: '1rem'
}

// children 이 들어가는 곳
const Contents = {
    background: 'white',
    padding: '2rem',
    height: 'auto'
}

const Contents2 = {
    background: 'white',
    height: 'auto'
}

class NewQuiz extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: {}
        }

        this.num = 0;
        this.answer = '';

        this.quizname = '';
        this.quizoption = [];
        this.tag = '';
        this.score = 0;

        this.optionlist = '';

        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        this.getSession = this.getSession.bind(this);

    }
    
    componentDidMount() {
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

        console.log(loginData);

        this.setState({loginData: loginData});
    }
    
    handleChange(e){
        this[e.target.name] = e.target.value;
    }

    handleUpload(num1, num2, quizname, quizoption, tag, score){
        this.quizname = quizname;
        this.quizoption = quizoption;
        this.tag = tag;
        this.score = score;
    }

    handleInsert(){
        const id = this.state.loginData._id;

        var string = this.tag.substring(0, 1);
        if(string!='#'){
            let $toastContent = $('<span style="color: #FFB4BA">#tag 형식으로 작성해주세요.</span>');
            Materialize.toast($toastContent, 2000);
            return false;
        }

        this.answer = '';

        for(var j=0; j<this.quizoption.length; j++){ // 답안 번호
            if(j!=this.quizoption.length-1){
                this.optionlist = this.optionlist + this.quizoption[j].content + ',';    
            }else{
                this.optionlist += this.quizoption[j].content
            }

            if(this.quizoption[j].check){
                this.answer += j.toString();
            }
        }

        const quizname = this.quizname;
        const optionlist = this.optionlist;
        const tag = this.tag;
        const answer = this.answer;
        const score = this.score;
    
        axios.post('/api/board/quizInsert',{quizname, optionlist, tag, answer, score, id})
        .then((response) => {
            Materialize.toast('Success!', 2000);
            this.props.history.push('/quiz/singlequiz');
        })
        .catch((err)=>{
            console.log('Error fetching quizInsert',err);
        });
    }

    render() {
        return (
            <div style={Positioner}>
                <button className="savebutton" onClick={this.handleInsert}>S&nbsp;&nbsp;A&nbsp;&nbsp;V&nbsp;&nbsp;E</button>
                <QuizItem mode='new' onUpload={this.handleUpload}/>
            </div>
        );
    }
}

decorate(NewQuiz, {
    answer : observable,
    quizname : observable,
    quizoption : observable,
    tag : observable,
    score : observable,
    optionlist : observable,

    handleUpload : action,
    handleInsert : action
  })

 
export default observer(NewQuiz);