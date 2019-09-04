import authentication from './authentication';
import packageList from './packageList';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    packageList
});