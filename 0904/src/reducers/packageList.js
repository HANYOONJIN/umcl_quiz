import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';
 
const initialState = {
    packageread: {
        status: 'INIT',
        data: []
    },
    packagelist: {
        status: 'INIT'
    }
};
 
export default function packageList(state = initialState, action) {
        switch(action.type) {
            /*
            case types.PACKAGE_READ:
            return update(state, {
                packageread: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1}
                }
            });
            case types.PACKAGE_READ_SUCCESS:
                return update(state, {
                    packageread: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.data }
                    }
                });
            case types.PACKAGE_READ_FAILURE:
                return update(state, {
                    packageread: {
                        status: { $set: 'FAILURE' }
                    }
                });
            /////////////////*/
            case types.PACKAGE_LIST:
                return update(state, {
                    packagelist: {
                        status: { $set: 'WAITING' },
                        error: { $set: -1}
                    }
                });
            case types.PACKAGE_LIST_SUCCESS:
                return update(state, {
                    packagelist: {
                        status: { $set: 'SUCCESS' }
                    }
                });
            case types.PACKAGE_LIST_FAILURE:
                return update(state, {
                    packagelist: {
                        status: { $set: 'FAILURE' }
                    }
                });

            default:
                return state;
    }
  };