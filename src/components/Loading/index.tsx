import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";

import styles from "~/sass/DefaultLayout.module.scss";
const cx = classNames.bind(styles);

interface LoadingProps {
    loading: boolean
    className?: string
};

export const Loading = ({ loading, className }: LoadingProps) => {
    if (!className) className = "";

    const classes = cx("loading", {
        [className]: className
    });

    return (
        <>
            {loading
                && <div className={classes}>
                    <div className={cx("loading-spinner")}>
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                </div>}
        </>
    );
};