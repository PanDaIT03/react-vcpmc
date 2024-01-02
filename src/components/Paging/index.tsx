import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import style from './Paging.module.scss';
const cx = classNames.bind(style);

export type PagingItemType = {
    title: string;
    to: string;
    active?: boolean;
}

type PagingProps = {
    data: Array<PagingItemType>;
    className?: string;
}

export const Paging = ({ className, data }: PagingProps) => {
    const { setActive } = useContext(SidebarContext);

    return (
        <div className={cx('paging-container', className)}>
            {data.map((item, index) => {
                let isPagingNext = true;
                if (index === data.length - 1)
                    isPagingNext = false;

                return (
                    <span key={index}>
                        <Link to={`${item.to}`} onClick={() => setActive(item.active || true)}>{item.title}</Link>
                        {isPagingNext && <FontAwesomeIcon icon={faChevronRight} />}
                    </span>
                )
            })}
        </div>
    );
}