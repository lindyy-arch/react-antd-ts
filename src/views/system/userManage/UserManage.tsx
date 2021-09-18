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
    message,
    Tag,
    Popconfirm,
    TreeSelect
} from "antd";
import UserAddEditModal from "@/views/system/userManage/UserAddEditModal";
import {QueryUserInfoDto, UserService} from "@/services/UserService";
import {SearchBar} from "@/components/public/searchBar/SearchBar";
import {OfficeService} from "@/services/OfficeService";
import {DictSelect} from "@/components/public/dictSelect/DictSelect";
import {RoleService} from "@/services/RoleService";
import moment from "moment";

interface userManageProps {
    userInfo: () => void
}

class InnerUserManage extends React.Component<userManageProps> {
    //接口服务
    userService = new UserService();
    officeService = new OfficeService();
    roleService = new RoleService();
    state = {
        //列表数据
        userList: [],
        //所有角色
        allRoles: [],
        //勾选的列表数据ID
        selectedRowKeys: [],
        //页面加载
        loading: false,
        //新增修改相关参数
        isAddModalShow: false,
        addModalKey: "",
        isEditModalShow: false,
        editModalKey: "",
        modalLoading: false,
        modalType: "",
        modalUserInfo: {},
        //列表总数
        total: 0,
        //搜索初始化参数
        qryUserInfoReq: {
            pageSize: 10,
            pageNum: 1,
        },
        officeTreeData: [],
        //列表字段
        columns: [
            {
                title: '用户名',
                width: 100,
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '姓名',
                width: 100,
                dataIndex: 'nickName',
                key: 'nickName',
            },
            {
                title: '机构',
                dataIndex: 'officeName',
                key: 'officeName',
                width: 150,
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                width: 100,
                render: gender => {
                    return gender == '1'? '男' : '女';
                }
            },
            {
                title: '手机号码',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
            },
            {
                title: '邮箱地址',
                dataIndex: 'email',
                key: 'email',
                width: 200,
            },
            {
                title: '密码修改时间',
                dataIndex: 'pwdResetTime',
                key: 'pwdResetTime',
                width: 150,
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 150,
                render: text => {
                    return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text;
                }
            },
            {
                title: '修改人',
                dataIndex: 'updateBy',
                key: 'updateBy',
                width: 150,
            },
            {
                title: '是否启用',
                dataIndex: 'enabled',
                key: 'enable',
                width: 150,
                render: enabled => {
                    let color = enabled ? 'green' : 'volcano';
                    return <Tag color={color}> {enabled ? "启用" : "禁用"}</Tag>
                }
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
                            title="确定删除该用户?"
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
        //初始化查询表格
        this.qryUserList({pageSize: 10, pageNum: 1});
        //查询机构树
        this.qryOfficeTree();
        //查询所有角色
        this.qryAllRoles();
    }

    //查询所有角色
    qryAllRoles = () => {
        this.roleService.qryAllRoles(res => {
            if (res.code === 100) {
                const allRoles = res.data;
                this.setState({allRoles});
            }
        }, error => {
            message.error(error);
        })
    }

    //查询机构树
    qryOfficeTree = () => {
        this.officeService.buildOfficeTree((res) => {
            if (res.code === 100) {
                const officeTreeData = res.data.officeTree;
                this.setState({officeTreeData})
            }
        }, (error) => {
            message.error(error);
        })
    }

    //用户列表查询接口调用
    qryUserList = (reqBody: QueryUserInfoDto) => {
        this.loading(true);
        this.userService.qryUserList(reqBody, (res) => {
            if (res.code === 100) {
                this.setState({
                    userList: res.data.list,
                    total: res.data.total,
                    qryUserInfoReq: reqBody,
                    selectedRowKeys: []
                })
                this.loading(false);
            }
        }, (error) => {
            this.loading(false);
            message.error(error);
        });
    }

    //设置是否loading
    loading = (flag: boolean) => {
        this.setState({loading: flag});
    }

    //搜索
    onSearch = (data) => {
        this.qryUserList({...this.state.qryUserInfoReq,...data});
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
        if (record && record.roles) {
            const roleIDs = [];
            record.roles.forEach(item => {
                roleIDs.push(item.roleID.toString());
            });
            record.roleIDs = roleIDs;
        }
        record.officeID = record.officeID.toString();
        record.enable = record.enable.toString();
        this.setState({
            isEditModalShow: true,
            modalType: 'EDIT',
            editModalKey: "editModalKey" + new Date().getTime().toString(),
            modalUserInfo: record
        });
    }
    //处理单项删除
    handleDelete = (record) => {
        const userIDs = [];
        userIDs.push(record.userID.toString());
        this.deleteUsers(userIDs);
    }

    //处理批量删除
    handleBatchDelete = () => {
        this.deleteUsers(this.state.selectedRowKeys);
    }


    //删除接口调用
    deleteUsers = (ids) => {
        this.userService.deleteUser(ids, (res) => {
            if (res.code === 100) {
                message.success(res.msg);
                this.qryUserList(this.state.qryUserInfoReq);
            } else {
                message.error(res.msg);
            }
        }, (error) => {
            message.error(error);
        });
    }


    //多项选择变更监听
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    };

    //新增修改Modal 点击保存
    addEditSaveHandle = (values) => {
        const {modalType, qryUserInfoReq} = this.state
        this.setState({modalLoading: true});
        this.userService.upsertUser(values, (res) => {
            if (res.code === 100) {
                if (modalType == 'ADD') {
                    this.setState({isAddModalShow: false, modalLoading: false})
                } else if (modalType == 'EDIT') {
                    this.setState({isEditModalShow: false, modalLoading: false})
                }
                this.qryUserList(qryUserInfoReq);
                message.success(res.message, 1);
            } else {
                console.log(res.message);
                this.setState({modalLoading: false});
                message.warning(res.message, 1);
            }
        }, (error) => {
            console.log(error)
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

    //页码变更
    changePage = (current) => {
        this.state.qryUserInfoReq.pageNum = current;
        this.qryUserList(this.state.qryUserInfoReq);
    }

    //修改展示条数变更监听
    onShowSizeChange = (current, pageSize) => {
        this.state.qryUserInfoReq.pageNum = current;
        this.state.qryUserInfoReq.pageSize = pageSize;
        this.qryUserList(this.state.qryUserInfoReq);
    }

    //选择机构触发事件
    onTreeSelectChange = (value) => {
        console.log(value)
    }

    render() {
        const {
            userList,
            columns,
            loading,
            selectedRowKeys,
            isAddModalShow,
            modalLoading,
            isEditModalShow,
            modalType,
            modalUserInfo,
            addModalKey,
            editModalKey,
            officeTreeData,
            allRoles
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        //分页属性设置
        const paginationProps = {
            //是否展示 pageSize 切换器
            showSizeChanger: true,
            //是否可以快速跳转至某页
            showQuickJumper: true,
            //指定每页可以显示多少条
            pageSizeOptions: ['10', '20', '30'],
            //用于显示数据总量和当前数据顺序
            showTotal: () => `共${this.state.total}条`,
            //每页条数
            pageSize: this.state.qryUserInfoReq.pageSize,
            //数据的总的条数
            total: this.state.total,
            //页码或 pageSize 改变的回调
            onChange: (current) => this.changePage(current),
            //pageSize 变化的回调
            onShowSizeChange: (current, pageSize) => {
                this.onShowSizeChange(current, pageSize)
            }
        }
        const hasSelected = selectedRowKeys.length > 0;
        return <div className={"menu-item-page"}>

            <SearchBar onFinish={this.onSearch} columnSize={3}>
                <Row gutter={24}>
                    <Col span={5} key={"username"}>
                        <Form.Item
                            name={`username`}
                            label={`用户名`}
                            rules={[
                                {}
                            ]}
                        >
                            <Input placeholder="请输入用户名"/>
                        </Form.Item>
                    </Col>
                    <Col span={5} key={"nickName"}>
                        <Form.Item
                            name={`nickName`}
                            label={`姓名`}
                            rules={[]}
                        >
                            <Input placeholder="请输入姓名"/>
                        </Form.Item>
                    </Col>
                    <Col span={5} key={"officeID"}>
                        <Form.Item
                            name={`officeID`}
                            label={`机构`}
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
                    <Col span={5} key={"enable"}>
                        <Form.Item
                            name={`enable`}
                            label={`是否启用`}
                            rules={[
                                {}
                            ]}
                        >
                            <DictSelect dictName={"enabled"}  placeholder={"请选择是否启用"}/>
                        </Form.Item>
                    </Col>
                </Row>
            </SearchBar>
            <div className={"table-view-content"}>
                <Spin spinning={loading}>
                    <Button onClick={this.handleAddClick} type="primary" style={{marginBottom: 16}}>
                        新增
                    </Button>
                    <Button onClick={this.handleBatchDelete} type="primary" style={{marginBottom: 16, marginLeft: 8}}
                            disabled={!hasSelected}>
                        删除
                    </Button>

                    <Table pagination={paginationProps}
                           dataSource={userList}
                           scroll={{x: 1500, y: 530}}
                           columns={columns}
                           size="middle"
                           rowSelection={rowSelection}
                           rowKey={"userID"}
                    />
                </Spin>
            </div>
            {
                isAddModalShow || isEditModalShow ?
                    <UserAddEditModal key={modalType == 'ADD' ? addModalKey : editModalKey}
                                      type={modalType == 'ADD' ? "ADD" : 'EDIT'}
                                      visible={modalType == 'ADD' ? isAddModalShow : isEditModalShow}
                                      loading={modalLoading}
                                      userInfo={modalUserInfo}
                                      handleCancel={this.addEditCancelHandle}
                                      handleOk={this.addEditSaveHandle}
                                      officeTreeData={officeTreeData}
                                      allRoles={allRoles}
                    /> : null
            }
        </div>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const UserManage = connect(mapStateToProps)(InnerUserManage);
