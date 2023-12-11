import classNames from "classnames/bind";
import { memo } from 'react';
import { images } from "~/assets";

import styles from '~/sass/RadioButton.module.scss';
const cx = classNames.bind(styles);

interface RadioButtonProps {
    title?: string
    checked: boolean
    onClick: () => void
};

export const RadioButton = memo(({
    title,
    checked,
    onClick,
    ...passProps
}: RadioButtonProps) => {
    return (
        <div className={cx('form-group')} onClick={onClick}>
            {!checked
                ? <>
                    <div className={cx("radio")} ></div>
                    {title && <div className={cx("title")}>{title}</div>}
                </>
                : <>
                    <div className={cx("radio-checked")} >
                        <img src={images.radioButton} alt="checked" />
                    </div>
                    {title && <div className={cx("title")}>{title}</div>}
                </>}
        </div>
    );
})