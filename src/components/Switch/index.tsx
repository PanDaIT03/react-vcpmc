import classNames from "classnames/bind";
import { memo } from "react";

import style from '~/sass/Switch.module.scss';
const cx = classNames.bind(style);

type SwitchProps = {
    status: boolean;
    title: string;
    onClick?: () => void;
}

export const Switch = memo(({ status, title, onClick }: SwitchProps) => {
    return (
        <div className={cx('switch-container')}>
            <div className={cx('switch__button', status ? 'switch__on' : 'switch__off')} onClick={onClick}>
                <span></span>
            </div>
            <p className={cx('title')}>{title}</p>
        </div>
    );
});