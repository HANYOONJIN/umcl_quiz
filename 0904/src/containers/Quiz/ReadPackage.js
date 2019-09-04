import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { decorate, observable, action } from 'mobx';
import {observer} from "mobx-react"
import { QuizItem } from 'components/Quiz';


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


const ButtonStyle = {
    marginTop: '2rem',
    marginLeft: '2rem',
    marginBottom: '2rem',
    paddingTop: '0.6rem',
    paddingBottom: '0.5rem',
    background: 'gray',
    color: 'white',
    textAlign: 'center',
    fontSize: '1.25rem',
    fontWeight: '500',
    cursor: 'pointer',
    userSelect: 'none',
    transition: '.2s all',
    width: '20%',
    borderRadius:'5px'
}

const LogoWrapper = {
    background: 'gray',
    height: '0.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

class ReadPackage extends Component {

    constructor(props) {
        super(props);

        this.num = 0;
        this.packagetitle = '';
        this.packagecontent = '';
        this.packagenum = 0;
        this.quizlist = {};
        this.quiznum = 0;
        this.quiz = [];
        this.submitQuiz = [];

        this.noneExist = true;
        this.scoreSum = 0;

        this.componentChange = false;
        this.resultConfirm = true;
        this.uploadNum = null;
        this.uploadList = '';

        this.session = {};

        this.getReadPackageList = this.getReadPackageList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        this.getSession = this.getSession.bind(this);

    }

    componentDidMount(){
        this.getReadPackageList();
        this.getSession();
    }

    getReadPackageList() {
        this.packagenum = this.props.match.params.num;
        const packagenum = this.props.match.params.num;

        axios.post('/api/board/packageSelect',{packagenum})
        .then((response) => {
            this.packagetitle = response.data.package[0].title;
            this.packagecontent = response.data.package[0].content;
        })
        .catch((err)=>{
            console.log('Error fetching packageSelect',err);
        });
        
        axios.post('/api/board/Get_package_quiz',{packagenum})
        .then((response) => {
            for(var i=0; i<response.data.num.length; i++){
                this.quiz = this.quiz.concat({
                    num: this.num++,
                    content: response.data.num[i].quiz_num
                });

                this.submitQuiz = this.submitQuiz.concat({
                    quiznum: null,
                    option: null
                });
            }
        })
        .catch((err)=>{
            console.log('Error fetching Get_package_quiz',err);
        });
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
        const packagenum = this.props.match.params.num;

        axios.post('/api/board/packageConfirm',{id, packagenum})
        .then((response) => {
            if(response.data.confirm){
                this.noneExist = true;
            }else{
                this.noneExist = false;
                this.scoreSum = response.data.scoreSum;
            }
        })
        .catch((err)=>{
            console.log('Error fetching packageSelect',err);
        });
    }

    handleSubmit(quiznum, num, option, score){
        this.submitQuiz = update(
            this.submitQuiz,
            {
                [num] : {
                    quiznum: {$set: quiznum},
                    option: {$set: option},
                    score: {$set: score}
                }
            }
        )
    }

    handleInsert(){
        const packagenum = this.packagenum;
        const id = this.session._id;


        for(var i=0; i<this.submitQuiz.length; i++){ // 퀴즈 번호
            this.realAnswer = '';
            this.answer = '';
            this.correct = 'false';
            for(var j=0; j<this.submitQuiz[i].option.length; j++){ // 답안 번호
                if(this.submitQuiz[i].option[j].check){
                    this.answer += j.toString();
                }
                if(this.submitQuiz[i].option[j].realAnswer){
                    this.realAnswer += j.toString();
                }
            }

            if(this.answer==this.realAnswer){
                this.correct = 'true';
            }

            var quiznum = this.submitQuiz[i].quiznum;
            var answer = this.answer;
            var correct = this.correct;
            var score = this.submitQuiz[i].score;
            
            axios.post('/api/board/resultInsert', {packagenum, quiznum, id, score, answer, correct})
            .then((response) => {
                Materialize.toast('Success!', 2000);
                this.props.history.push('/quiz/packageList');
            })
            .catch((err)=>{
                console.log('Error fetching resultInsert',err);
            });
        }
    }

    render() {

        const quizView = (
            <div>
                <div style={Wrapper}>
                    <div name="packagetitle" style={{fontSize:'25px', color:'black'}}>
                        {this.packagetitle}
                    </div>
                </div>
                <div style={Wrapper}>
                    <div name="packagecontent" style={{fontSize:'15px', color:'gray'}}>
                        {this.packagecontent}
                    </div>
                </div>
            </div>
        );

        const quizcontentList = this.quiz.map(
            data => (
              <QuizItem
                mode='read'
                num={data.num}
                content={data.content}
                key={data.num}
                onDelete={this.handleDelete}
                onSubmit={this.handleSubmit}
              />
            )
          );

        const quizResultList = this.quiz.map(
            data => (
              <QuizAVG
                quiznum={data.content}
                key={data.num}
                num={data.num}
                id={this.session._id}
                packagenum={this.props.match.params.num}
              />
            )
          );

        return (
            <div style={Positioner}>
                {this.noneExist ?
                <div>
                    <div style={ShadowedBox} className="ShadowedBox card-3">
                        <div style={Contents}>
                            { quizView }
                        </div>
                    </div>
                    <div style={Contents2}>
                        { quizcontentList }
                    </div>
                    <div style={Contents2} className="card-3">
                        <button className="b01_simple_rollover" 
                            style={{marginLeft:'50px', marginBottom:'30px', marginTop:'30px'}}
                            onClick={this.handleInsert}>&nbsp;제&nbsp;&nbsp;&nbsp;출&nbsp;
                        </button>
                    </div>
                </div>
                :
                <div style={ShadowedBox} className="ShadowedBox card-2">
                    <div style={Contents}>
                        <div style={LogoWrapper}></div>
                        <PackageAVG packagenum={this.props.match.params.num} score={this.scoreSum}/>
                        <div style={LogoWrapper}></div>
                        <div style={{marginTop: '40px'}}>{quizResultList}</div>
                    </div>
                </div>
                }
            </div>              
        );
    }
}

class PackageAVG extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avgResult : 0
        }

        this.getPackageAVG = this.getPackageAVG.bind(this);
    }

    componentDidMount(){
        this.getPackageAVG();
    }

    getPackageAVG() {
        const packagenum = this.props.packagenum;

        axios.post('/api/board/packageAVG',{packagenum})
        .then((response) => {
            if(response.data.avg[0].AVG==null){
                this.setState({
                    avgResult : 0
                });
            }else{
                this.setState({
                    avgResult : response.data.avg[0].AVG
                });
            }
        })
        .catch((err)=>{
            console.log('Error fetching packageAVG',err);
        });
    }

    render() {
      return (
        <div>
            <span style={{fontSize:'17px', color:'gray', display:'inline-block', margin:'20px'}}>평균 : <b>{this.state.avgResult}점</b></span>
            <span style={{fontSize:'17px', color:'red', display:'inline-block', margin:'20px', float: 'right'}}>내 점수 : <b>{this.props.score}점</b></span>
        </div>
        )
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

decorate(ReadPackage, {
    num: observable,
    packagetitle: observable,
    packagecontent: observable,
    packagenum: observable,
    quiznum: observable,
    quizlist: observable,
    quiz: observable,
    answer: observable,
    noneExist: observable,
    scoreSum: observable,

    submitQuiz: observable,
    componentChange: observable,
    session: observable,
    uploadNum: observable,
    resultConfirm: observable,
    uploadList: observable,

    getQuizList: action,
    handleSubmit: action,
    handleInsert: action,
    linkFunction: action,
    confirm: action,
    getSession: action
  })

export default observer(ReadPackage);