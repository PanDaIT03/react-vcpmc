import classNames from "classnames/bind";
import { memo } from "react";

import styles from "~/sass/ContractEdit.module.scss";
const cx = classNames.bind(styles);

interface ContractEditProps {
    topData: Array<any>
    bottomData: Array<any>
    titleBottom?: string
    line?: boolean
    className?: string
};

export const ContractEdit = memo(({
    topData,
    bottomData,
    titleBottom,
    line = true,
    className
}: ContractEditProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("content")}>
                <div className={cx("col-top")}>
                    {topData.map((data, index) =>
                        <div key={index} className={cx("item")}>{data.value}</div>
                    )}
                </div>
                {line && <div className={cx("line")}></div>}
                <div className={cx("col-bottom")}>
                    {titleBottom && <div className={cx("title")}>{titleBottom}</div>}
                    <div className={cx("list-item")}>
                        {bottomData.map((data, index) =>
                            <div key={index} className={cx("item")}>{data.value}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});