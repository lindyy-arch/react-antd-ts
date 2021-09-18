import React from "react";
import "@/assets/styles/public.less"
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import routes from "@/router";

interface NewBreadcrumbProps {
    pathName: string;
}

export class NewBreadcrumb extends React.Component<NewBreadcrumbProps> {

    state = {
        pathSnippets: null,
        extraBreadcrumbItems: null,
        breadcrumbNameMap: new Map
    }
    componentWillMount() {
        this.initMap();
        this.getPath();
    }
    initMap = () => {
        routes.map(item => {
            this.state.breadcrumbNameMap.set(item.path,item.breadcrumb);
            this.forceUpdate();
        })
    }
    getPath = () => {
        //对路径进行切分，存放到this.state.pathSnippets中
        this.state.pathSnippets = this.props.pathName.split('/').filter(i => i);
        //将切分的路径读出来，形成面包屑，存放到this.state.extraBreadcrumbItems
        this.state.extraBreadcrumbItems = this.state.pathSnippets.map((_, index) => {
            let url = `/${this.state.pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {this.state.breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
    }

    //渲染
    render() {
        return <Breadcrumb>{this.state.extraBreadcrumbItems}</Breadcrumb>;
    }
}