import { combineReducers } from 'redux';
import loginReducer from './LoginReducer'

const allReducers = {
    loginState: loginReducer
}

const rootReducer=combineReducers(allReducers);

export default rootReducer;