import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { RootState, useAppDispatch } from "~/state/store";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Button from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Yup } from "~/constants";
import { setExpiredWarningDate } from "~/state/reducer/entrustmentContract";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { routes } from "~/config/routes";

import style from '~/sass/EditWarningExpire.module.scss';
const cx = classNames.bind(style);

function EditWarningExpirePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const { setCurrentPage } = useContext(SidebarContext);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    const contractFormik = useFormik({
        initialValues: {
            exiprationDays: etmContract.expiredWarningDate
        },
        validationSchema: Yup.object({
            exiprationDays: Yup.string().required()
        }),
        onSubmit: values => {
            dispatch(setExpiredWarningDate({
                expirationDate: values.exiprationDays,
                navigate: () => navigate(routes.ManagementContractTypePage)
            }));
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: routes.ManagementContractTypePage,
            }, {
                title: 'Quản lý loại hợp đồng',
                to: routes.ManagementContractTypePage,
            }
        ]);
        setCurrentPage(6);
    }, []);

    return (
        <CommonWrapper
            paging={paging}
            title='Loại hợp đồng'
            className={cx('config-edit-contract')}
        >
            <Form
                className={cx('config-edit-contract__form')}
                handleFormSubmit={contractFormik.handleSubmit}
            >
                <div className={cx('form__body')}>
                    <p className={cx('form__body__title')}>Cảnh báo hết hạn khai thác tác phẩm</p>
                    <div className={cx('form__body__input')}>
                        <p>Hợp đồng được cảnh báo trước thời gian hết hạn:</p>
                        <Input
                            name="exiprationDays"
                            value={contractFormik.values.exiprationDays}
                            errorMessage={contractFormik.errors.exiprationDays}
                            touched={contractFormik.touched.exiprationDays}
                            onChange={(e: any) => contractFormik.setFieldValue('exiprationDays', e.target.value)}
                            onFocus={() => contractFormik.setFieldTouched('expirationDays', true)}
                            onBlur={() => contractFormik.setFieldTouched('expirationDays', false)}
                        />
                        <p>ngày</p>
                    </div>
                </div>
                <div className={cx('form__footer')}>
                    <Button
                        primary
                        value="Hủy"
                        onClick={() => navigate(routes.ManagementContractTypePage)} />
                    <Button
                        primary
                        fill
                        value="Lưu"
                        buttonType='submit'
                        onClick={() => contractFormik.handleSubmit} />
                </div>
            </Form>
        </CommonWrapper>
    );
};

export default EditWarningExpirePage;