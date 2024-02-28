import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { Checkbox } from "../Checkbox";
import { Input } from "../Input";

import styles from "~/sass/Table.module.scss";
const cx = classNames.bind(styles);

interface TableProps {
    paginate?: {
        dataForPaginate: Array<any>
        setCurrentItems(item: Array<any>): void
    }
    itemsPerPage?: string
    setItemsPerPage?(number: string): void
    paginateClass?: string
    thead: string[]
    isCheckedAll?: boolean
    isApprove?: boolean
    className?: string
    children?: ReactNode
    isScroll?: boolean
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
    itemsPerPage: per = '1',
    setItemsPerPage,
    isScroll = false,
    border = "default-border",
    paginateClass,
    headerChildren,
    setIsCheckedAll
}: TableProps) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState<number>(0);

    const itemsPerPage = parseInt(per);

    if (!className) className = "";

    const classes = cx("container", {
        [className]: className
    });

    useEffect(() => {
        if (typeof paginate === 'undefined')
            return;

        const { dataForPaginate, setCurrentItems } = paginate;

        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(dataForPaginate.length / itemsPerPage));
    }, [itemOffset, per, paginate?.dataForPaginate]);

    useEffect(() => {
        if (typeof paginate === 'undefined')
            return;

        const { setCurrentItems } = paginate;

        setCurrentItems && setCurrentItems(paginate.dataForPaginate.slice(0, itemsPerPage));
    }, [itemsPerPage]);

    const handlePageClick = (event: { selected: number }) => {
        if (typeof paginate === 'undefined')
            return;

        const { dataForPaginate } = paginate;
        const newOffset = (event.selected * itemsPerPage) % dataForPaginate.length;

        setItemOffset(newOffset);
    };

    const handleChange = () => { };

    return (
        <div className={cx("wrapper")}>
            <div className={classes}>
                <div className={cx("content")}>
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
                    {typeof paginate !== 'undefined' ? <div className={cx('table__option', paginateClass)}>
                        <div className={cx('table__option__container')}>
                            <span>
                                <p>Hiển thị</p>
                                <Input
                                    size="small-pl"
                                    value={per}
                                    name='number'
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setItemsPerPage && setItemsPerPage(e.target.value)}
                                />
                                <p>hàng trong mỗi trang</p>
                            </span>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                renderOnZeroPageCount={null}
                                containerClassName={cx("pagination")}
                                pageLinkClassName={cx("page-num")}
                                previousClassName={cx("page-num")}
                                nextLinkClassName={cx("page-num")}
                                activeClassName={cx("active")}
                            />
                        </div>
                    </div>
                        : <></>
                    }
                    {/* {!isScroll
                        && <div className={cx("action-bottom")}>
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
                        </div>} */}
                </div>
            </div>
        </div>
    );
};