import classNames from "classnames/bind";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { Loading } from "../Loading";
import { Checkbox } from "../Checkbox";

import styles from "~/sass/Table.module.scss";
const cx = classNames.bind(styles);

interface TableProps {
    loading: boolean
    thead: string[]
    isCheckedAll?: boolean
    isApprove?: boolean
    className?: string
    children?: ReactNode
    setIsCheckedAll?: Dispatch<SetStateAction<boolean>>
};

export const Table = ({
    loading,
    thead,
    isApprove = false,
    isCheckedAll = false,
    className,
    children,
    setIsCheckedAll
}: TableProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const handleChange = () => { };

    return (
        <div className={classes}>
            <table>
                <thead>
                    <tr className={cx("title")}>
                        {isApprove && <th>
                            <Checkbox
                                checked={isCheckedAll}
                                onClick={() => setIsCheckedAll && setIsCheckedAll(!isCheckedAll)}
                            />
                        </th>}
                        {thead.map((item, index) => (
                            <th key={index}><p>{item}</p></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
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
            <Loading loading={loading} />
        </div>
    );
};