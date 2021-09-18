import request from '@/utils/request';

export const ADMIN_OFFICE_BUILD_URL = '/admin/dict/qryDictByNames';

export class DictService {

    qryDictByNames(dictName: string, callback: (res: any) => void, errCallback: (error: any) => void) {
        request(ADMIN_OFFICE_BUILD_URL + "?dictName=" + dictName, {
            method: 'GET'
        }).then(res => {
            callback(res)
        }).catch(error => {
            errCallback(error)
        });
    }
}

