import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { decorate, observable, action } from 'mobx';
import {observer} from "mobx-react"

const Wrapper = {
    marginTop: '1rem'
}


const ButtonStyle = {
    cursor: 'pointer',
    display: 'inline'
}


class OptionItem extends Component {

    constructor(props) {
        super(props);

        this.num = this.props.num;
        this.quizoption = this.props.content;
        this.check = this.props.check;

        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.click = this.click.bind(this);


    }

    componentDidUpdate() {
        if(this.props.mode=='new'){
            const { onoptionChange } = this.props;
            onoptionChange(this.num, this.quizoption, this.check);
        }else if(this.props.mode=='read'){
            const { onoptionChange_read } = this.props;
            onoptionChange_read(this.num, this.check);
        }
    }

    handleChange(e){
        this[e.target.name] = e.target.value;
    }

    handleDelete(){
        const { onDelete } = this.props;
        onDelete(this.num);
    }

    handleAnswer(){
        this.check = !this.check;
    }

    click(){
        console.log(this.props.num);
        console.log(this.props.content);
    }
    
    render() {

        const newoptionView = (
            <div>
                <div style={Wrapper}>
                    <label onClick={this.handleAnswer} style={ButtonStyle} onChange={this.handleChange}>
                        { this.check ? 
                        <i className="material-icons optionStyle" style={{color:'red'}}>check_circle_outline</i>
                        :
                        <i className="material-icons optionStyle" style={{color:'gray'}}>radio_button_unchecked</i>
                        }
                    </label>
                    &nbsp;&nbsp;
                    <input name="quizoption" placeholder="옵션" type="text" style={{fontSize:'12px', width:'70%', color:'gray'}}
                        onChange={this.handleChange}
                        onClick={this.click}
                        value={this.quizoption} 
                        className="optionStyle"/> 
                    &nbsp;&nbsp;&nbsp;
                    <div style={ButtonStyle} onClick={this.handleDelete}><i className="material-icons optionStyle" style={{color:'gray'}}>delete</i></div>
                </div>
            </div>
        );

        const writeoptionView = (
            <div>
                <div style={Wrapper}>
                    <label style={ButtonStyle}>
                        { this.check ? 
                        <i className="material-icons optionStyle" style={{color:'red'}}>check_circle_outline</i>
                        :
                        <i className="material-icons optionStyle" style={{color:'gray'}}>radio_button_unchecked</i>
                        }
                    </label>
                    &nbsp;&nbsp;
                    <input name="quizoption" placeholder="옵션" type="text" style={{fontSize:'12px', width:'70%', color:'gray'}}
                        onChange={this.handleChange}
                        onClick={this.click}
                        value={this.quizoption} 
                        className="optionStyle" disabled/> 
                    &nbsp;&nbsp;&nbsp;
                </div>
            </div>
        );

        const readoptionView = (
            <div>
                <div style={Wrapper}>
                    <label onClick={this.handleAnswer} style={ButtonStyle} onChange={this.handleChange}>
                        { this.check ? 
                        <i className="material-icons optionStyle" style={{color:'red'}}>check_circle_outline</i>
                        :
                        <i className="material-icons optionStyle" style={{color:'gray'}}>radio_button_unchecked</i>
                        }
                    </label>
                    &nbsp;&nbsp;
                    <div id="option1" style={{width:'80%', fontSize:'12px', color:'gray'}} className="optionStyle">
                        {this.quizoption}
                    </div>
                    &nbsp;&nbsp;&nbsp;
                </div>
            </div>
        );

        return (
            <div>
                { this.props.mode == 'new' && newoptionView }
                { this.props.mode == 'write' && writeoptionView }
                { this.props.mode == 'read' && readoptionView }
            </div>
        );
    }
}

OptionItem.propTypes = {
    onDelete: PropTypes.func,
    onoptionChange: PropTypes.func,
    onoptionChange_read: PropTypes.func
};
 
OptionItem.defaultProps = {
    onDelete: (number) => { console.error("Delete function not defined"); },
    onoptionChange: (number) => { console.error("optionChange function not defined"); },
    onoptionChange_read: (number) => { console.error("onoptionChange_read function not defined"); },
};

decorate(OptionItem, {
    num: observable,
    quizoption: observable,
    check: observable,
    handleChange: action,
    handleAnswer: action,
    handleDelete: action,
    click: action
  })

export default observer(OptionItem);