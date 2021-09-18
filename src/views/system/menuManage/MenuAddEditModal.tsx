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
    Spin,
    Switch,
    TreeSelect
} from "antd";
import {MenuService} from "@/services/MenuService";
import {DictRadio} from "@/components/public/dictSelect/DictRadio";

interface MenuAddModalProps {
    type: 'ADD' | 'EDIT',
    menuInfo?: any,
    loading: boolean,
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
}

export default class MenuAddEditModal extends React.Component<MenuAddModalProps> {

    menuService = new MenuService();

    state = {
        menuTreeData: []
    }

    //表单实例的引用
    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        this.qryMenuList({})
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

    //菜单列表查询接口调用
    qryMenuList = (reqBody) => {
        this.menuService.qryMenuList(reqBody, (res) => {
            if (res.code === 100) {
                this.setState({
                    menuTreeData: res.data
                })
            }
        }, (error) => {
            message.error(error);
        })
    }

    render() {
        const {visible, loading, type, menuInfo} = this.props;
        const {menuTreeData} = this.state;
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
                title={type == 'ADD' ? "新增菜单" : "修改菜单"}
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
                          initialValues={type == 'ADD' ? {hidden: false, iFrame: false} : menuInfo}
                    >
                        <Row gutter={24}>
                            <Col span={16} key={"menuID"}>
                                <Form.Item hidden={true}
                                           name="menuID"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"type"}>
                                <Form.Item
                                    name="type"
                                    label={`菜单类型`}
                                    rules={[]}
                                >
                                    <DictRadio dictName={"menuType"}></DictRadio>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"title"}>
                                <Form.Item
                                    label={`菜单标题`}
                                    name="title"
                                    rules={[{required: true, message: '请输入机构名称'}]}
                                >
                                    <Input placeholder="请输入机构名称"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"icon"}>
                                <Form.Item
                                    label={`菜单图标`}
                                    name="icon"
                                    rules={[]}
                                >
                                    <Input placeholder="请输入菜单图标"/>
                                </Form.Item>
                            </Col>
                            <Col span={12} key={"menuSort"}>
                                <Form.Item
                                    name="menuSort"
                                    label={`排序序号`}
                                    rules={[]}
                                >
                                    <InputNumber min={0} max={10000} placeholder="序号"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"pid"}>
                                <Form.Item
                                    name="pid"
                                    label={`父级菜单`}
                                    rules={[]}
                                >
                                    <TreeSelect
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={menuTreeData}
                                        placeholder="请选择父级菜单"
                                        treeDefaultExpandAll
                                        allowClear={true}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"iFrame"}>
                                <Form.Item
                                    name="iFrame"
                                    label={`外链菜单`}
                                    valuePropName="checked"
                                    rules={[{required: true, message: '请选择是否外链菜单'}]}
                                >
                                    <Switch/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"hidden"}>
                                <Form.Item
                                    name="hidden"
                                    label={`隐藏菜单`}
                                    valuePropName="checked"
                                    rules={[{required: true, message: '请选择是否隐藏菜单'}]}
                                >
                                    <Switch/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12} key={"path"}>
                                <Form.Item
                                    label={`菜单路径`}
                                    name="path"
                                    rules={[]}
                                >
                                    <Input placeholder="请输入菜单路径"/>
                                </Form.Item>
                            </Col>
                            <Col span={12} key={"permission"}>
                                <Form.Item
                                    name="permission"
                                    label={`权限标识`}
                                    rules={[]}
                                >
                                    <Input placeholder="请输入权限标识"/>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Spin>
            </Modal>
        );
    }
}