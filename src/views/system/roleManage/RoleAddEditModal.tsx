import React from "react";
import "@/assets/styles/public.less"
import {Button, Col, Form, FormInstance, Input, Modal, Row, Select, Spin, Switch, TreeSelect} from "antd";
import {DictRadio} from "@/components/public/dictSelect/DictRadio";

interface RoleAddModalProps {
    type: 'ADD' | 'EDIT',
    roleInfo?: object,
    loading: boolean,
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
}

export default class RoleAddEditModal extends React.Component<RoleAddModalProps> {

    state = {
    }

    //表单实例的引用
    formRef = React.createRef<FormInstance>();

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

    render() {
        const {visible, loading, type, roleInfo} = this.props;
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
        return (
            <Modal
                visible={visible}
                title={type == 'ADD' ? "新增角色" : "修改用户"}
                onOk={this.handleSave}
                onCancel={this.handleCancel}
                width={600}
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
                          initialValues={type == 'ADD' ? {enabled: false} : roleInfo}
                    >
                        <Row gutter={24}>
                            <Col span={16} key={"roleID"}>
                                <Form.Item hidden={true}
                                           label={`角色ID`}
                                           name="roleID"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"name"}>
                                <Form.Item
                                    label={`角色名称`}
                                    name="name"
                                    rules={[{required: true, message: '请输入角色名称'}]}
                                >
                                    <Input placeholder="请输入角色名称"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"description"}>
                                <Form.Item
                                    name="description"
                                    label={`描述`}
                                    rules={[]}
                                >
                                    <Input placeholder="请输入描述信息"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"enabled"}>
                                <Form.Item
                                    name="enabled"
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