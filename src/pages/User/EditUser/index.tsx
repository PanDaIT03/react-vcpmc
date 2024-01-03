import classNames from "classnames/bind";
import { useFormik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { images } from "~/assets";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { routes } from "~/config/routes";
import { Yup, formatDateDMYHPTS, formatDateYMD } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { getRoleList } from "~/state/thunk/role/role";
import { saveUser } from "~/state/thunk/user/user";
import { IGlobalConstantsType, Role, User } from "~/types";

import style from '~/sass/EditUser.module.scss';
const cx = classNames.bind(style);

function EditUserPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [roleActive, setRoleActive] = useState<IGlobalConstantsType>({ id: 0, title: '' });
    const [isPassword, setIsPassword] = useState<boolean>(true);

    const userFormik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            phoneNumber: '',
            rolesId: '',
            userName: '',
            status: '',
            fullName: '',
            role: {} as Pick<Role, 'docId' | 'name'>
        } as User & { fullName: string },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            rolesId: Yup.string().required(),
            userName: Yup.string().required("Không được để trống"),
            fullName: Yup.string().required()
        }),
        onSubmit: async values => {
            const fullNameArray = values.fullName.split(' ');

            const user = {
                avatar: values.avatar,
                bank: values.bank,
                bankNumber: values.bankNumber,
                dateOfBirth: values.dateOfBirth,
                dateRange: values.dateRange,
                email: values.email,
                gender: values.gender,
                idNumber: values.idNumber,
                issuedBy: values.issuedBy,
                nationality: values.nationality,
                password: values.password,
                phoneNumber: values.phoneNumber,
                residence: values.residence,
                rolesId: values.rolesId,
                taxCode: values.taxCode,
                userName: values.userName,
                docId: values.docId,
                companyName: values.companyName || '',
                status: values.status,
                firstName: fullNameArray[0],
                lastName: fullNameArray[fullNameArray.length - 1],
                expirationDate: formatDateDMYHPTS(values.expirationDate || 'yyyy/MM/dd'),
            };

            dispatch(saveUser({ user: user, navigate: () => navigate(routes.AuthorizedUserPage) }));
        }
    });

    console.log(userFormik.values);

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
                title: 'Phân quyền người dùng',
                to: '#',
                active: false
            }
        ]);

        role.roleDetails.length <= 0 && dispatch(getRoleList());
    }, []);

    useEffect(() => {
        if (user.users.length === 0) return;

        let currentUser = user.users.find(user => user.docId === id);

        if (typeof currentUser !== 'undefined')
            userFormik.setValues({
                ...currentUser,
                fullName: `${currentUser.firstName} ${currentUser.lastName}`,
                expirationDate: formatDateYMD(currentUser.expirationDate || 'yyyy/MM/dd')
            } || {} as User);

        let currentRole = role.roleDetails.find(role => role.docId === currentUser?.rolesId);

        if (typeof currentRole !== 'undefined')
            setRoleActive({
                id: parseInt(currentRole.docId),
                title: currentRole.name
            });
    }, [user.users]);

    const USER_INPUTS: {
        title: string;
        isRequire?: boolean;
        name: string;
        type?: "text" | "password" | 'date';
        size?: 'custom';
        errorMessage?: string;
        value: string;
        touched?: boolean;
        iconRight?: string;
        onIconRightClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
        onChange(e: ChangeEvent<any>): void;
        onFocus: () => void;
        onBlur: () => void;
    }[] = [
            {
                title: 'Tên người dùng:',
                isRequire: true,
                type: 'text',
                name: 'fullName',
                errorMessage: userFormik.errors.fullName,
                value: userFormik.values.fullName,
                touched: userFormik.touched.fullName,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('fullName', true),
                onBlur: () => userFormik.setFieldTouched('fullName', false)
            }, {
                title: 'Số điện thoại:',
                isRequire: true,
                type: 'text',
                name: 'phoneNumber',
                errorMessage: userFormik.errors.phoneNumber,
                value: userFormik.values.phoneNumber,
                touched: userFormik.touched.phoneNumber,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('phoneNumber', true),
                onBlur: () => userFormik.setFieldTouched('phoneNumber', false)
            }, {
                title: 'Ngày hết hạn:',
                isRequire: true,
                type: 'date',
                name: 'expirationDate',
                errorMessage: userFormik.errors.expirationDate,
                value: userFormik.values.expirationDate || '',
                touched: userFormik.touched.expirationDate,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('expirationDate', true),
                onBlur: () => userFormik.setFieldTouched('expirationDate', false)
            }, {
                title: 'Email:',
                isRequire: true,
                type: 'text',
                name: 'email',
                errorMessage: userFormik.errors.email,
                value: userFormik.values.email,
                touched: userFormik.touched.email,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('email', true),
                onBlur: () => userFormik.setFieldTouched('email', false)
            }, {
                title: 'Tên đăng nhập:',
                isRequire: true,
                type: 'text',
                name: 'userName',
                errorMessage: userFormik.errors.userName,
                value: userFormik.values.userName,
                touched: userFormik.touched.userName,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('userName', true),
                onBlur: () => userFormik.setFieldTouched('userName', false)
            }, {
                title: 'Mật khẩu:',
                isRequire: true,
                size: 'custom',
                type: isPassword ? 'password' : 'text',
                name: 'password',
                iconRight: images.eye,
                onIconRightClick: () => setIsPassword(!isPassword),
                errorMessage: userFormik.errors.password,
                value: userFormik.values.password,
                touched: userFormik.touched.password,
                onChange: userFormik.handleChange,
                onFocus: () => userFormik.setFieldTouched('password', true),
                onBlur: () => userFormik.setFieldTouched('password', false)
            }
        ];

    useEffect(() => {
        let currentRole = role.roleDetails.find(role => role.docId === roleActive.id.toString());

        if (typeof currentRole !== 'undefined')
            userFormik.setValues({
                ...userFormik.values,
                role: { docId: currentRole.docId, name: currentRole.name },
                rolesId: currentRole.docId
            });
    }, [roleActive]);

    return (
        <CommonWrapper
            title='Chỉnh sửa thông tin người dùng'
            paging={paging}
            className={cx('user-edit-container')}
        >
            <form onSubmit={userFormik.handleSubmit}>
                <div className={cx('form__body')}>
                    <div className={cx('form__left')}>
                        {USER_INPUTS.slice(0, 3).map(input => <Input key={input.title} {...input} />)}
                        <div className={cx('form__left__role')}>
                            <p>Vai trò: <span>*</span></p>
                            <OptionMenu
                                data={role.roleDetails.map(role => ({
                                    id: parseInt(role.docId),
                                    title: role.name
                                }))}
                                state={roleActive}
                                setState={setRoleActive}
                                className={cx('form__left__role__form-group')}
                            />
                        </div>
                    </div>
                    <div className={cx('form__right')}>
                        {USER_INPUTS.slice(3, 5).map(input => <Input key={input.title} {...input} />)}
                        <div className={cx('form__right__password')}><Input {...USER_INPUTS[USER_INPUTS.length - 1]} /></div>
                        <div>
                            <p>Trạng thái <span>*</span></p>
                            <div className={cx('form__right__group-checkbox')}>
                                <RadioButton title='Đang hoạt động' checked={userFormik.values.status === 'active'} onClick={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
                                <RadioButton title='Ngừng hoạt động' checked={userFormik.values.status !== 'active'} onClick={() => userFormik.setFieldValue('status', userFormik.values.status === 'active' ? 'deactive' : 'active')} />
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
                        onClick={() => userFormik.handleSubmit()}
                    />
                </div>
            </form>
            <Loading loading={user.loading} />
        </CommonWrapper>
    );
}

export default EditUserPage;