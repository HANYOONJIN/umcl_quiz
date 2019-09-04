import React from 'react';
import { Link } from 'react-router-dom';
import { decorate, observable, action } from 'mobx';
import PropTypes from 'prop-types';
import {observer} from "mobx-react"
import axios from 'axios';


const Title = {
    fontSize: '1.3rem',
    color: '#4b4b4b',
    paddingTop:'18px',
    paddingBottom: '8px',
    background: 'white',
    textAlign: 'center'
}

const Wrapper = {
    marginTop: '1rem',
    width: '150px',
    height: '150px',
    background: 'white'
}

const Label = {
    fontSize: '1rem',
    color: 'gray',
    marginBottom: '0.25rem',
    textAlign: 'center'
}

class PackageItem extends React.Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        let link_write = '/quiz/writepackage/'+this.props.num;
        let link_read = '/quiz/readpackage/'+this.props.num;

            const packageView = (
                <div>
                    <div style={Wrapper} className="card-1">
                        <div style={Title}>{this.props.packageName}</div>
                        <div style={{textAlign:'center'}}>
                            <i className="material-icons" style={{color:'#a4a4a4', fontSize:'60px'}}>format_list_numbered</i>
                        </div>
                        <div style={Label}>{this.props.content.length >= 10 ? this.props.content.slice(0,8)+'...' : this.props.content}</div>
                    </div>
                </div>
            );

        return (
            <div className="grid4 col" style={{background:'white'}}>
                <Link to={ this.props.id == this.props.loginId ? link_write : link_read }>
                    {packageView}
                </Link>
            </div>
        );
    }
}

export default observer(PackageItem);