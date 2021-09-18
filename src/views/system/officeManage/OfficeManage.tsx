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
import {OfficeService} from "@/services/OfficeService";
import OfficeAddEditModal from "@/views/system/officeManage/OfficeAddEditModal";

interface OfficeManageProps {
    userInfo: () => void
}

class InnerOfficeManage extends React.Component<OfficeManageProps> {
    //接口服务
    officeService = new OfficeService();
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
        modalOfficeInfo: {},
        officeTreeData: [],
        //列表总数
        total: 0,
        //搜索初始化参数
        qryListReq: {
        },
        //列表字段
        columns: [
            {
                title: '机构名称',
                width: 150,
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '排序',
                dataIndex: 'officeSort',
                key: 'officeSort',
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
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 150,
            },
            {
                title: '创建人',
                dataIndex: 'createBy',
                key: 'createBy',
                width: 150,
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
                            title="确定删除该机构及该机构下的所有子机构?"
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
        this.qryOfficeList({});
        //查询机构树
        this.qryOfficeTree();
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

    //机构列表查询接口调用
    qryOfficeList = (reqBody) => {
        this.loading(true);
        this.officeService.qryOfficeList(reqBody, (res) => {
            if (res.code === 100) {
                this.setState({
                    tableList: res.data
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
        this.qryOfficeList({...this.state.qryListReq, ...data});
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
        const updateInfo = {
            officeID: record.key,
            name: record.title,
            pid: record.parent,
            officeSort: record.officeSort,
            enabled: record.enabled.toString()
        }
        this.setState({
            isEditModalShow: true,
            modalType: 'EDIT',
            editModalKey: "editModalKey" + new Date().getTime().toString(),
            modalOfficeInfo: updateInfo
        });
    }
    //处理单项删除
    handleDelete = (record) => {
        this.deleteOffice(record.key.toString());
    }


    //删除接口调用
    deleteOffice = (id) => {
        this.officeService.deleteOffice(id, (res) => {
            if (res.code === 100) {
                message.success(res.msg);
                this.qryOfficeList(this.state.qryListReq);
            } else {
                message.error(res.msg);
            }
        }, (error) => {
            message.error(error);
        });
    }

    //新增修改Modal 点击保存
    addEditSaveHandle = (values) => {
        const {modalType, qryListReq} = this.state
        this.setState({modalLoading: true});
        this.officeService.upsertOffice(values, (res) => {
            if (res.code === 100) {
                if (modalType == 'ADD') {
                    this.setState({isAddModalShow: false, modalLoading: false})
                } else if (modalType == 'EDIT') {
                    this.setState({isEditModalShow: false, modalLoading: false})
                }
                this.qryOfficeList(qryListReq);
                this.qryOfficeTree();

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
            modalOfficeInfo,
            officeTreeData
        } = this.state;
        return <div className={"menu-item-page"}>

            <SearchBar onFinish={this.onSearch} columnSize={1}>
                <Row gutter={24}>
                    <Col span={5} key={"name"}>
                        <Form.Item
                            name={`name`}
                            label={`机构名称`}
                            rules={[
                                {}
                            ]}
                        >
                            <Input placeholder="请输入机构名称"/>
                        </Form.Item>
                    </Col>
                </Row>
            </SearchBar>
            <div className={"table-view-content"}>
                <Spin spinning={loading}>
                    <Button onClick={this.handleAddClick} type="primary" style={{marginBottom: 16}}>
                        新增
                    </Button>
                    <Table
                           dataSource={tableList}
                           scroll={{x: 1500}}
                           columns={columns}
                           size="middle"
                           rowKey={"key"}
                    />
                </Spin>
            </div>
            {
                isAddModalShow || isEditModalShow ?
                    <OfficeAddEditModal key={modalType == 'ADD' ? addModalKey : editModalKey}
                                        type={modalType == 'ADD' ? "ADD" : 'EDIT'}
                                        visible={modalType == 'ADD' ? isAddModalShow : isEditModalShow}
                                        loading={modalLoading}
                                        officeInfo={modalOfficeInfo}
                                        handleCancel={this.addEditCancelHandle}
                                        handleOk={this.addEditSaveHandle}
                                        officeTreeData={officeTreeData}
                    /> : null
            }
        </div>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const OfficeManage = connect(mapStateToProps)(InnerOfficeManage);
