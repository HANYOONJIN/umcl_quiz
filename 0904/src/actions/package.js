import axios from 'axios';
import {
    PACKAGE_LIST,
    PACKAGE_LIST_SUCCESS,
    PACKAGE_LIST_FAILURE,
    PACKAGE_READ,
    PACKAGE_READ_SUCCESS,
    PACKAGE_READ_FAILURE
} from './ActionTypes';
 
export function pacakageReadRequest() {
    console.log('fsdfdsfsdfsd');
    return (dispatch) => {
        dispatch(pacakageRead()); 
        return axios.get('/api/board/package')
        .then((response) => {
            dispatch(pacakageReadSuccess(response.data));
        }).catch((error) => {
            dispatch(pacakageReadFailure());
        });
    };
}
 
export function pacakageRead() {
    return {
        type: PACKAGE_READ
    };
}
 
export function pacakageReadSuccess(data) {
    return {
        type: PACKAGE_READ_SUCCESS,
        data
    };
}
 
export function pacakageReadFailure() {
    return {
        type: PACKAGE_READ_FAILURE
    };
}

//////////////////////////////////////////////

export function packageRequest(pname, content, loginData) {
    console.log("action에"+loginData);
    return (dispatch) => {
        dispatch(packageList());
           return axios.post('/api/board/packageInsert', { pname, content, loginData })
        .then((response) => {
            dispatch(packageListSuccess());
            return response.data.num;
        }).catch((error) => {
            dispatch(packageListFailure());
        });
    };
  }

export function packageList() {
    return {
        type: PACKAGE_LIST
    };
}

export function packageListSuccess() {
    return {
        type: PACKAGE_LIST_SUCCESS
    };
}

export function packageListFailure() {
    return {
        type: PACKAGE_LIST_FAILURE
    };
}

///////////////////////

export function quizInsertRequest(title, option, val) {
    return (dispatch) => {
        return axios.post('/api/board/quizInsert',{title, option, val})
        .then((response) => {
            return response.data.num;
        }).catch((error) => {
            dispatch(pacakageReadFailure());
        });
    };
}