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

class NewPackage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: {}
        }

        this.num = 0;
        this.key = 0;
        this.answer = '';
        this.AorB = true;
        this.quiznumber = 0;

        this.packagetitle = '';
        this.packagecontent = '';
        this.packagenum = 0;
        this.quizlist = [];
        this.quiz = [];
        this.uploadQuiz = [];
        this.uploadList = '';

        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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

    handleCreate(){
        this.quiz = this.quiz.concat({
            num: this.num++,
            content: null
        })
        this.uploadQuiz = this.uploadQuiz.concat({
            dbnum: null,
            quizname: '',
            quizoption: [],
            tag: '',
            optionlist: '',
            score: 0
        })
    }

    handleUpload(dbnum, quiznum, quizname, quizoption, tag, score, level){
        this.uploadQuiz = update(
                this.uploadQuiz,
                {
                    [quiznum] : {
                        dbnum: {$set: dbnum},
                        quizname: {$set: quizname},
                        quizoption: {$set: quizoption},
                        tag: {$set: tag},
                        score: {$set: score},
                        level: {$set: level}
                    }
                }
            )
    }

    handleDelete(number) {
        if(this.num>0){
            this.num--;
        }

        console.log(number);

        this.quiz = this.quiz.filter(info => info.num !== number);

        let arr = this.uploadQuiz;
        arr.splice(number, 1);

        this.uploadQuiz = arr;
    }

    handleInsert(){
        const id = this.state.loginData._id;

        for(var k=0; k<this.uploadQuiz.length; k++){
            var string = this.uploadQuiz[k].tag.substring(0, 1);
            if(string!='#'){
                let $toastContent = $('<span style="color: #FFB4BA">#tag 형식으로 작성해주세요.</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
            }
        }

        const title = this.packagetitle;
        const content = this.packagecontent;

        axios.post('/api/board/packageInsert',{title, content, id})
            .then((response) => {
                console.log('Success');
                const packagenum = response.data.num;

                for(var i=0; i<this.uploadQuiz.length; i++){ // 퀴즈 번호
            
                this.answer = '';
                for(var j=0; j<this.uploadQuiz[i].quizoption.length; j++){ // 답안 번호
                    if(j!=this.uploadQuiz[i].quizoption.length-1){
                        this.uploadQuiz[i].optionlist = this.uploadQuiz[i].optionlist + this.uploadQuiz[i].quizoption[j].content + ',';    
                    }else{
                        this.uploadQuiz[i].optionlist += this.uploadQuiz[i].quizoption[j].content
                    }

                    if(this.uploadQuiz[i].quizoption[j].check){
                        this.answer += j.toString();
                    }
                }

                //const dbnum = this.uploadQuiz[i].dbnum;
                const quizname = this.uploadQuiz[i].quizname;
                const optionlist = this.uploadQuiz[i].optionlist;
                const tag = this.uploadQuiz[i].tag;
                const answer = this.answer;
                const score = this.uploadQuiz[i].score;
                const level = this.uploadQuiz[i].level;
            
                axios.post('/api/board/quizInsert',{quizname, optionlist, tag, answer, score, id, level})
                    .then((response) => {

                        const quiznum = response.data.num;
                        const number = this.quiznumber++;

                        axios.post('/api/board/package_quizInsert',{packagenum, quiznum, number})
                            .then((response) => {
                                console.log('Success');            
                            })
                            .catch((err)=>{
                                console.log('Error fetching packageUpdate',err);
                            });
                        }
                    );

                }
                Materialize.toast('Success!', 2000);
                this.props.history.push('/quiz/packageList');
            })
            .catch((err)=>{
                console.log('Error fetching packageUpdate',err);
            });
    }

    render() {
        const quizView = (
            <div>
                <div style={Wrapper}>
                    <input name="packagetitle" placeholder="packagetitle" type="text" style={{fontSize:'25px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.packagetitle}/>
                </div>
                <div style={Wrapper}>
                    <input name="packagecontent" placeholder="packagecontent" type="text" style={{fontSize:'15px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.packagecontent}/>
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
                mode='new'
                num={data.num}
                content={data.content}
                key={data.num}
                onDelete={this.handleDelete}
                onUpload={this.handleUpload}
              />
            )
          );


        return (
            <div>
                <div style={Positioner}>
                <button className="savebutton" onClick={this.handleInsert}>S&nbsp;&nbsp;A&nbsp;&nbsp;V&nbsp;&nbsp;E</button>
                    <div style={ShadowedBox} className="ShadowedBox card-2">
                        <div style={Contents}>
                            { quizView }
                        </div>
                    </div>
                    <div style={Contents2}>
                        { quizcontentList }
                    </div>
                </div>
                <div style={Positioner2}>
                    <div onClick={this.handleCreate}> { buttonView } </div>
                    <br/>
                    <div onClick={this.turnBool}>
                        <i className="material-icons" style={{color:'gray', fontSize:'40px'}}>library_add</i>
                    </div>
                </div>
            </div>
        );
    }
}



decorate(NewPackage, {
    packagetitle : observable,
    packagecontent : observable,
    packagenum : observable,
    quizlist : observable,
    quiz : observable,
    uploadQuiz : observable,
    answer : observable,
    AorB : observable,
    bool : observable,
    quiznumber : observable,

    quizInsert : action,
    turnBool : action,
    selectChange : action,
    handleUpload : action,
    handleInsert : action
  })

 
export default observer(NewPackage);