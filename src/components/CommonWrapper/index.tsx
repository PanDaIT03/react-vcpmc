import classNames from "classnames/bind";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { images } from "~/assets";
import { PagingItemType } from "../Paging";

import styles from "~/sass/Contract.module.scss";
const cx = classNames.bind(styles);

interface CommonWrapperProps {
    title: string
    children?: ReactNode
    paging?: PagingItemType[]
};

export const CommonWrapper = ({
    title,
    children,
    paging
}: CommonWrapperProps) => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("paging")}>
                    {paging && paging.map((item, index) => {
                        let isNextPage = true;
                        if (index === paging.length - 1)
                            isNextPage = false;

                        return (
                            <Link
                                key={index}
                                to={item.to}
                                className={cx("item")}
                            >
                                <div className={cx("page")}>{item.title}</div>
                                {isNextPage && <img src={images.chevronRight} alt="chevron" />}
                            </Link>
                        )
                    })}
                </div>
                <div className={cx("title")}>
                    <h2>{title}</h2>
                </div>
                <div className={cx("content")}>{children}</div>
            </div>
        </div>
    );
};