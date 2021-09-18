import {LoginAction} from '../actions/LoginAction';
import {USERLOGIN} from "../constants";
let userInfo = localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem('userInfo')):{};
let defaultState = {
    userInfo
}

// 处理并返回 state
export default (state = defaultState, action: LoginAction) => {
    switch (action.type) {
        case USERLOGIN:
            localStorage.setItem("userInfo",JSON.stringify(action.userInfo))
            return {...state, userInfo: action.userInfo}
        default:
            return state
    }
}
