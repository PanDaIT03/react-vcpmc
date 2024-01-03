import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { images } from "~/assets";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { changePasswordStatusUser } from "~/state/thunk/user/user";
import { UserInfo } from "~/types/UserType";
import { BlockDetail } from "~/components/BlockDetail";
import Button from "~/components/Button";
import { Loading } from "~/components/Loading";
import { RadioButton } from "~/components/RadioButton";
import { CB_ROLES } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { IGlobalConstantsType } from "~/types";

import style from '~/sass/EditAuthorizedPartner.module.scss';
const cx = classNames.bind(style);

const initialState: IGlobalConstantsType[] = [{
    id: 0,
    title: ''
}];

function EditAuthorizedPartnerPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const PAGING_ITEMS: PagingItemType[] = [
        {
            title: 'Quản lý',
            to: routes.AuthorizedPartnerPage,
            active: true
        }, {
            title: 'Đối tác uỷ quyền',
            to: routes.AuthorizedPartnerPage,
            active: true
        }, {
            title: 'Cập nhật thông tin người dùng',
            to: `/authorized-contract-management/edit/${id}`,
            active: true
        }
    ];

    const authorizedContract = useSelector((state: RootState) => state.authorized);
    const { loading } = useSelector((state: RootState) => state.user);

    const { setActive } = useContext(SidebarContext);
    const [isPassword, setIsPassword] = useState(true);
    const [isCPassword, setIsCPassword] = useState(true);

    const [userInputs, setUserInputs] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);
    const [roleValue, setRoleValue] = useState<IGlobalConstantsType>(initialState[0]);

    const userFormik = useFormik({
        initialValues: {
            docId: '',
            userName: '',
            email: '',
            phoneNumber: '',
            rolesId: '',
            firstName: '',
            lastName: '',
            fullName: '',
            confirmPassword: '',
            status: ''
        } as UserInfo,
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            email: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            rolesId: Yup.string().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            fullName: Yup.string().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        }),
        onSubmit: values => {
            const { password, status, docId } = values;

            dispatch(changePasswordStatusUser({ docId: docId, password: password, status: status, navigate: () => navigate(routes.AuthorizedPartnerPage) }));
        }
    });

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (authorizedContract.contracts.length <= 0) return;

        const authorizedContractCurrent = authorizedContract.contracts.find(contract =>
            contract.docId === id);
        const userInfo = authorizedContractCurrent?.authorizedPerson || {} as UserInfo;

        userFormik.setValues({
            ...userInfo,
            status: userInfo.status || '',
            fullName: `${userInfo.firstName} ${userInfo.lastName}`,
            confirmPassword: ''
        });
    }, [authorizedContract.contracts]);

    useEffect(() => {
        setUserInputs([
            {
                id: 1,
                title: 'Tên người dùng',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    name='fullName'
                    errorMessage={userFormik.errors.fullName}
                    value={userFormik.values.fullName}
                    size="medium"
                    touched={userFormik.touched.fullName}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('fullName', true)}
                    onBlur={() => userFormik.setFieldTouched('fullName', false)}
                />
            }, {
                id: 2,
                title: 'Email',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    name='email'
                    errorMessage={userFormik.errors.email}
                    value={userFormik.values.email}
                    size="medium"
                    touched={userFormik.touched.email}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('email', true)}
                    onBlur={() => userFormik.setFieldTouched('email', false)}
                />
            }, {
                id: 3,
                title: 'Số điện thoại',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    name='phoneNumber'
                    errorMessage={userFormik.errors.phoneNumber}
                    size="medium"
                    value={userFormik.values.phoneNumber}
                    touched={userFormik.touched.phoneNumber}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('phoneNumber', true)}
                    onBlur={() => userFormik.setFieldTouched('phoneNumber', false)}
                />
            }, {
                id: 4,
                title: 'Vai trò',
                isRequired: true,
                tag:
                    <OptionMenu
                        data={CB_ROLES}
                        editable={true}
                        setState={setRoleValue}
                        borderColor="var(--text-stroke-text-and-stroke-2)"
                    />
            }, {
                id: 5,
                title: 'Tên đăng nhập',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    name='userName'
                    errorMessage={userFormik.errors.userName}
                    value={userFormik.values.userName}
                    size="medium"
                    touched={userFormik.touched.userName}
                    onChange={() => { }}
                    onFocus={() => userFormik.setFieldTouched('userName', true)}
                    onBlur={() => userFormik.setFieldTouched('userName', false)}
                />
            }, {
                id: 6,
                title: 'Mật khẩu',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    type={isPassword ? 'password' : 'text'}
                    name='password'
                    size="medium"
                    errorMessage={userFormik.errors.password}
                    value={userFormik.values.password}
                    touched={userFormik.touched.password}
                    onChange={userFormik.handleChange}
                    onFocus={() => userFormik.setFieldTouched('password', true)}
                    onBlur={() => userFormik.setFieldTouched('password', false)}
                    iconRight={images.eye}
                    onIconRightClick={() => setIsPassword(!isPassword)}
                />
            }, {
                id: 7,
                title: 'Nhập lại mật khẩu',
                isRequired: true,
                tag: <Input
                    isRequire={true}
                    type={isCPassword ? 'password' : 'text'}
                    name='confirmPassword'
                    size="medium"
                    errorMessage={userFormik.errors.confirmPassword}
                    value={userFormik.values.confirmPassword}
                    touched={userFormik.touched.confirmPassword}
                    onChange={userFormik.handleChange}
                    onFocus={() => userFormik.setFieldTouched('confirmPassword', true)}
                    onBlur={() => userFormik.setFieldTouched('confirmPassword', false)}
                    iconRight={images.eye}
                    onIconRightClick={() => setIsCPassword(!isCPassword)}
                />
            }, {
                id: 8,
                title: 'Trạng thái',
                isRequired: true,
                tag:
                    <div className={cx('form-group-checkbox')}>
                        <RadioButton
                            title='Đã kích hoạt'
                            checked={userFormik.values.status === 'active'}
                            onClick={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                        <RadioButton
                            title='Ngưng kích hoạt'
                            checked={userFormik.values.status !== 'active'}
                            onClick={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                    </div>
            }
        ]);
    }, [userFormik.values, isPassword, isCPassword]);

    console.log(userFormik.errors);

    return (
        <div className={cx('authorized-contract-edit')}>
            <CommonWrapper
                paging={PAGING_ITEMS}
                title='Cập nhật thông tin'
            >
                <form className={cx('edit__form-container')} onSubmit={userFormik.handleSubmit}>
                    <div className={cx('edit__form-container__body')}>
                        <div className={cx('edit__form-container__left')}>
                            <BlockDetail maxWidth="custom" editable={true} data={userInputs.slice(0, 4)} />
                        </div>
                        <div className={cx('edit__form-container__right')}>
                            <BlockDetail className={cx("mg-0")} maxWidth="custom" editable={true} data={userInputs.slice(4, 8)} />
                        </div>
                    </div>
                    <div className={cx('edit__form-container__action')}>
                        <Button primary size="large" value='Hủy' onClick={() => navigate(routes.AuthorizedPartnerPage)} />
                        <Button primary size="large" fill value='Lưu' buttonType='submit' />
                    </div>
                </form>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default EditAuthorizedPartnerPage;

function navigate(AuthorizedContract: any) {
    throw new Error("Function not implemented.");
}
