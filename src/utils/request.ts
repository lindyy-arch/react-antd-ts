import axios, {AxiosRequestConfig, AxiosResponse, AxiosPromise} from 'axios'
import {message} from "antd";
import history from "@/utils/history";

axios.defaults.validateStatus = function (status) {
    return status < 400
};

// 设置全局超时时间为60min
axios.defaults.timeout = 1000 * 60 * 60;

function parseJSON(response: AxiosResponse) {
    return response.data
}

function refreshToken(response: AxiosResponse) {
    const token = response.data && response.data.data ? response.data.data['x-auth-token'] : null;
    if (token) {
        setToken(token)
    }
    return response
}

export function request(config: AxiosRequestConfig): AxiosPromise
export function request(url: string, options?: AxiosRequestConfig): AxiosPromise

export default function request(url: any, options?: AxiosRequestConfig): AxiosPromise {
    const token = localStorage.getItem('TOKEN');
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = `${token}`
    }
    return axios(url, options)
        .then(refreshToken)
        .then(parseJSON)
        .catch(errorHandler)
}

export function setToken(token: string) {
    window.addEventListener('storage', syncToken, false);
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('TOKEN_EXPIRE', `${new Date().getTime() + 3600000}`);
}

function syncToken(e: StorageEvent) {
    const {key, newValue} = e;
    if (key !== 'TOKEN') {
        return
    }
    if (!newValue) {
        delete axios.defaults.headers.common['x-auth-token']
    } else {
        axios.defaults.headers.common['x-auth-token'] = `${newValue}`
    }
}

export function removeToken() {
    window.addEventListener('storage', syncToken);
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('TOKEN_EXPIRE');
    delete axios.defaults.headers.common['x-auth-token'];
}

export function checkToken() {
    return localStorage.getItem("TOKEN") ? true : false;
}

export function getToken() {
    return axios.defaults.headers.common['x-auth-token']
}

export function errorHandler(error) {
    if (error.response) {
        switch (error.response.status) {
            case 403:
                message.error('未登录或会话过期，请重新登录', 1);
                removeToken();
                localStorage.removeItem('userInfo');
                history.push('/login')
                break;
            case 401:
                message.error('您没有权限访问');
                removeToken();
                localStorage.removeItem('userInfo');
                history.push('/login');
                break;
            default:
                message.error(
                    error.response.data.header
                        ? error.response.data.header.msg
                        : error.message,
                    3
                );
                break
        }
    } else if (error.message) {
        message.error(error.message, 3);
    }
}
