import classNames from "classnames/bind";
import { Dispatch, ReactNode, SetStateAction } from "react";

import { Checkbox } from "../Checkbox";
import { IPaginate, Paginate } from "../Paginate";

import styles from "~/sass/Table.module.scss";
const cx = classNames.bind(styles);

interface TableProps {
    thead: string[]
    isCheckedAll?: boolean
    isApprove?: boolean
    className?: string
    children?: ReactNode
    isScroll?: boolean
    minWidth?: string
    minHeight?: string
    border?: "none" | "default-border"
    headerChildren?: ReactNode
    setIsCheckedAll?: Dispatch<SetStateAction<boolean>>
};

export const Table = ({
    thead,
    isApprove = false,
    isCheckedAll = false,
    className,
    children,
    paginate,
    itemsPerPage: per = "1",
    setItemsPerPage,
    isScroll = false,
    minWidth = "1184px",
    minHeight = "510px",
    border = "default-border",
    headerChildren,
    setIsCheckedAll
}: TableProps & IPaginate) => {
    if (!className) className = "";

    const classes = cx("container", {
        [className]: className
    });

    return (
        <div className={cx("wrapper")}>
            <div className={classes}>
                <div
                    className={cx("content")}
                    style={{ minWidth: minWidth, minHeight: minHeight }}
                >
                    <table>
                        <thead>
                            <tr className={cx("title")}>
                                {headerChildren && headerChildren}
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
                        <tbody className={cx(isScroll && "scroll", border)}>
                            {children}
                        </tbody>
                    </table>
                    {typeof paginate !== "undefined"
                        && <Paginate
                            paginate={paginate}
                            itemsPerPage={per}
                            setItemsPerPage={setItemsPerPage}
                        />}
                </div>
            </div>
        </div>
    );
};