import React from "react";
import {connect} from "react-redux";
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Table,
    Spin,
    Space,
    Tag,
    Popconfirm, message,
} from "antd";
import {SearchBar} from "@/components/public/searchBar/SearchBar";
import {DictSelect} from "@/components/public/dictSelect/DictSelect";
import {MenuService} from "@/services/MenuService";
import * as Icon from "@ant-design/icons";
import MenuAddEditModal from "@/views/system/menuManage/MenuAddEditModal";

interface MenuManageProps {
    userInfo: () => void
}

class InnerMenuManage extends React.Component<MenuManageProps> {
    //接口服务
    menuService = new MenuService();
    state = {
        //列表数据
        tableList: [],
        //页面加载
        loading: false,
        //新增修改相关参数
        isAddModalShow: false,
        addModalKey: "",
        isEditModalShow: false,
        editModalKey: "",
        modalLoading: false,
        modalType: "",
        modalMenuInfo: {},
        //搜索初始化参数
        qryListReq: {
            app: "sso"
        },
        //列表字段
        columns: [
            {
                title: '菜单标题',
                width: 150,
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '图标',
                width: 220,
                dataIndex: 'icon',
                key: 'icon',
                render: text => {
                    if (text) {
                        const icon = React.createElement(
                            Icon[text],
                            {
                                style: {fontSize: '20px'}
                            }
                        )
                        return <div>{icon}<span style={{paddingLeft: 10}}>{text}</span></div>;
                    } else {
                        return text;
                    }
                }
            },
            {
                title: '菜单类型',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                render: text => {
                    if (text === 0) {
                        text = "目录"
                    } else if (text === 100) {
                        text = "菜单"
                    } else if (text === 2) {
                        text = "按钮"
                    }
                    return text
                }
            },
            {
                title: '排序',
                dataIndex: 'menuSort',
                key: 'menuSort',
                width: 100,
            },
            {
                title: '权限标识',
                dataIndex: 'permission',
                key: 'permission',
                width: 150,
            },
            {
                title: '菜单路径',
                dataIndex: 'path',
                key: 'path',
                width: 150,
            },
            {
                title: '是否外链',
                dataIndex: 'iFrame',
                key: 'iFrame',
                width: 100,
                render: text => {
                    let color = text ? '#ff9e4d' : '#108ee9';
                    return <Tag color={color}> {text ? "是" : "否"}</Tag>
                }
            },
            {
                title: '是否隐藏',
                dataIndex: 'hidden',
                key: 'hidden',
                width: 100,
                render: text => {
                    let color = text ? '#ff9e4d' : '#108ee9';
                    return <Tag color={color}> {text ? "是" : "否"}</Tag>
                }
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 150,
            },
            {
                title: '修改人',
                dataIndex: 'updateBy',
                key: 'updateBy',
                width: 150,
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right' as 'right',
                width: 150,
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => {
                            this.handleUpdate(record);
                        }}>修改</a>
                        <Popconfirm
                            placement="topRight"
                            title="确定删除该菜单及该菜单下的所有子菜单?"
                            onConfirm={() => {
                                this.handleDelete(record);
                            }}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                ),
            },
        ]
    }

    //初始化
    componentDidMount() {
        //当前用户信息
        const {userInfo} = this.props;
        console.log("userInfo", userInfo);
        //初始化查询表格
        this.qryMenuList({});
    }


    //菜单列表查询接口调用
    qryMenuList = (reqBody) => {
        this.loading(true);
        this.menuService.qryMenuList(reqBody, (res) => {
            if (res.code === 100) {
                this.setState({
                    tableList: res.data,
                    qryListReq: reqBody
                })
                this.loading(false);

            }
        }, (error) => {
            message.error(error);
            this.loading(false);

        })
    }

    //设置是否loading
    loading = (flag: boolean) => {
        this.setState({loading: flag});
    }

    //搜索
    onSearch = (data) => {
        this.qryMenuList({...this.state.qryListReq, ...data});
    }

    //新增按钮点击事件
    handleAddClick = () => {
        this.setState({
            isAddModalShow: true,
            modalType: "ADD",
            addModalKey: "addModalKey" + new Date().getTime().toString()
        })
    }

    //处理单项修改
    handleUpdate = (record) => {
        record.type = record.type != null ? record.type.toString() : "";
        record.pid = record.parent != null ? record.parent : "";
        record.menuID = record.key ? record.key : "";
        this.setState({
            isEditModalShow: true,
            modalType: 'EDIT',
            editModalKey: "editModalKey" + new Date().getTime().toString(),
            modalMenuInfo: record
        });
    }
    //处理单项删除
    handleDelete = (record) => {
        this.deleteMenus(record.key.toString());
    }


    //删除接口调用
    deleteMenus = (id) => {
        this.menuService.deleteMenu(id,res => {
            if (res.code === 100) {
                message.success(res.msg);
                this.qryMenuList(this.state.qryListReq);
            } else {
                message.warn(res.msg);
            }
        }, error => {
            message.error(error);
        });
    }


    //新增修改Modal 点击保存
    addEditSaveHandle = (values) => {
        const {modalType, qryListReq} = this.state
        this.setState({modalLoading: true});
        this.menuService.upsertMenu(values, (res) => {
            if (res.code === 100) {
                if (modalType == 'ADD') {
                    this.setState({isAddModalShow: false, modalLoading: false})
                } else if (modalType == 'EDIT') {
                    this.setState({isEditModalShow: false, modalLoading: false})
                }
                this.qryMenuList(qryListReq);
                message.success(res.message, 1);
            } else {
                this.setState({modalLoading: false});
                message.warning(res.message, 1);
            }
        }, (error) => {
            this.setState({modalLoading: false});
            message.error(error);
        });

    }

    //新增修改Modal 点击取消
    addEditCancelHandle = () => {
        if (this.state.modalType == 'ADD') {
            this.setState({isAddModalShow: false, modalType: '', modalLoading: false});
        } else if (this.state.modalType == 'EDIT') {
            this.setState({isEditModalShow: false, modalType: '', modalLoading: false});
        }
    }

    render() {
        const {
            tableList,
            columns,
            loading,
            isAddModalShow,
            modalLoading,
            isEditModalShow,
            modalType,
            addModalKey,
            editModalKey,
            modalMenuInfo,
        } = this.state;
        return <div className={"menu-item-page"}>

            <SearchBar onFinish={this.onSearch} columnSize={1}>
                <Row gutter={24}>
                    <Col span={5} key={"name"}>
                        <Form.Item
                            name={`name`}
                            label={`菜单标题`}
                        >
                            <Input placeholder={"请输入菜单标题"}/>
                        </Form.Item>
                    </Col>
                </Row>
            </SearchBar>
            <div className={"table-view-content"}>
                <Spin spinning={loading}>
                    <Button onClick={this.handleAddClick} type="primary" style={{marginBottom: 16}}>
                        新增
                    </Button>
                    <Table dataSource={tableList}
                           scroll={{x: 1500}}
                           columns={columns}
                           size="middle"
                           rowKey={"key"}
                    />
                </Spin>
            </div>
            {
                isAddModalShow || isEditModalShow ?
                    <MenuAddEditModal key={modalType == 'ADD' ? addModalKey : editModalKey}
                                      type={modalType == 'ADD' ? "ADD" : 'EDIT'}
                                      visible={modalType == 'ADD' ? isAddModalShow : isEditModalShow}
                                      loading={modalLoading}
                                      menuInfo={modalMenuInfo}
                                      handleCancel={this.addEditCancelHandle}
                                      handleOk={this.addEditSaveHandle}
                    /> : null
            }
        </div>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const MenuManage = connect(mapStateToProps)(InnerMenuManage);
