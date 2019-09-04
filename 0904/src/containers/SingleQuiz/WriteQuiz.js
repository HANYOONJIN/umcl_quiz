import React, { Component } from 'react';
import { connect } from 'react-redux';
import { QuizItem } from 'components/Quiz';
import axios from 'axios';
import update from 'react-addons-update';

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

class WriteQuiz extends Component {

    constructor(props) {
        super(props);

        this.state = {
            AorB : true
        }

        this.ChangeA = this.ChangeA.bind(this);
        this.ChangeB = this.ChangeB.bind(this);
    }

    ChangeA() {
        this.setState({
            AorB : true
        });
    }

    ChangeB() {
        this.setState({
            AorB : false
        });
    }

    render() {

        return (
            <div style={Positioner}>
                <div className="ShadowedBox">
                    <div style={{textAlign:'center'}}>
                    <span style={ this.state.AorB ? AorBbutton : AorBbutton2 } onClick={this.ChangeA}>문제</span>
                    <span style={ this.state.AorB ? AorBbutton2 : AorBbutton }onClick={this.ChangeB}>결과</span>
                    </div>
                </div>
                { this.state.AorB ?
                <div style={ShadowedBox}>
                    <QuizItem mode='write' content={this.props.match.params.num}/>
                </div>
                :
                <div>
                    <div style={ShadowedBox} className="ShadowedBox card-2">
                        <div style={Contents}>
                            <div style={LogoWrapper}></div>
                            <div style={{marginTop: '40px'}}>
                                <QuizAVG quiznum={this.props.match.params.num} num={0}/>
                            </div>
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

export default WriteQuiz;