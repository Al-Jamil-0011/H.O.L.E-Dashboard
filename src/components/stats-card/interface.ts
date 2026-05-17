import { ReactNode } from "react";

export interface IUserStatCardProps {
    title: string;
    value?: string | number;
    trendColor?: string;
    topBorderColor: string;
    loading?: boolean;
}

export interface IDetailRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}


export type IStatInfoCardProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
    valuePrefix?: string;
    valueSuffix?: string;
    iconClass?: string;
    loading?: boolean;
};


export interface IRepAccountsStatsCardProps {
    title: string;
    value?: number;
    loading: boolean;
    color: string;
    isAlert?: boolean;
    isNumber?: boolean;
    borderColor?: string;
}
