import classNames from "classnames/bind";

import styles from "~/sass/Contract.module.scss";
const cx = classNames.bind(styles);

interface TabProps {
    className?: string
    firstTab: string
    firstTabRef?: any
    secondTab: string
    secondTabRef?: any
    handleClick?: (page: React.RefObject<HTMLDivElement>) => void
};

export const Tabs = ({
    className,
    firstTab,
    firstTabRef,
    secondTab,
    secondTabRef,
    handleClick
}: TabProps) => {
    if (!className) className = "";


    const classes = cx("wrapper", {
        [className]: className
    });

    const tabs = [
        {
            title: firstTab,
            ref: firstTabRef
        },
        {
            title: secondTab,
            ref: secondTabRef
        },
    ];

    return (
        <div className={classes}>
            <div className={cx("switch-tabs")}>
                {tabs && tabs.map((tab, index) => (
                    <div key={index} className={cx("tab")}>
                        <p>{tab.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};