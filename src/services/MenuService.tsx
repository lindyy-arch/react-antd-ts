import request from '@/utils/request';
import {PageInfo} from "@/base/base";

export const ADMIN_MENUS_BUILD_URL = '/admin/menus/build';
export const ADMIN_MENUS_TREE_URL = '/admin/menus/menuTree';
export const ADMIN_MENUS_MENUCHECKED_URL = '/admin/menus/menuChecked';
export const ADMIN_MENUS_SAVEROLEMENU_URL = "/admin/menus/saveRoleMenu";
export const ADMIN_MENUS_QRYLIST_URL = "/admin/menus/qryList";
export const ADMIN_MENUS_UPSERT_URL = "/admin/menus/upsert";
export const ADMIN_MENUS_DELETE_URL = "/admin/menus/delete";

export interface GetMenuCheckedDto {
    roleID: string;
}

export interface SaveRoleMenuDto {
    roleID: string;
    menuIDs: string[];
}

export interface AddEditMenuDto {
    menuID: string;
    app: string;
    pid: string;
    type: number;
    title: string;
    menuSort: number;
    icon: string;
    path: string;
    iFrame: boolean;
    hidden: boolean;
    permission: string;
}

export interface QryMenuListDto {
    name: string;
}

export class MenuService {

    buildMenu(callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_MENUS_BUILD_URL, {
            method: 'GET'
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    getMenuTree(callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_MENUS_TREE_URL, {
            method: 'GET'
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    getMenuChecked(reqParam: GetMenuCheckedDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_MENUS_MENUCHECKED_URL, {
            method: 'GET',
            params: reqParam
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    saveRoleMenu(reqBody: SaveRoleMenuDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_MENUS_SAVEROLEMENU_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    qryMenuList(reqBody: QryMenuListDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_MENUS_QRYLIST_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    upsertMenu(reqBody: AddEditMenuDto, callback: (res: any) => void, errCallback: (error: any) => void){
        request(ADMIN_MENUS_UPSERT_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    deleteMenu(id, callback: (res: any) => void, errCallback: (error: any) => void){
        request(ADMIN_MENUS_DELETE_URL, {
            method: 'POST',
            params: {id}
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }
}

