import request from '@/utils/request';

export const ADMIN_OFFICE_BUILD_URL = '/admin/office/build';
export const ADMIN_OFFICE_QRYLIST_URL = '/admin/office/qryList';
export const ADMIN_OFFICE_UPSERT_URL = '/admin/office/upsert';
export const ADMIN_OFFICE_DELETE_URL = '/admin/office/delete';

export interface QryOfficeListDto {
    name: string;
}

export interface DeleteDto {
    ids?: string[];
    id?: string;
}

export interface AddEditOfficeDto {
    officeID: string;
    pid: string;
    name: string;
    enabled: number;
    officeSort: number;
}

export class OfficeService {

    buildOfficeTree(callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_OFFICE_BUILD_URL, {
            method: 'GET'
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    qryOfficeList(reqBody: QryOfficeListDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_OFFICE_QRYLIST_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    upsertOffice(reqBody: AddEditOfficeDto, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_OFFICE_UPSERT_URL, {
            method: 'POST',
            data: reqBody
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }

    deleteOffice(id, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_OFFICE_DELETE_URL, {
            method: 'POST',
            params: {id}
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }
}
