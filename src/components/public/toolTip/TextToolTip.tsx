import React from "react";
import "@/assets/styles/public.less"
import {Tooltip} from "antd";

interface TextToolTipProps {
    value: string;
    showLength: number;
}

export class TextToolTip extends React.Component<TextToolTipProps> {

    //渲染
    render() {
        const {value, showLength} = this.props;

        return <div>
            <Tooltip title={value}>
                <span>{value.length > showLength ? value.substring(0,showLength).concat('...') : value}</span>
            </Tooltip>
        </div>;
    }
}