import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { addCategory, getCategories, updateCategories } from "~/state/thunk/category";
import { ICategory } from "~/types/CategoryType";

import style from '~/sass/EditCategory.module.scss';
const cx = classNames.bind(style);

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Cài đặt hệ thống',
        to: routes.CategoryPage,
        active: true
    }, {
        title: 'Chỉnh sửa thông tin',
        to: '#',
        active: true
    }
];

function EditCategoryPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { categoryList, loading } = useSelector((state: RootState) => state.category);

    // const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [currentItems, setCurrentItems] = useState<ICategory[]>([] as ICategory[]);
    const [itemActive, setItemActive] = useState<ICategory>({
        docId: '',
        name: '',
        description: ''
    });
    const [itemsPerPage, setItemsPerPage] = useState<string>('10');
    const [actionData, setActionData] = useState<any[]>([] as any[]);

    const categoryFormik = useFormik({
        initialValues: {
            categories: [] as ICategory[],
            type: 'edit'
        },
        onSubmit: async (values) => {
            if (values.type === 'edit') {
                dispatch(updateCategories({
                    categories: values.categories,
                    navigate: () => navigate(routes.CategoryPage)
                }));
                return;
            };

            await dispatch(addCategory({ category: itemActive }));
            categoryFormik.setFieldValue('type', 'edit');

            categoryFormik.setErrors(categoryFormik.initialErrors);
            categoryFormik.setTouched(categoryFormik.initialTouched);
        }
    });

    useEffect(() => {
        categoryList.length <= 0 && dispatch(getCategories());
    }, []);

    useEffect(() => {
        categoryFormik.setFieldValue('categories', categoryList);
        setItemActive(categoryList[0]);
    }, [categoryList]);

    useEffect(() => {
        if (!categoryFormik.values.categories.length) return;

        categoryFormik.setFieldValue('categories', categoryFormik.values.categories.map(category => {
            if (category.docId === itemActive.docId)
                return itemActive;
            return category;
        }));
    }, [itemActive]);

    const handleAddNewCategory = useCallback((categories: ICategory[]) => {
        const newCategory = { docId: '0', name: '', description: '' };

        categoryFormik.setValues({ categories: [...categories, newCategory], type: 'add' });
        setItemActive(newCategory);
        setActionData([]);
    }, []);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleCancelAction = useCallback(() => {
        categoryFormik.values.type === 'edit'
            ? navigate(routes.CategoryPage)
            : categoryFormik.setValues({
                type: 'edit',
                categories: categoryFormik.values.categories.filter(category => category.docId !== '0')
            })
    }, [categoryFormik.values.type]);

    return (
        <CommonWrapper
            title='Thông tin tác phẩm'
            paging={PAGING_ITEMS}
        // actionData={categoryFormik.values.type === 'edit' ? actionData : []}
        >
            <Form className={cx('category-form')} handleFormSubmit={categoryFormik.handleSubmit}>
                <p className={cx("title")}>Thể loại tác phẩm</p>
                <Table
                    // paginate={{
                    //     dataForPaginate: categoryFormik.values.categories,
                    //     setCurrentItems: handleSetCurrentItems
                    // }}
                    // loading={category.loading}
                    // itemsPerPage={itemsPerPage}
                    // setItemsPerPage={handleChange}
                    thead={['STT', 'Tên thể loại', 'Mô tả']}
                    className={cx('category-form__table')}
                // paginateClass={cx('table__row__paginate')}
                >
                    {categoryList.map((item, index) => {
                        return (
                            itemActive.docId !== item.docId
                                ? <tr
                                    key={item.docId}
                                    style={{ height: '46px' }}
                                    onClick={() => setItemActive(item)}
                                >
                                    <td><p>{index + 1}</p></td>
                                    <td><p>{item.name}</p></td>
                                    <td><p>{item.description}</p></td>
                                </tr>
                                : <tr key={item.docId} style={{ height: '46px' }} className={cx('table__row__edit')}>
                                    <td><p>{index + 1}</p></td>
                                    <td>
                                        <Input
                                            name={itemActive.name}
                                            value={itemActive.name}
                                            onChange={(e: any) => setItemActive({ ...itemActive, name: e.target.value })} />
                                    </td>
                                    <td>
                                        <Input
                                            name={itemActive.description}
                                            value={itemActive.description}
                                            onChange={(e: any) => setItemActive({ ...itemActive, description: e.target.value })} />
                                    </td>
                                </tr>
                        )
                    })}
                </Table>
                <div className={cx('category-form__action')}>
                    <Button
                        primary
                        value="Hủy"
                        onClick={handleCancelAction} />
                    <Button primary fill value="Lưu" buttonType='submit' />
                </div>
                <ActionBar>
                    <ActionBarItem
                        icon={images.addPlaylistIcon}
                        title="Thêm mới"
                        onClick={() => handleAddNewCategory(categoryFormik.values.categories)} />
                </ActionBar>
            </Form>
        </CommonWrapper>
    );
};

export default EditCategoryPage;