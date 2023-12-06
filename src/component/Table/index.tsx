import classNames from "classnames/bind";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { Loading } from "../Loading";

import styles from "~/sass/Table.module.scss";
const cx = classNames.bind(styles);

interface TableProps {
    loading: boolean
    className?: string
    children?: ReactNode
};

export const Table = ({
    loading,
    className,
    children
}: TableProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const handleChange = () => { };

    return (
        <div className={classes}>
            <table>
                {children}
            </table>
            <div className={cx("action-bottom")}>
                <div className={cx("show", "--center-flex")}>
                    <div className={cx("title")}>Hiển thị</div>
                    <input name="pageNumber" value="13" onChange={handleChange} />
                    <div className={cx("sub-title")}>hàng trong mỗi trang</div>
                </div>
                <div className={cx("pagination")}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <div className={cx("page-num", "--center-flex")}>
                        <div className={cx("active", "--center-flex")}>1</div>
                        <div>2</div>
                        <div>...</div>
                        <div>10</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
            {loading && <Loading loading={true} />}
        </div>
    );
};