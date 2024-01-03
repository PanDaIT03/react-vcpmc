import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { addRole } from "~/state/thunk/role/role";
import { Functional } from "~/types/FunctionalType";

import style from '~/sass/EditRole.module.scss';
const cx = classNames.bind(style);

type FunctionalDetail = {
    id: string;
    name: string;
    code: string;
    functionals: Array<Functional>;
}

function AuthorizedAddRolePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const functional = useSelector((state: RootState) => state.functional);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [functionalsDetail, setFunctionalsDetail] = useState<Array<FunctionalDetail>>([] as Array<FunctionalDetail>);
    const [chooseAll, setChooseAll] = useState<boolean>(false);

    const roleFormik = useFormik({
        initialValues: {
            id: '',
            role: '',
            name: '',
            description: '',
            functionals: [] as Array<Functional>
        },
        validationSchema: Yup.object({
            name: Yup.string().required(),
            description: Yup.string().required(),
            functionals: Yup.array().min(1)
        }),
        onSubmit: values => {
            dispatch(addRole({
                role: {
                    role: values.name,
                    name: values.name,
                    description: values.description,
                    functionalsId: values.functionals.map(functional => functional.docId),
                    allowDelete: true
                },
                navigate: () => navigate(routes.AuthorizedUserPage)
            }));
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: routes.AuthorizedUserPage,
                active: true
            }, {
                title: 'Phân quyền người dùng',
                to: routes.AuthorizedUserPage,
                active: true
            }, {
                title: 'Cập nhật',
                to: '#',
                active: false
            }
        ]);
    }, []);

    useEffect(() => {
        setFunctionalsDetail(functional.typeList.map(type => {
            return {
                id: type.docId,
                code: type.code,
                name: type.name,
                functionals: functional.functionals.filter(functional => functional.functionalTypesId === type.docId)
            }
        }));
    }, [functional]);

    const handleChosenFunctional = (checked: boolean, item: Functional) => {
        const { functionals } = roleFormik.values;

        checked
            ? roleFormik.setFieldValue('functionals', functionals.filter(functional => functional.docId !== item.docId))
            : roleFormik.setFieldValue('functionals', [...functionals, item])
    }

    const handleChooseAll = (checked: boolean) => {
        checked
            ? roleFormik.setFieldValue('functionals', [])
            : roleFormik.setFieldValue('functionals', functional.functionals);

        setChooseAll(!chooseAll);
    }

    return (
        <CommonWrapper
            title='Cập nhật vai trò người dùng'
            paging={paging}
            className={cx('user-role-edit')}
        >
            <form className={cx('user-role-edit__form')}>
                <div className={cx('form__body')}>
                    <div className={cx('form__body__left')}>
                        <Input
                            title={'Tên người dùng:'}
                            type='text'
                            name='name'
                            errorMessage={roleFormik.errors.name}
                            value={roleFormik.values.name}
                            touched={roleFormik.touched.name}
                            onChange={roleFormik.handleChange}
                            onFocus={() => roleFormik.setFieldTouched('name', true)}
                            onBlur={() => roleFormik.setFieldTouched('name', false)}
                        />
                        <Input
                            title='Tên người dùng:'
                            as='textarea'
                            rows={4}
                            cols={6}
                            name='description'
                            errorMessage={roleFormik.errors.description}
                            value={roleFormik.values.description}
                            touched={roleFormik.touched.description}
                            onChange={roleFormik.handleChange}
                            onFocus={() => roleFormik.setFieldTouched('description', true)}
                            onBlur={() => roleFormik.setFieldTouched('description', false)}
                        />
                    </div>
                    <div className={cx('form__body__right')}>
                        <div className={cx('edit__right-container')}>
                            <p>Phân quyền chức năng:</p>
                            <div className={cx('functionals-container')}>
                                <div className={cx('functionals-container__header')}>
                                    <p className={cx('title')}>Tên nhóm chức năng</p>
                                    <Checkbox className={cx('functional-checkbox')} checked={chooseAll} onClick={() => handleChooseAll(chooseAll)} />
                                    <p className={cx('name')}>Chức năng</p>
                                    <p className={cx('code')}>Mã chức năng</p>
                                </div>
                                <div className={cx('functionals-container__body')}>
                                    {functionalsDetail.map(functionalDetail => (
                                        <div key={functionalDetail.id} className={cx('functional-detail-item')}>
                                            <p className={cx('item__type-name')}>{functionalDetail.name}</p>
                                            <div className={cx('item__functional-container')}>
                                                {functionalDetail.functionals.map(item => {
                                                    let checked = typeof roleFormik.values.functionals.find(funcitonal => funcitonal.docId === item.docId) !== 'undefined';

                                                    return (
                                                        <div key={item.docId} className={cx('item')} onClick={() => handleChosenFunctional(checked, item)}>
                                                            <div className={cx('item-name')}>
                                                                <Checkbox className={cx('functional-checkbox')} checked={checked} onClick={() => handleChosenFunctional(checked, item)} />
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <p>{item.code}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('form__action')}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => navigate(routes.AuthorizedUserPage)}
                    />
                    <Button
                        primary
                        fill
                        size="large"
                        value="Lưu"
                        onClick={() => roleFormik.handleSubmit()}
                    />
                </div>
            </form>
            <Loading loading={role.loading} />
        </CommonWrapper>
    );
}

export default AuthorizedAddRolePage;