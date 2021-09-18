import request from '@/utils/request';

export const ADMIN_LOGIN_URL = '/admin/user/login';
export const ADMIN_LOGOUT_URL = '/admin/user/logout';

export interface LoginParamsType {
  username: string;
  password: string;
};

export class LoginService {

  login(params: LoginParamsType, callback: (res: any) => void, errCallback: (error: any) => void) {
    request(ADMIN_LOGIN_URL, {
      method: 'POST',
      params,
    }).then(res => {
      callback(res)
    }).catch(error => {
      errCallback(error)
    });
  }

  logout(callback: (res: any) => void, errCallback: (error: any) => void) {
    request(ADMIN_LOGOUT_URL, {
      method: 'GET'
    }).then(res => {
      callback(res)
    }).catch(error => {
      errCallback(error)
    });
  }
}

