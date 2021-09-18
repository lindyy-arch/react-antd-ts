import React from "react";
import "@/assets/styles/public.less"
import {Button, Col, Form, FormInstance, Input, message, Modal, Row, Select, Spin, Switch, TreeSelect} from "antd";
import {RoleService} from "@/services/RoleService";
import {DictRadio} from "@/components/public/dictSelect/DictRadio";

const {Option} = Select;

interface UserAddModalProps {
    type: 'ADD' | 'EDIT',
    userInfo?: any,
    officeTreeData: any[],
    loading: boolean,
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
    allRoles?: any[],
}

export default class UserAddEditModal extends React.Component<UserAddModalProps> {
    roleService = new RoleService();
    state = {
        isShowOfficeModal: false,
        options: []
    }

    //表单实例的引用
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        if(this.props.allRoles){
            const options = [];
            this.props.allRoles.forEach( item => {
                options.push(<Option key={item.key} value={item.key}>{item.value}</Option>);
            })
            this.setState({options});
        }
    }

    handleSave = () => {
        this.formRef.current.validateFields().then(values => {
            this.props.handleOk(values);
        }).catch(errorInfo => {
            console.log(errorInfo);
        });
    }
    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.handleCancel();
    }

    searchOfficeClick = () => {
        this.setState({isShowOfficeModal: true});

    }

    onTreeSelectChange = (value) => {
        console.log(123,value)
    }

    render() {
        const {visible, loading, type, userInfo,officeTreeData} = this.props;
        const {options} = this.state
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const selectProps = {
            mode: 'multiple' as const,
            style: { width: '100%' }, eholder: 'Select Item...',
            maxTagCount: 'responsive' as const,
        };

        return (
            <Modal
                visible={visible}
                title={type == 'ADD' ? "新增用户" : "修改用户"}
                onOk={this.handleSave}
                onCancel={this.handleCancel}
                width={800}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleSave}>
                        保存
                    </Button>,
                ]}
            >
                <Spin spinning={loading}>
                    <Form {...formItemLayout}
                          className={"base-form-body"}
                          ref={this.formRef}
                          initialValues={type == 'ADD' ? {enabled: false} : userInfo}
                    >
                        <Row gutter={24}>
                            <Col span={12} key={"id"}>
                                <Form.Item hidden={true}
                                           name="id"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"username"}>
                                <Form.Item
                                    label={`用户名`}
                                    name="username"
                                    rules={[{required: true, message: '请输入用户名'}]}
                                >
                                    <Input placeholder="请输入用户名" disabled={type == 'EDIT'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12} key={"nickName"}>
                                <Form.Item
                                    name="nickName"
                                    label={`姓名`}
                                    rules={[{required: true, message: '请输入姓名'}]}
                                >
                                    <Input placeholder="请输入姓名"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"phone"}>
                                <Form.Item
                                    label={`手机号码`}
                                    name="phone"
                                    rules={[]}
                                >
                                    <Input placeholder="请输入手机号码"/>
                                </Form.Item>
                            </Col>
                            <Col span={12} key={"email"}>
                                <Form.Item
                                    label={`邮箱`}
                                    name="email"
                                    rules={[]}
                                >
                                    <Input placeholder="请输入邮箱地址"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"officeID"}>
                                <Form.Item
                                    name={`officeID`}
                                    label={`机构`}
                                    rules={[{required: true, message: '请选择机构'}]}
                                >
                                    <TreeSelect
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={officeTreeData}
                                        placeholder="请选择机构"
                                        treeDefaultExpandAll
                                        onChange={this.onTreeSelectChange}
                                        allowClear={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} key={"roleIDs"}>
                                <Form.Item
                                    name={`roleIDs`}
                                    label={`角色`}
                                    rules={[{required: true, message: '请选择角色'}]}
                                >
                                    <Select
                                        {...selectProps}
                                        allowClear
                                        placeholder="请选择角色"
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"gender"}>
                                <Form.Item
                                    label={`性别`}
                                    name="gender"
                                    rules={[{required: true, message: '请选择性别'}]}
                                >
                                    <Select placeholder="请选择性别">
                                        <Option value="1">男</Option>
                                        <Option value="0">女</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"enable"}>
                                <Form.Item
                                    name="enable"
                                    label={`启用`}
                                    rules={[{required: true, message: '请选择是否启用'}]}
                                >
                                    <DictRadio dictName={"enabled"}></DictRadio>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>

            </Modal>
        );
    }
}