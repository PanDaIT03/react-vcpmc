import classNames from "classnames/bind";

import { IGlobalConstantsType } from "~/types";
import styles from "~/sass/BlockDetail.module.scss";
const cx = classNames.bind(styles);

interface BlockDetailProps {
    icon?: string
    title?: string
    className?: string
    data: IGlobalConstantsType[]
};

export const BlockDetail = ({
    icon,
    title,
    data,
    className
}: BlockDetailProps) => {
    if (!className) className = "";

    const classes = cx('wrapper', {
        [className]: className
    });

    return (
        <div className={classes}>
            {title && (
                <div className={cx("title-primary")}>
                    {icon && <img className={cx("icon")} src={icon} />}
                    <div className={cx("text")}>{title}</div>
                </div>
            )}
            <div className={cx("col_content")}>
                <div className={cx("col_left")}>
                    {data.map(item => (
                        <div
                            key={item.id}
                            className={cx("title", item.isActive && "active")}
                        >
                            <span>{item.title}:</span>
                        </div>
                    ))}
                </div>
                <div className={cx("col_right")}>
                    {data.map(item => {
                        return (typeof item.value === "string"
                            ? <div key={item.id} className={cx("value", item.isActive && "active")}>{item.value}</div>
                            : item.value?.map((item, index) => (
                                <div className={cx("value")} key={index}>
                                    <img src={item.icon} />
                                    <p>{item.title}</p>
                                </div>
                            )))
                    })}
                </div>
            </div>
        </div>
    );
};