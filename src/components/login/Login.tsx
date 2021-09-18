import {Form, Input, Button, Checkbox, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import React from 'react';
import './Login.less'
import {UserInfo, userLogin} from "../../actions/LoginAction";
import history from '../../utils/history';
import {LoginParamsType, LoginService} from "../../services/LoginService";
import {connect} from "react-redux";
import { JSEncrypt } from 'jsencrypt'
import {RSA_PUBLIC_KEY} from "@/constants";


class LoginComponent extends React.Component<any, any> {
    loginService = new LoginService();
    onFinish = (values) => {
        //登录
        // @ts-ignore
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(RSA_PUBLIC_KEY);
        values.password = encrypt.encrypt(values.password);
        let params: LoginParamsType = {
            username: values.username,
            password: values.password
        };
        this.loginService.login(params, (res) => {
            if (res.code === 100) {
                const userID = res.data['user-id'];
                const userName = res.data['user-name'];
                const userInfo: UserInfo = {
                    userName,
                    userID,
                };
                this.props.userLogin(userInfo);
                history.push('/admin');
            } else {
                message.warning(res.message)
            }
        }, (error) => {
            message.error(error)
            history.push('/login');
        })
    };

    render() {
        return <div className="login_module">
            <div className="login_area">
                <div className="login_area_form">
                    <Form
                        name="normal_login"
                        initialValues={{remember: true}}
                        onFinish={this.onFinish}
                        className={"login-form"}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: '请输入账号！'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="账号"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>;
    }

}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})


const mapDispatchToProps = (dispatch: any) => ({
    userLogin: (userInfo: UserInfo) => dispatch(userLogin(userInfo)),
})
export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);


