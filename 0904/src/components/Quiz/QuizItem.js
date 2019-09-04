import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import OptionItem from './OptionItem';
import axios from 'axios';
import update from 'react-addons-update';
import { decorate, observable, action } from 'mobx';
import {observer} from "mobx-react"

const Wrapper = {
    marginTop: '1rem'
}

// 너비, 그림자 설정
const ShadowedBox = {
    background: 'white',
    marginTop: '0.1rem'
}

const ShadowedBox2 = {
    background: 'white'
}

// 로고
const LogoWrapper = {
    background: 'gray',
    height: '0.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const LogoWrapper2 = {
    background: 'gray',
    height: '0.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

// children 이 들어가는 곳
const Contents = {
    background: 'white',
    padding: '2rem',
    height: 'auto'
}

const ButtonStyle = {
    cursor: 'pointer',
    display: 'inline',
    color:'rgb(255, 106, 106)'
}

const ButtonStyle2 = {
    cursor: 'pointer',
    color:'red', 
    fontSize:'30px', 
    right:'5px', 
    position:'absolute',
    marginTop:'5px'
}

class QuizItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            option : []
        };

        this.num = 0;
        this.numnum = 0;

        this.number = this.props.num;
        this.quiztitle = '';
        this.value = '';
        this.quizoption = [];
        this.dbNum = null;
        this.score = 1;
        this.option = [];
        this.level = 'level'

        this.quizDelete = this.quizDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handledelete = this.handledelete.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.handleoptionChange = this.handleoptionChange.bind(this);
        this.handleoptionChange_read = this.handleoptionChange_read.bind(this);

    }
    
    componentDidMount(){
        if(this.props.mode=='write'||this.props.mode=='read'){
            this.dbNum = this.props.content;
            const quiznum = this.props.content;
            axios.post('/api/board/quizSelect', {quiznum})
            .then((response) => {
                this.quiztitle= response.data.quiz[0].quizname;
                this.quizoption= response.data.quiz[0].optionlist.split(',');
                this.value = response.data.quiz[0].tag;
                this.answer = response.data.quiz[0].answer.split('');
                this.score = response.data.quiz[0].score;
                this.level = response.data.quiz[0].level;
                for(var i=0; i<this.quizoption.length; i++){
                    var answerCheck = false;
                    for(var j=0; j<this.answer.length; j++){
                        if( this.num.toString() === this.answer[j] ) {
                            answerCheck = true;
                            break;   
                        }
                    }
                    if(this.props.mode=='write'){
                        this.setState({
                            option : this.state.option.concat({
                                num: this.num++,
                                content: this.quizoption[i],
                                check: answerCheck
                                })
                        });
                    }else if(this.props.mode=='read'){
                        this.setState({
                            option : this.state.option.concat({
                                num: this.num++,
                                content: this.quizoption[i],
                                realAnswer: answerCheck,
                                check: false
                                })
                        });
                    }
                    
                }
            })
            .catch((err)=>{
                console.log('Error fetching quizSelect',err);
            });
        }
    }

    componentDidUpdate(){
        if(this.props.mode=='new'){
            const { onUpload } = this.props;
            onUpload(this.dbNum, this.number, this.quiztitle, this.state.option, this.value, this.score, this.level);
        }else if(this.props.mode=='read'){
            const { onSubmit } = this.props;
            onSubmit(this.dbNum, this.number, this.state.option, this.score);
        }
    }

    handleChange(e){
        this[e.target.name] = e.target.value;
    }

    handleCreate(){
        this.setState({
            option : this.state.option.concat({
                num: this.num++,
                content: '',
                check: false
            })
        });
        this.numnum++;
    }

    handledelete(number){
        if(this.numnum>0){
            this.numnum--;
        }

        console.log(number);

        this.setState({
            option: this.state.option.filter(info => info.num !== number)
          })

    }
    
    handleoptionChange(number, optioncontent, check) {
        this.setState({
            option : this.state.option.map(
                info => number === info.num
                ? {
                    num: number,
                    content: optioncontent,
                    check: check
                    }
                : info
              )
        });
    }

    handleoptionChange_read(num, check){
        this.setState({
            option : update(
                this.state.option,
                {
                    [num] : {
                        check: {$set: check}
                    }
                }
            )
        });
    }

    selectChange(e) {
        this.value = e.target.value;
    }

    quizDelete() {
    }

    render() {

        const NewContentView = (
            <div>
                <div>
                    <input name="quiztitle" placeholder="질문" type="text" style={{fontSize:'17px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.quiztitle}
                    />
                    <div className="optionStyle">
                        <label htmlFor="select1" className="optionStyle" style={{fontSize:'20px', color:'darkGray'}}><b>#</b></label>
                        <input type="text" placeholder=" '#tag' 형식으로 입력하세요" name="value" value={this.value} onChange={this.handleChange} className="optionStyle"
                        style={{fontSize:'12px', width:'70%', color:'gray', placeholder:'gray'}}/>
                    </div> &nbsp;&nbsp;
                    <select className="optionStyle" style={{width:'21%', fontSize:'12px'}} name='level' value={this.level} onChange={this.handleChange}>
                        <option value="level">난이도</option>
                        <option value="high">&nbsp;&nbsp;상</option>
                        <option value="middle">&nbsp;&nbsp;중</option>
                        <option value="low">&nbsp;&nbsp;하</option>
                    </select>
                </div>
            </div>
        );


        const WriteContentView = (
            <div>
                <div>
                    <input name="quiztitle" placeholder="질문" type="text" style={{fontSize:'17px', color:'gray', placeholder:'gray'}}
                    onChange={this.handleChange}
                    value={this.quiztitle} disabled
                    />
                    <div className="optionStyle">
                        <label htmlFor="select1" className="optionStyle" style={{fontSize:'20px', color:'darkGray'}}><b>#</b></label>
                        <input type="text" placeholder=" '#tag' 형식으로 입력하세요" name="value" value={this.value} onChange={this.handleChange} className="optionStyle"
                        style={{fontSize:'12px', width:'70%', color:'gray', placeholder:'gray'}} disabled/>
                    </div> &nbsp;&nbsp;
                    <select className="optionStyle"style={{width:'21%', fontSize:'12px'}} name='level' value={this.level} disabled>
                        <option value="level">난이도</option>
                        <option value="high">&nbsp;&nbsp;상</option>
                        <option value="middle">&nbsp;&nbsp;중</option>
                        <option value="low">&nbsp;&nbsp;하</option>
                    </select>
                </div>
            </div>
        );

        const buttonView = (
                <span style={Wrapper}>
                    <i className="material-icons optionStyle" style={ButtonStyle}>radio_button_unchecked</i>
                    &nbsp;&nbsp;
                    <input type="text" style={{fontSize:'12px', width:'50%', color:'rgb(255, 106, 106)', borderColor:'rgb(255, 106, 106)', cursor: 'pointer'}}
                        value='옵션 추가'
                        className="optionStyle"
                        disabled/> 
                    &nbsp;
                </span>
        );

        const newoptionList = this.state.option.map(
            data => (
              <OptionItem
                num={data.num}
                mode='new'
                content={data.content}
                check={data.check}
                key={data.num}
                onDelete={this.handledelete}
                onoptionChange={this.handleoptionChange}
              />
            )
          );

        const writeoptionList = this.state.option.map(
            data => (
              <OptionItem
                num={data.num}
                mode='write'
                content={data.content}
                check={data.check}
                key={data.num}
                onDelete={this.handledelete}
                onoptionChange={this.handleoptionChange}
              />
            )
          );

        const readoptionList = this.state.option.map(
            data => (
              <OptionItem
                num={data.num}
                mode='read'
                content={data.content}
                check={data.check}
                key={data.num}
                onoptionChange_read={this.handleoptionChange_read}
              />
            )
          );

          
        const newView = (
            <div style={ShadowedBox} className="ShadowedBox card-2">
                   <div style={LogoWrapper}></div>
                    <div style={Contents}>
                                { NewContentView }
                                { newoptionList }
                                <div style={{marginTop: '1.5rem'}}>
                                    <span onClick={this.handleCreate}> 
                                        { this.numnum <= 10 ? buttonView : null } 
                                    </span>
                                    <span style={{color:'gray', marginLeft:'15%', fontSize:'12px'}} >
                                        <b>점수</b>&nbsp;&nbsp;&nbsp;
                                        <input type="number" min="1" max="10" step="1" className="optionStyle" style={{width:'8%', fontSize:'12px'}}
                                            name="score" value={this.score}
                                            onChange={this.handleChange}/>
                                    </span>
                                </div>
                            </div>
                        </div>
        );

        const writeView = (
            <div style={ShadowedBox} className="ShadowedBox card-2">
                   <div style={LogoWrapper}></div>
                    <div style={Contents}>
                                { WriteContentView }
                                { writeoptionList }
                                <div style={{marginTop: '1.5rem'}}>
                                    <span style={{color:'gray', marginLeft:'15%', fontSize:'12px'}} >
                                        <b>점수</b>&nbsp;&nbsp;&nbsp;
                                        <input type="number" min="1" max="10" step="1" className="optionStyle" style={{width:'8%', fontSize:'12px', color:'gray'}}
                                            name="score" value={this.score} disabled/>
                                    </span>
                                </div>
                            </div>
                        </div>
        );

        const readView = (
            <div style={ShadowedBox2} className="ShadowedBox card-3">
                   <div style={LogoWrapper2}></div>
                    <div style={Contents}>
                        <div>
                            <div name="quiztitle" style={{fontSize:'17px', width:'70%', color:'gray'}}
                            className="optionStyle">{this.quiztitle}</div>
                        </div>
                        { readoptionList }
                    </div>
                </div>
        );
        return (
            <div>
                { this.props.mode == 'new' && newView }
                { this.props.mode == 'write' && writeView }
                { this.props.mode == 'read' && readView }
            </div>
        );
    }
}

decorate(QuizItem, {
    num : observable,
    numnum : observable,
    quizoption : observable,
    number : observable,
    quiztitle : observable,
    value : observable,
    quizoption: observable,
    dbNum : observable,
    score : observable,
    level : observable,

    handleCreate : action,
    handleoptionChange : action,
    handleoptionChange_read : action
  })

export default observer(QuizItem);