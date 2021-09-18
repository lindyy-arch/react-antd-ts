import request from '@/utils/request';
import {PageInfo} from "@/base/base";

export const SSO_USER_LIST_URL = '/admin/user/list';
export const SSO_USER_UPSERT_URL = '/admin/user/upsert';
export const SSO_USER_DELETE_URL = '/admin/user/delete';


export interface QueryUserInfoDto extends PageInfo {
    officeID?: string;
    nickName?: string;
    username?: string;
}

export interface AddEditUserDto {
    id?: string;
    username: string;
    email?: string;
    enable: number;
    gender?: string;
    nickName: string;
    phone?: string;
    officeID: string;
}
export interface DeleteDto {
    ids: string[];
}

export class UserService {

    qryUserList(reqBody: QueryUserInfoDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(SSO_USER_LIST_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    upsertUser(reqBody: AddEditUserDto, callback: (res: any) => void, errCallback: (error: any) => void){
        request(SSO_USER_UPSERT_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    deleteUser(ids, callback: (res: any) => void, errCallback: (error: any) => void){
        request(SSO_USER_DELETE_URL, {
            method: 'POST',
            data: ids
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }
}

