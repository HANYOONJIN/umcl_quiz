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

const AorBbutton = {
    width: '100px',
    height: '70px',
    margin: '0.5rem',
    padding: '1.2rem',
    paddingTop: '1rem',
    borderTop: '2px solid gray',
    color: 'gray',
    cursor: 'pointer'
}

const AorBbutton2 = {
    width: '100px',
    height: '70px',
    margin: '0.5rem',
    padding: '1.2rem',
    paddingTop: '1rem',
    borderTop: '2px solid white',
    color: 'gray',
    cursor: 'pointer'
}

const LogoWrapper = {
    background: 'gray',
    height: '0.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

class WritePackage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: {}
        }

        this.num = 0;
        this.answer = '';
        this.AorB = true;

        this.bool = false;

        this.quiz = [];
        this.packagetitle = '';
        this.packagecontent = '';
        this.packagenum = 0;
        this.quizlist = [];
        this.uploadQuiz = [];
        this.uploadList = '';

        this.getWritePackageList = this.getWritePackageList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.selectChange = this.selectChange.bind(this);

        this.ChangeA = this.ChangeA.bind(this);
        this.ChangeB = this.ChangeB.bind(this);

    }

    componentDidMount(){
        this.getWritePackageList();
    }

    getWritePackageList() {
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
                    })
            }
        })
        .catch((err)=>{
            console.log('Error fetching Get_package_quiz',err);
        });
    }
    
    handleChange(e){
        this[e.target.name] = e.target.value;
    }

    selectChange(e) {
        this.setState({
          value: e.target.value
        })
    }

    ChangeA() {
        this.AorB = true;
    }

    ChangeB() {
        this.AorB = false;
    }

    render() {
        const quizView = (
            <div>
                <div style={Wrapper}>
                    <input name="packagetitle" placeholder="packagetitle" type="text" style={{fontSize:'25px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.packagetitle} disabled/>
                </div>
                <div style={Wrapper}>
                    <input name="packagecontent" placeholder="packagecontent" type="text" style={{fontSize:'15px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.packagecontent} disabled/>
                </div>
            </div>
        );

        const buttonView = (
            <div>
                <i className="material-icons" style={{color:'gray', fontSize:'40px'}}>add_circle</i>
            </div>
        );


        const quizcontentList = this.quiz.map(
            data => (
              <QuizItem
                mode='write'
                num={data.num}
                content={data.content}
                key={data.num}
                onDelete={this.handleDelete}
              />
            )
          );

        const quizResultList = this.quiz.map(
            data => (
              <QuizAVG
                quiznum={data.content}
                key={data.num}
                num={data.num}
              />
            )
          );


        return (
            <div style={Positioner}>
                <div className="ShadowedBox">
                    <div style={{textAlign:'center'}}>
                    <span style={ this.AorB ? AorBbutton : AorBbutton2 } onClick={this.ChangeA}>문제집</span>
                    <span style={ this.AorB ? AorBbutton2 : AorBbutton }onClick={this.ChangeB}>결과</span>
                    </div>
                </div>
                { this.AorB ?
                <div>
                    <div style={ShadowedBox} className="ShadowedBox card-2">
                        <div style={Contents}>
                            { quizView }
                        </div>
                    </div>
                    <div style={Contents2}>
                        { quizcontentList }
                    </div>
                </div>
                :
                <div>
                    <div style={ShadowedBox} className="ShadowedBox card-2">
                        <div style={Contents}>
                            <div style={LogoWrapper}></div>
                            <PackageAVG packagenum={this.props.match.params.num}/>
                            <div style={LogoWrapper}></div>
                            <div style={{marginTop: '40px'}}>{quizResultList}</div>
                        </div>
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
            <div style={{fontSize:'18px', color:'gray', textAlign:'left', margin:'20px'}}>평균 : <b>{this.state.avgResult}점</b></div>
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
            existSum : 0
        }

        this.getQuizAVG = this.getQuizAVG.bind(this);
    }

    componentDidMount(){
        this.getQuizAVG();
    }

    getQuizAVG() {
        const quiznum = this.props.quiznum;

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

        axios.post('/api/board/quizExistSum',{quiznum})
        .then((response) => {
            this.setState({
                existSum : response.data.sum[0].count
            });
        })
        .catch((err)=>{
            console.log('Error fetching quizExistSum',err);
        });

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
            <div style={{fontSize:'15px', color:'gray', textAlign:'left', marginLeft:'20px', marginTop:'30px'}}><b>Q{this.state.num+1}.</b> {this.state.quizname}</div>
            <span style={{fontSize:'13px', color:'gray', display:'inline-block', textAlign:'left', margin:'20px'}}>정답 확률 : <b style={{color:'red'}}>{this.state.avgResult}%</b></span>
            <span style={{fontSize:'13px', color:'gray', display:'inline-block', float:'right', margin:'20px'}}>제출 인원 수 : <b>{this.state.existSum}명</b></span>
        </div>
        )
    }
}

decorate(WritePackage, {
    packagetitle : observable,
    packagecontent : observable,
    packagenum : observable,
    quizlist : observable,
    quiz : observable,
    uploadQuiz : observable,
    answer : observable,
    AorB : observable,
    bool : observable,

    turnBool : action,
    selectChange : action,
    getWritePackageList : action
})
 
export default observer(WritePackage);