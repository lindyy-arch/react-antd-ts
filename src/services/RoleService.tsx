import request from '@/utils/request';
import {PageInfo} from "@/base/base";

export const ADMIN_ROLE_LIST_URL = '/admin/role/list';
export const ADMIN_ROLE_UPSERT_URL = '/admin/role/upsert';
export const ADMIN_ROLE_DELETE_URL = '/admin/role/delete';
export const ADMIN_ROLE_QRYALL_URL = '/admin/role/qryAll';


export interface QueryRoleInfoDto extends PageInfo {
    roleID?: string;
    enabled?: boolean;
}

export interface AddEditRoleDto {
    name?: string;
    description: string;
    enabled?: string;
}
export interface DeleteDto {
    ids: string[];
}

export class RoleService {

    qryRoleList(reqBody: QueryRoleInfoDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_ROLE_LIST_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    upsertRole(reqBody: AddEditRoleDto, callback: (res: any) => void, errCallback: (error: any) => void){
        request(ADMIN_ROLE_UPSERT_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    deleteRole(reqBody: DeleteDto, callback: (res: any) => void, errCallback: (error: any) => void){
        request(ADMIN_ROLE_DELETE_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    qryAllRoles(callback: (res: any) => void, errCallback: (error: any) => void){
        request(ADMIN_ROLE_QRYALL_URL, {
            method: 'GET',
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }
}

