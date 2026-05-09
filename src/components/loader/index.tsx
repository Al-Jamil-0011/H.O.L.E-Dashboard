import React from 'react';
import { ImSpinner2 } from 'react-icons/im'; // A clean, modern spinner icon
import { IconType } from 'react-icons';

interface LoaderProps {
    size?: number;
    color?: string;
    className?: string;
    icon?: IconType;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = 24,
    color = 'text-primary',
    className = '',
    icon: Icon = ImSpinner2,
    text,
}) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <Icon
                size={size}
                className={`animate-spin ${color}`}
            />
            {text && <p className={`text-sm font-medium  tracking-wide animate-pulse ${color}`}>{text}</p>}
        </div>
    );
};

export default Loader;