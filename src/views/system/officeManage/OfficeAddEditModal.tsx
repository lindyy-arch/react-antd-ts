import React from "react";
import "@/assets/styles/public.less"
import {
    Button,
    Col,
    Form,
    FormInstance,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Spin,
    Switch,
    TreeSelect
} from "antd";
import {OfficeService} from "@/services/OfficeService";
import {DictRadio} from "@/components/public/dictSelect/DictRadio";

interface OfficeAddModalProps {
    type: 'ADD' | 'EDIT',
    officeInfo?: object,
    officeTreeData: any[],
    loading: boolean,
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
}

export default class OfficeAddEditModal extends React.Component<OfficeAddModalProps> {
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
        const {visible, loading, type, officeInfo,officeTreeData} = this.props;
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
                title={type == 'ADD' ? "新增机构" : "修改机构"}
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
                          initialValues={type == 'ADD' ? {enabled: "1"} : officeInfo}
                    >
                        <Row gutter={24}>
                            <Col span={16} key={"officeID"}>
                                <Form.Item hidden={true}
                                           label={`机构ID`}
                                           name="officeID"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"name"}>
                                <Form.Item
                                    label={`机构名称`}
                                    name="name"
                                    rules={[{required: true, message: '请输入机构名称'}]}
                                >
                                    <Input placeholder="请输入机构名称"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"pid"}>
                                <Form.Item
                                    label={`父级机构`}
                                    name="pid"
                                    rules={[]}
                                >
                                    <TreeSelect
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={officeTreeData}
                                        placeholder="请选择父级机构"
                                        treeDefaultExpandAll
                                        allowClear={true}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={16} key={"officeSort"}>
                                <Form.Item
                                    name="officeSort"
                                    label={`排序序号`}
                                    rules={[]}
                                >
                                    <InputNumber min={0} max={10000} placeholder="序号"/>
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