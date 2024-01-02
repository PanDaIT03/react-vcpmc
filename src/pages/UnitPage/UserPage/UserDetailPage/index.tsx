import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { BlockDetail } from "~/components/BlockDetail";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { getUsers } from "~/state/thunk/user/user";
import { IGlobalConstantsType, IRole, User, UserInfo } from "~/types";

import { useFormik } from "formik";
import { Input } from "~/components/Input";
import { OptionMenu } from "~/components/OptionMenu";
import { RadioButton } from "~/components/RadioButton";
import { Yup } from "~/constants";
import { updateEmployee } from "~/state/thunk/entrustmentContractThunk";

import Button from "~/components/Button";
import { Loading } from "~/components/Loading";
import style from '~/sass/UserOfUnitDetail.module.scss';
const cx = classNames.bind(style);

function UserOfUnitDetailPage() {
    const { userId, contractId } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);
    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [editable, setEditable] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<IGlobalConstantsType>({ id: '', title: '' });
    const [passwordType, setPasswordType] = useState<{ password: boolean; confirmPassword: boolean }>({ password: true, confirmPassword: true, });

    const userFormik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            rolesId: '',
            fullName: '',
            password: '',
            confirmPassword: '',
            status: 'active'
        } as Omit<UserInfo, 'id' | 'phoneNumber' | 'lastName' | 'firstName'>,
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            email: Yup.string().required(),
            rolesId: Yup.string().required(),
            fullName: Yup.string().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        }),
        onSubmit: async (values) => {
            const fullNameSplit = values.fullName.split(' ');
            const id = userId;

            if (typeof id === 'undefined') return;

            await dispatch(updateEmployee({
                user: {
                    docId: id,
                    avatar: '',
                    bank: '',
                    bankNumber: '',
                    dateOfBirth: '',
                    dateRange: '',
                    email: values.email,
                    firstName: fullNameSplit[0],
                    gender: '',
                    idNumber: '',
                    issuedBy: '',
                    lastName: fullNameSplit[fullNameSplit.length - 1],
                    nationality: '',
                    password: values.password,
                    phoneNumber: '',
                    residence: '',
                    rolesId: values.rolesId,
                    taxCode: '',
                    userName: values.userName,
                    companyName: '',
                    status: values.status,
                    expirationDate: '',
                }
            }));

            setEditable(false);
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Quản lý',
                to: routes.UnitUsedManagementPage,
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: routes.UnitUsedManagementPage,
                active: true
            }, {
                title: 'Chi tiết',
                to: `/unit-used-management/detail/${contractId}`,
                active: false
            }, {
                title: 'Thông tin người dùng',
                to: '#',
                active: true
            }
        ]);

        !user.users.length && dispatch(getUsers());
    }, []);

    useEffect(() => {
        const currentUser = user.users.find(user => user.docId === userId);

        if (typeof currentUser === 'undefined') return;

        userFormik.setValues({
            ...userFormik.values,
            userName: currentUser.userName,
            email: currentUser.email,
            fullName: `${currentUser.firstName} ${currentUser.lastName}`,
            password: currentUser.password,
            status: currentUser.status || 'active',
            rolesId: currentUser.role.docId,
            confirmPassword: currentUser.password
        });

        const currentRole: IRole = role.roles.find(role => role.docId === currentUser.rolesId) || { docId: '', role: '' };
        setUserRole({
            id: currentRole.docId,
            title: currentRole.role
        });
    }, [user.users]);

    useEffect(() => {
        userFormik.setFieldValue('rolesId', userRole.id);
    }, [userRole]);

    const USER_INFO_ITEMS = [
        {
            children: [
                {
                    id: 1,
                    title: 'Tên người dùng:',
                    tag: <div>{userFormik.values.fullName}</div>
                }, {
                    id: 2,
                    title: 'Vai trò:',
                    tag: <div>{role.roles.find(role => role.docId === userFormik.values.rolesId)?.role || ''}</div>
                }, {
                    id: 3,
                    title: 'Email:',
                    tag: <div>{userFormik.values.email}</div>
                }
            ]
        },
        {
            children: [
                {
                    id: 1,
                    title: 'Tên đăng nhập:',
                    tag: <div>{userFormik.values.userName}</div>
                }, {
                    id: 2,
                    title: 'Mật khẩu:',
                    tag: <div>{userFormik.values.password}</div>
                }, {
                    id: 3,
                    title: 'Trạng thái thiết bị:',
                    tag: <div>{userFormik.values.status === 'active' ? 'Đã kích hoạt' : 'Ngưng kích hoạt'}</div>
                }
            ]
        }
    ];

    const USER_INPUT_ITEMS = [
        {
            children: [
                {
                    id: 1,
                    title: 'Tên người dùng:',
                    tag: <Input
                        id="fullName"
                        type='text'
                        name='fullName'
                        size="small-pl"
                        value={userFormik.values.fullName}
                        errorMessage={userFormik.errors.fullName}
                        touched={userFormik.touched.fullName}
                        onChange={userFormik.handleChange}
                        onFocus={() => userFormik.setFieldTouched('fullName', true)}
                        onBlur={() => userFormik.setFieldTouched('fullName', false)}
                    />
                }, {
                    id: 2,
                    title: 'Email:',
                    tag: <Input
                        id="email"
                        type='text'
                        name='email'
                        size="small-pl"
                        value={userFormik.values.email}
                        errorMessage={userFormik.errors.email}
                        touched={userFormik.touched.email}
                        onChange={userFormik.handleChange}
                        onFocus={() => userFormik.setFieldTouched('email', true)}
                        onBlur={() => userFormik.setFieldTouched('email', false)}
                    />
                }, {
                    id: 3,
                    title: 'Vai trò:',
                    tag: <OptionMenu
                        data={role.roles.map(role => ({
                            id: role.docId,
                            title: role.role
                        }))}
                        state={userRole}
                        setState={setUserRole}
                        className={cx('form__body__combobox-role')}
                    />
                }
            ]
        },
        {
            children: [
                {
                    id: 1,
                    title: 'Tên đăng nhập:',
                    tag: <Input
                        id="userName"
                        type='text'
                        name='userName'
                        size="small-pl"
                        value={userFormik.values.userName}
                        errorMessage={userFormik.errors.userName}
                        touched={userFormik.touched.userName}
                        onChange={userFormik.handleChange}
                        onFocus={() => userFormik.setFieldTouched('userName', true)}
                        onBlur={() => userFormik.setFieldTouched('userName', false)}
                    />
                }, {
                    id: 2,
                    title: 'Mật khẩu:',
                    tag: <Input
                        id="password"
                        type={passwordType.password ? 'password' : 'text'}
                        name='password'
                        size="small-pl"
                        value={userFormik.values.password}
                        errorMessage={userFormik.errors.password}
                        touched={userFormik.touched.password}
                        onChange={userFormik.handleChange}
                        iconRight={images.eye}
                        onIconRightClick={() => setPasswordType({
                            ...passwordType,
                            password: !passwordType.password
                        })}
                        onFocus={() => userFormik.setFieldTouched('password', true)}
                        onBlur={() => userFormik.setFieldTouched('password', false)}
                    />
                }, {
                    id: 3,
                    title: 'Nhập lại mật khẩu',
                    tag: <Input
                        id="confirmPassword"
                        type={passwordType.confirmPassword ? 'password' : 'text'}
                        name='confirmPassword'
                        size="small-pl"
                        value={userFormik.values.confirmPassword}
                        errorMessage={userFormik.errors.confirmPassword}
                        touched={userFormik.touched.confirmPassword}
                        onChange={userFormik.handleChange}
                        iconRight={images.eye}
                        onIconRightClick={() => setPasswordType({
                            ...passwordType,
                            confirmPassword: !passwordType.confirmPassword
                        })}
                        onFocus={() => userFormik.setFieldTouched('confirmPassword', true)}
                        onBlur={() => userFormik.setFieldTouched('confirmPassword', false)}
                    />
                }
            ]
        }
    ];

    return (
        <CommonWrapper
            paging={paging}
            title='Thông tin người dùng'
        >
            <form className={cx('form__body')}>
                {!editable
                    ? USER_INFO_ITEMS.map((item, index) =>
                        <BlockDetail key={index} editable={false} data={item.children} />)
                    : USER_INPUT_ITEMS.map((item, index) =>
                        <BlockDetail key={index} editable={true} data={item.children} />)
                }
            </form>
            {editable && <div className={cx('form__action')}>
                <Button
                    primary
                    size="large"
                    value="Huỷ"
                    onClick={() => setEditable(false)}
                />
                <Button
                    primary
                    fill
                    size="large"
                    value="Lưu"
                    onClick={() => userFormik.handleSubmit()}
                />
            </div>}
            {!editable &&
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Chỉnh sửa"
                        icon={images.edit}
                        onClick={() => setEditable(true)}
                    />
                </ActionBar>
            }
            <Loading loading={etmContract.loading} />
        </CommonWrapper>
    );
}

export default UserOfUnitDetailPage;