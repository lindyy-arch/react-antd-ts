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
    Card, Tree
} from "antd";
import {SearchBar} from "@/components/public/searchBar/SearchBar";
import {GetMenuCheckedDto, MenuService, SaveRoleMenuDto} from "@/services/MenuService";
import {QueryRoleInfoDto, RoleService} from "@/services/RoleService";
import {TextToolTip} from "@/components/public/toolTip/TextToolTip";
import {DictSelect} from "@/components/public/dictSelect/DictSelect";
import RoleAddEditModal from "@/views/system/roleManage/RoleAddEditModal";

interface RoleManageProps {
    userInfo: () => void
}

class InnerRoleManage extends React.Component<RoleManageProps> {
    //接口服务
    menuService = new MenuService();
    roleService = new RoleService();
    state = {
        //列表数据
        tableList: [],
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
        modalRoleInfo: {},
        //列表总数
        total: 0,
        //搜索初始化参数
        qryRoleInfoReq: {
            pageSize: 10,
            pageNum: 1,
        },
        checkedKeys: [],
        roleID: null,
        appMenuMap: new Map(),
        menuTreeData: [],
        menuIDs: [],
        columns: [
            {
                title: '角色名',
                width: 150,
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '描述',
                width: 200,
                dataIndex: 'description',
                key: 'description',
                render: (text) => {
                    return <TextToolTip showLength={10} value={text}/>;
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
                key: '7',
                width: 100,
            },
            {
                title: '是否启用',
                dataIndex: 'enabled',
                key: 'enabled',
                width: 100,
                render: enabled => {
                    let color = enabled ? 'green' : 'volcano';
                    return <Tag color={color}> {enabled ? "启用" : "禁用"}</Tag>
                }
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right' as 'right',
                width: 100,
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => {
                            this.handleUpdate(record);
                        }}>修改</a>
                        <Popconfirm
                            title="确定删除该角色?"
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
        this.getMenuTree();
        this.qryRoleList({pageSize: 10, pageNum: 1});
    }

    getMenuTree = () => {
        this.menuService.getMenuTree((res) => {
            if (res.code === 100) {
                const menuTreeData = res.data
                this.setState({
                    menuTreeData,
                    roleID: null
                })
            }
        }, (error => {
            message.error(error);
        }))
    }

    getMenuChecked = (roleID) => {
        const reqParam: GetMenuCheckedDto = {roleID};
        this.menuService.getMenuChecked(reqParam, (res) => {
            this.setState({
                checkedKeys: res.data.checkedKeys,
                roleID,
            })
        }, (error => {
            message.error(error);
        }));
    }


    qryRoleList = (reqBody: QueryRoleInfoDto) => {
        this.loading(true);
        this.roleService.qryRoleList(reqBody, (res) => {
            if (res.code === 100) {
                this.setState({
                    tableList: res.data.list,
                    total: res.data.total,
                    qryUserInfoReq: reqBody,
                    selectedRowKeys: [],
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
        this.qryRoleList({...this.state.qryRoleInfoReq,...data});
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
        this.setState({
            isEditModalShow: true,
            modalType: 'EDIT',
            editModalKey: "editModalKey" + new Date().getTime().toString(),
            modalRoleInfo: record
        });
    }
    //处理单项删除
    handleDelete = (record) => {
        const ids = [];
        ids.push(record.roleID.toString());
        this.deleteRoles(ids);
    }

    //删除接口调用
    deleteRoles = (ids) => {
        this.roleService.deleteRole(ids, (res) => {
            if (res.code === 100) {
                message.success(res.msg);
                this.qryRoleList(this.state.qryRoleInfoReq);
            } else {
                message.error(res.msg);
            }
        }, (error) => {
            message.error(error);
        });
    }

    //处理批量删除
    handleBatchDelete = () => {
        this.deleteRoles(this.state.selectedRowKeys);
    }


    //多项选择变更监听
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };


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
        this.state.qryRoleInfoReq.pageNum = current;
        this.qryRoleList(this.state.qryRoleInfoReq);
        this.getMenuTree();
    }

    //修改展示条数变更监听
    onShowSizeChange = (current, pageSize) => {
        this.state.qryRoleInfoReq.pageNum = current;
        this.state.qryRoleInfoReq.pageSize = pageSize;
        this.qryRoleList(this.state.qryRoleInfoReq);
    }


    //菜单树选择
    onTreeCheck = (checkedKeys: React.Key[], info: any) => {
        let concatTreeData = checkedKeys.concat(info.halfCheckedKeys)
        this.setState({
            checkedKeys,
            menuIDs: concatTreeData
        })
    }

    //表格行点击高亮
    setRowClassName = (record) => {
        return record.roleID === this.state.roleID ? 'clickRowStyle' : '';
    }

    //行点击事件
    onRowClick = (record) => {
        return {
            onClick: () => {
                this.getMenuChecked(record.roleID);
            }
        }
    }

    //修改角色菜单保存
    savaMenuChecked = () => {
        this.loading(true);
        const {menuIDs, roleID} = this.state
        const reqBody: SaveRoleMenuDto = {menuIDs, roleID}
        this.menuService.saveRoleMenu(reqBody, (res) => {
            this.loading(false);
            if (res.code === 100) {
                message.success("保存成功")
            } else {
                message.warning("保存失败")
            }
        }, (error) => {
            this.loading(false);
            message.error(error)
        });
    }

    addEditSaveHandle = (values) =>{
        const {modalType, qryRoleInfoReq} = this.state;
        this.setState({modalLoading: true});
        this.roleService.upsertRole(values, (res) => {
            if (res.code === 100) {
                if (modalType == 'ADD') {
                    this.setState({isAddModalShow: false, modalLoading: false})
                } else if (modalType == 'EDIT') {
                    this.setState({isEditModalShow: false, modalLoading: false})
                }
                this.qryRoleList(qryRoleInfoReq);
                message.success(res.message, 1);
            } else {
                console.log(res.message);
                this.setState({modalLoading: false});
                message.warning(res.message, 1);
            }
        }, (error) => {
            this.setState({modalLoading: false});
            message.error(error);
        });
    }

    render() {
        const {
            tableList,
            columns,
            loading,
            selectedRowKeys,
            isAddModalShow,
            modalLoading,
            isEditModalShow,
            modalType,
            modalRoleInfo,
            addModalKey,
            editModalKey,
            checkedKeys,
            menuTreeData,
            roleID
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
            pageSize: this.state.qryRoleInfoReq.pageSize,
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
                    <Col span={5} key={"name"}>
                        <Form.Item
                            name={`name`}
                            label={`角色名称`}
                            rules={[
                                {}
                            ]}
                        >
                            <Input placeholder="请输入角色名称"/>
                        </Form.Item>
                    </Col>
                    <Col span={5} key={"enabled"}>
                        <Form.Item
                            name={`enabled`}
                            label={`是否启用`}
                            rules={[
                                {}
                            ]}
                        >
                            <DictSelect dictName={"enabled"} placeholder={"请选择是否启用"}
                            />
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

                    <div className="site-card-wrapper">
                        <Row gutter={24}>
                            <Col span={18}>
                                <Card title={<div style={{fontWeight: 600}}>角色列表</div>} size={"small"}
                                >
                                    <Table pagination={paginationProps}
                                           dataSource={tableList}
                                           scroll={{x: 800, y: 530}}
                                           columns={columns}
                                           size="middle"
                                           rowSelection={rowSelection}
                                           rowKey={"roleID"}
                                           rowClassName={this.setRowClassName}
                                           onRow={this.onRowClick}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card title={
                                    <div>
                                        <span style={{fontWeight: 600}}>菜单分配</span>
                                        <Button style={{float: "right"}} type="primary"
                                                onClick={this.savaMenuChecked}>保存</Button>
                                    </div>
                                } size={"small"}>
                                    {menuTreeData ?
                                        <Tree
                                            checkable
                                            treeData={menuTreeData}
                                            onCheck={this.onTreeCheck}
                                            checkedKeys={checkedKeys}
                                            disabled={roleID != null ? false : true}
                                        />
                                        : null
                                    }

                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
            {
                isAddModalShow || isEditModalShow ?
                    <RoleAddEditModal key={modalType == 'ADD' ? addModalKey : editModalKey}
                                      type={modalType == 'ADD' ? "ADD" : 'EDIT'}
                                      visible={modalType == 'ADD' ? isAddModalShow : isEditModalShow}
                                      loading={modalLoading}
                                      roleInfo={modalRoleInfo}
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
export const RoleManage = connect(mapStateToProps)(InnerRoleManage);
