export interface IStatCardProps {
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
