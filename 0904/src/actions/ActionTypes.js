/* 
 Action의 종류들을 선언합니다.
 앞에 export를 붙이면 나중에 이것들을 불러올 때, 
 import * as types from './ActionTypes'를 할 수 있어요.
*/

/* AUTHENTICATION */
// Register
export const AUTH_REGISTER = "AUTH_REGISTER";
export const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS";
export const AUTH_REGISTER_FAILURE = "AUTH_REGISTER_FAILURE";

// Login
export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";

// Check sessions
export const AUTH_GET_STATUS = "AUTH_GET_STATUS";
export const AUTH_GET_STATUS_SUCCESS = "AUTH_GET_STATUS_SUCCESS";
export const AUTH_GET_STATUS_FAILURE = "AUTH_GET_STATUS_FAILURE";

// Logout
export const AUTH_LOGOUT = "AUTH_LOGOUT";

// Mail Check
export const AUTH_CHECK_MAIL = "AUTH_CHECK_MAIL";
export const AUTH_CHECK_MAIL_SUCCESS = "AUTH_CHECK_MAIL_SUCCESS";
export const AUTH_CHECK_MAIL_FAILURE = "AUTH_CHECK_MAIL_FAILURE";

// package READ
export const PACKAGE_READ = "PACKAGE_READ";
export const PACKAGE_READ_SUCCESS = "PACKAGE_READ_SUCCESS";
export const PACKAGE_READ_FAILURE = "PACKAGE_READ_FAILURE";

// Package list
export const PACKAGE_LIST = "PACKAGE_LIST";
export const PACKAGE_LIST_SUCCESS = "PACKAGE_LIST_SUCCESS";
export const PACKAGE_LIST_FAILURE = "PACKAGE_LIST_FAILURE";


export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const SET_COLOR = 'SET_COLOR';

export const CREATE = 'CREATE';
export const REMOVE = 'REMOVE';
