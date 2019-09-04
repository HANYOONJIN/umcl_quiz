import React, { Component } from 'react';
import { connect } from 'react-redux';
import { QuizItem } from 'components/Quiz';
import axios from 'axios';
import update from 'react-addons-update';
import { decorate, observable, action } from 'mobx';
import {observer} from "mobx-react"

const Positioner = {
    position: 'absolute',
    left: '50%',
    marginTop: '4rem',
    marginBottom: '4rem',
    transform: 'translate(-50%, 0)'
}

const ShadowedBox = {
    marginTop: '2rem'
} 

const Contents = {
    background: 'white',
    padding: '2rem',
    height: 'auto'
}

const LogoWrapper = {
    background: 'gray',
    height: '0.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

class ReadQuiz extends Component {

    constructor(props) {
        super(props);

        this.session = {};
        this.quiznum = 0;
        this.option = [];
        this.score = 0;

        this.realAnswer = '';
        this.answer = '';
        this.correct = 'false';

        this.noneExist = true;

        this.getSession = this.getSession.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInsert = this.handleInsert.bind(this);

    }

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

        this.session = loginData;

        const id = loginData._id;
        const quiznum = this.props.match.params.num;
        axios.post('/api/board/singleQuizConfirm',{id, quiznum})
        .then((response) => {
            if(response.data.confirm){
                this.noneExist = true;
            }else{
                this.noneExist = false;
            }
        })
        .catch((err)=>{
            console.log('Error fetching packageSelect',err);
        });
    }

    handleSubmit(quiznum, num, option, score){
        this.quiznum = quiznum;
        this.option = option;
        this.score = score;
    }

    handleInsert(){
        const id = this.session._id;

        for(var j=0; j<this.option.length; j++){ // 답안 번호
            if(this.option[j].check){
                this.answer += j.toString();
            }
            if(this.option[j].realAnswer){
                this.realAnswer += j.toString();
            }
        }

        if(this.answer==this.realAnswer){
            this.correct = 'true';
        }

        var packagenum = 0;
        var quiznum = this.quiznum;
        var answer = this.answer;
        var correct = this.correct;
        var score = this.score;
            
        axios.post('/api/board/resultInsert', {packagenum, quiznum, id, score, answer, correct})
        .then((response) => {
            Materialize.toast('Success!', 2000);
            this.props.history.push('/quiz/singlequiz');
        })
        .catch((err)=>{
            console.log('Error fetching resultInsert',err);
        });
    }

    render() {

        return (
            <div style={Positioner}>
                {this.noneExist ?
                    <div style={ShadowedBox}>
                        <QuizItem mode='read' content={this.props.match.params.num} onSubmit={this.handleSubmit}/>
                        <button className="b01_simple_rollover" 
                            style={{marginLeft:'50px', marginBottom:'30px', marginTop:'30px'}}
                            onClick={this.handleInsert}>&nbsp;제&nbsp;&nbsp;&nbsp;출&nbsp;
                        </button>
                    </div>
                :
                <div style={ShadowedBox} className="ShadowedBox card-2">
                    <div style={Contents}>
                        <div style={LogoWrapper}></div>
                        <div style={{marginTop: '40px'}}>
                            <QuizAVG quiznum={this.props.match.params.num} num={0} id={this.session._id} packagenum={0}/>
                        </div>
                    </div>
                </div>
                }
            </div> 
        );
    }
}

class QuizAVG extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avgResult : 0,
            num : 0,
            quizname : '',
            existSum : 0,
            correct : 'true'
        }

        this.getQuizAVG = this.getQuizAVG.bind(this);
    }

    componentDidMount(){
        this.getQuizAVG();
    }

    getQuizAVG() {
        const quiznum = this.props.quiznum;
        const id = this.props.id;
        const packagenum = this.props.packagenum;
/////////////////////////////////////////////////////////////////평균점수
        axios.post('/api/board/quizAVG',{quiznum})
        .then((response) => {
            if(response.data.avg[0].AVG==null){
                this.setState({
                    avgResult : 100
                });
            }else{
                this.setState({
                    avgResult : response.data.avg[0].AVG
                });
            }
        })
        .catch((err)=>{
            console.log('Error fetching quizAVG',err);
        });
/////////////////////////////////////////////////////////////////몇명이풀었니
        axios.post('/api/board/quizExistSum',{quiznum})
        .then((response) => {
            this.setState({
                existSum : response.data.sum[0].count
            });
        })
        .catch((err)=>{
            console.log('Error fetching quizExistSum',err);
        });
/////////////////////////////////////////////////////////////////퀴즈 맞았니
        axios.post('/api/board/quizConfirm',{quiznum, packagenum, id})
        .then((response) => {
            console.log(response.data.confirm[0].correct);
            this.setState({
                correct : response.data.confirm[0].correct
            });
        })
        .catch((err)=>{
            console.log('Error fetching quizConfirm',err);
        });
/////////////////////////////////////////////////////////////////어떤퀴즈니
        axios.post('/api/board/quizSelect', {quiznum})
        .then((response) => {
            this.setState({
                num : this.props.num,
                quizname : response.data.quiz[0].quizname
            });
        })
        .catch((err)=>{
            console.log('Error fetching quizSelect',err);
        });
    }

    render() {
      return (
        <div>
            {this.state.correct == 'true'
            ?
            <div style={{fontSize:'15px', color:'blue', textAlign:'left', marginLeft:'20px', marginTop:'30px'}}><b>Q{this.state.num+1}.</b> {this.state.quizname}</div>
            :
            <div style={{fontSize:'15px', color:'red', textAlign:'left', marginLeft:'20px', marginTop:'30px'}}><b>Q{this.state.num+1}.</b> {this.state.quizname}</div>
            }
            <span style={{fontSize:'13px', color:'gray', display:'inline-block', textAlign:'left', margin:'20px'}}>정답 확률 : <b style={{color:'red'}}>{this.state.avgResult}%</b></span>
            <span style={{fontSize:'13px', color:'gray', display:'inline-block', float:'right', margin:'20px'}}>제출 인원 수 : <b>{this.state.existSum}명</b></span>
        </div>
        )
    }
}

decorate(ReadQuiz, {
    session: observable,
    quiznum: observable,
    option: observable,
    realAnswer: observable,
    answer: observable,
    correct: observable,
    score: observable,
    noneExist: observable,

    handleSubmit: action,
    handleInsert: action,
    getSession: action
  })

export default observer(ReadQuiz);