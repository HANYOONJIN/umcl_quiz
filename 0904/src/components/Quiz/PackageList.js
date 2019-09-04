import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PackageItem from './PackageItem';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import axios from 'axios';
import update from 'react-addons-update';

class PackageList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            packageListData: [],
            packageData: [],
            Alldata: [],
            loginData: {}
        };

        this.type = this.type.bind(this);
        this.getPackageList = this.getPackageList.bind(this);
        this.mine = this.mine.bind(this);
        this.another = this.another.bind(this);
        this.exist = this.exist.bind(this);
        this.noneExist = this.noneExist.bind(this);
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
            this.getPackageList();
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

    getPackageList() {
        axios.get('/api/board/packageList')
		.then((response) => {
            this.setState({
                packageListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        title: info.title,
                        content: info.content,
                        id: info.id 
                    })
                )
            });
		})
		.catch((err)=>{
			console.log('Error fetching packageList',err);
        });
    }

    mine(id) {
        axios.post('/api/board/mine', {id})
		.then((response) => {
            this.setState({
                packageListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        title: info.title,
                        content: info.content,
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
        axios.post('/api/board/another', {id})
		.then((response) => {
            this.setState({
                packageListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        title: info.title,
                        content: info.content,
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
        axios.post('/api/board/exist', {id})
		.then((response) => {
            this.setState({
                packageListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        title: info.title,
                        content: info.content,
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
        axios.post('/api/board/noneExist', {id})
		.then((response) => {
            this.setState({
                packageListData : response.data.data.map(
                    info => ({
                        num: info.num,
                        title: info.title,
                        content: info.content,
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
        const View = this.state.packageListData.map(data => {
            return <PackageItem num={data.num}
                        packageName={data.title}
                        content={data.content}
                        key={data.num}
                        id={data.id}
                        loginId={this.state.loginData._id}/>
          });

        const bar = (
            <div className="header-wrap">
                <button className="singlebutton6" style={{right:'10px', position:'fixed'}} onClick={this.props.newlink}>CREATE</button>
            </div>
        );

        return (
            <div style={{marginTop:'30px'}}>
                <div style={{width:'84%', marginLeft:'8%'}}>{View}</div>
                {bar}
            </div>
        );
    }
}

PackageList.propTypes = {
    newlink: PropTypes.func
};
 
PackageList.defaultProps = {
    newlink: () => { console.error("newlink function not defined"); }
};

export default PackageList;