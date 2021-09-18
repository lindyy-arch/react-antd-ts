import {USERLOGIN} from "../constants";

export interface UserInfo {
    userID: string;
    userName: string;
    userImage?: string;
    permissions?: string[];
}
export interface LoginAction {
    type: USERLOGIN;
    userInfo: UserInfo;
}
export const userLogin = (userInfo: UserInfo): LoginAction => ({
    type: USERLOGIN,
    userInfo,
})
