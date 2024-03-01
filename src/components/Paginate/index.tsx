import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { ChangeEvent, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import { Input } from "../Input";
import styles from "~/sass/Paginate.module.scss";
const cx = classNames.bind(styles);

export interface IPaginate {
    paginate?: {
        dataForPaginate: any[]
        setCurrentItems(items: any[]): void
    }
    itemsPerPage?: string
    setItemsPerPage?(number: string): void
};

export const Paginate = ({
    paginate,
    itemsPerPage: per = "1",
    setItemsPerPage
}: IPaginate & {  }) => {
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const itemsPerPage = parseInt(per);

    useEffect(() => {
        if (typeof paginate === "undefined") return;

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
        if (typeof paginate === "undefined") return;

        const { dataForPaginate } = paginate;
        const newOffset = (event.selected * itemsPerPage) % dataForPaginate.length;

        setItemOffset(newOffset);
    };

    return (
        <div className={cx("wrapper")}>
            <div className={cx("content")}>
                <div className={cx("page-numbers")}>
                    <p>Hiển thị</p>
                    <div className={cx("number")}>
                        <Input
                            value={per}
                            name="number"
                            type="number"
                            size="custom"
                            border="orange-4-default"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setItemsPerPage && setItemsPerPage(e.target.value)}
                        />
                    </div>
                    <p>hàng trong mỗi trang</p>
                </div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
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
    );
};