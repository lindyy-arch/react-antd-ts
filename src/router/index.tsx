import * as React from 'react'
import {UserManage} from "@/views/system/userManage/UserManage";
import {RoleManage} from "@/views/system/roleManage/RoleManage";
import {MenuManage} from "@/views/system/menuManage/MenuManage";
import {OfficeManage} from "@/views/system/officeManage/OfficeManage";
import {WorkSpaceManage} from "@/views/workspace/workManage/WorkSpaceManage";
import {ScoreCardSet} from "@/views/workspace/scoreCard/ScoreCardSet";

const routes = [
    {
        path: '/admin/user',
        breadcrumb: "用户管理",
        component: UserManage,

    },
    {
        path: '/admin/role',
        breadcrumb: "用户管理",
        component: RoleManage
    },
    {
        path: '/admin/office',
        breadcrumb: "机构管理",
        component: OfficeManage
    },
    {
        path: '/admin/menu',
        breadcrumb: "菜单管理",
        component: MenuManage
    },
    {
        path: '/admin/workspace',
        breadcrumb: "工作空间",
        component: WorkSpaceManage
    },
    {
        path: '/admin/scoretest',
        breadcrumb: "评分卡测试",
        component: ScoreCardSet
    },

];
export default routes
