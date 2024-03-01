import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { getCategories } from "~/state/thunk/category";
import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { Loading } from "~/components/Loading";
import { Table } from "~/components/Table";
import { ICategory } from "~/types/CategoryType";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";

import style from '~/sass/ProductInfomation.module.scss';
const cx = classNames.bind(style);

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Trang chủ',
        to: routes.SettingPage,
    }, {
        title: 'Cài đặt hệ thống',
        to: '#',
    }
];

function CategoryPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { categoryList, loading } = useSelector((state: RootState) => state.category);

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [itemsPerPage, setItemsPerPage] = useState<string>('10');
    const [actionData, setActionData] = useState<any[]>([] as any[]);

    const [currentItems, setCurrentItems] = useState<Array<ICategory>>([] as Array<ICategory>);
    const [searchResult, setSearchResult] = useState<Array<ICategory>>([] as Array<ICategory>);

    useEffect(() => {
        setActive(true);
        setCurrentPage(6);
        dispatch(getCategories());
    }, []);

    useEffect(() => {
        setSearchResult(categoryList);
    }, [categoryList]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <CommonWrapper
            title='Thông tin tác phẩm'
            paging={PAGING_ITEMS}
        >
            <div className={cx('category-container')}>
                <p>Thể loại tác phẩm</p>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Tên thể loại', 'Mô tả']}
                    className={cx('category-container__table')}
                >
                    {currentItems.map((item, index) => (
                        <tr key={index} style={{ height: '46px' }}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.name}</p></td>
                            <td><p className={cx("description")}>{item.description}</p></td>
                        </tr>
                    ))}
                </Table>
                <ActionBar>
                    <ActionBarItem
                        icon={images.edit}
                        title="Chỉnh sửa"
                        onClick={() => navigate(routes.EditCategoryPage)} />
                </ActionBar>
                <Loading loading={loading} />
            </div>
        </CommonWrapper>
    );
};

export default CategoryPage;