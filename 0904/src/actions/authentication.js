import axios from 'axios';
import {
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT,
    AUTH_CHECK_MAIL,
    AUTH_CHECK_MAIL_SUCCESS,
    AUTH_CHECK_MAIL_FAILURE
} from './ActionTypes';
 
/* REGISTER */
export function registerRequest(username, password) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(register());
 
        return axios.post('/api/auth/new', { username, password })
        .then((response) => {
            dispatch(registerSuccess());
        }).catch((error) => {
            dispatch(registerFailure(error.response.data.code));
        });
    };
}
 
export function register() {
    return {
        type: AUTH_REGISTER
    };
}
 
export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}
 
export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

/* LOGIN */
export function loginRequest(username, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());
   
        // API REQUEST
        return axios.post('/api/auth/login', { username, password })
        .then((response) => {
            // SUCCEED
            dispatch(loginSuccess(username, response.data.id));
            let id = response.data.id;
            return id;
        }).catch((error) => {
            // FAILED
            dispatch(loginFailure());
        });
    };
  }
   
  export function login() {
      return {
          type: AUTH_LOGIN
      };
  }
   
  export function loginSuccess(username, id) {
      return {
          type: AUTH_LOGIN_SUCCESS,
          username,
          id
      };
  }
   
  export function loginFailure() {
      return {
          type: AUTH_LOGIN_FAILURE
      };
  }


  /* GET STATUS */
export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());
 
        return axios.get('/api/auth/getInfo')
        .then((response) => {
            dispatch(getStatusSuccess(response.data.info.username, response.data.info._id)); //HTTP 틍신을 통해 username을 빋이옴
        }).catch((error) => {
            dispatch(getStatusFailure());
        });
    };
}
 
export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}
 
export function getStatusSuccess(username, _id) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username,
        _id
    };
}
 
export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

/* Logout */
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/auth/logout')
        .then((response) => {
            dispatch(logout());
        });
    };
}
 
export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}



/* CHECK */

export function checkRequest(email, number) {
    return (dispatch) => {
        dispatch(checkMail());
           return axios.post('/api/auth/mailcheck', { email, number })
        .then((response) => {
            dispatch(checkMailSuccess());
        }).catch((error) => {
            dispatch(checkMailFailure());
        });
    };
  }

export function checkMail() {
    return {
        type: AUTH_CHECK_MAIL
    };
}

export function checkMailSuccess() {
    return {
        type: AUTH_CHECK_MAIL_SUCCESS
    };
}

export function checkMailFailure() {
    return {
        type: AUTH_CHECK_MAIL_FAILURE
    };
}