import classNames from "classnames/bind";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";

import Button from "~/components/Button";
import { images } from "~/assets";
import { IUser } from "~/types";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { ActionBar } from "~/components/ActionBar";
import { RootState, useAppDispatch } from "~/state";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { resetPasswordAction, updateUserAction } from "~/state/thunk/user/user";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { Toast } from "~/components/Toast";

import styles from "~/sass/BasicInfomation.module.scss";
const cx = classNames.bind(styles);

const initialPasswordValue = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
};

function ProfilePage() {
    const dispatch = useAppDispatch();

    const firstNameRef = useRef<HTMLDivElement>(null);
    const passwordRef = useRef<HTMLDivElement>(null);

    const { setActive } = useContext(SidebarContext);
    const [isNewPassword, setIsNewPassword] = useState(true);
    const [isCurrentPassword, setIsCurrentPassword] = useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = useState(true);

    const [isChangePass, setIsChangePass] = useState(false);
    const [isChangePassSuccess, setIsChangePassSuccess] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser, status, loading } = userState;

    console.log(currentUser);

    const initialInfoVales = {
        id: currentUser.docId,
        avatar: currentUser.avatar,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dateOfBirth: currentUser.dateOfBirth,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        displayName: currentUser.userName,
        role: currentUser.role
    };

    const infoFormik = useFormik({
        initialValues: initialInfoVales,
        validationSchema: Yup.object({
            avatar: Yup.string().required(),
            dateOfBirth: Yup.string().required().matches(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/, "not match"),
            firstName: Yup.string().required().matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/),
            lastName: Yup.string().required().matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "phone not match"),
        }),
        onSubmit: (values) => {
            const data: Omit<IUser, "email" | "userName" |
                "password" | "rolesId" | "role"> = {
                docId: values.id,
                avatar: values.avatar,
                firstName: values.firstName,
                lastName: values.lastName,
                dateOfBirth: values.dateOfBirth,
                phoneNumber: values.phoneNumber,
            };
            dispatch(updateUserAction(data));
        }
    });
    const {
        errors: infoErros,
        values: infoValues,
        touched: infoTouched,
        setFieldTouched: infoSetFieldTouched,
        handleChange: handleChangeInfoForm,
        handleSubmit: handleSubmitInfoForm } = infoFormik;

    const passwordFormik = useFormik({
        initialValues: initialPasswordValue,
        validationSchema: Yup.object({
            currentPassword: Yup.string().required().min(8),
            newPassword: Yup.string().required().min(8),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'not match')
                .required()
        }),
        onSubmit: (values) => {
            if (values.currentPassword !== currentUser.password) {
                setErrorMessage("Mật khẩu không chính xác");
                return;
            };

            dispatch(resetPasswordAction({ id: currentUser.docId, password: values.confirmPassword }));
            setErrorMessage('');
        }
    });
    const {
        errors: passwordErros,
        values: passwordValues,
        touched: passwordTouched,
        handleChange: handleChangePasswordForm,
        handleSubmit: handleSubmitPasswordForm } = passwordFormik;

    useEffect(() => {
        setActive(true);
    }, []);

    useEffect(() => {
        if (status === "user updated")
            setIsEditInfo(false);
    }, [userState]);

    useEffect(() => {
        if (status === "user updated") {
            setIsChangePassSuccess(true);
            setIsChangePass(false);
        };
    }, [currentUser.password]);

    useEffect(() => {
        if (isChangePassSuccess) {
            const timerId = isChangePassSuccess && setTimeout(() => {
                setIsChangePassSuccess(false);
            }, 800);

            return () => {
                clearTimeout(timerId);
            };
        };
    }, [isChangePassSuccess]);

    useEffect(() => {
        if (passwordErros.confirmPassword === "not match")
            setErrorMessage("Mật khẩu không khớp");
        else
            setErrorMessage("");
    }, [passwordErros]);

    const regexp = new RegExp(`^-?[0-9]*$`);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (regexp.test(event.target.value))
            handleChangeInfoForm(event);
    };

    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("content")}>
                    <h2 className={cx("title")}>Thông tin cơ bản</h2>
                    <div className={cx("user-info")}>
                        <div className={cx("user-info_left")}>
                            <div className={cx("avatar")}>
                                <img src={`${infoValues.avatar}`} className={cx("avatar-img")} alt="avatar" />
                                <img src={images.camera} className={cx("icon-camera")} alt="camera" />
                            </div>
                            <p className={cx("user-name")}>{currentUser.firstName} {currentUser.lastName}</p>
                        </div>
                        <div className={cx("user-info_right")}>
                            <Form
                                className={cx("form-info")}
                                handleFormSubmit={handleSubmitInfoForm}
                            >
                                <div className={cx("form-row")}>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        title="Họ"
                                        size="small"
                                        inputRef={firstNameRef}
                                        readOnly={isEditInfo ? false : true}
                                        value={infoValues.firstName}
                                        errorMessage={infoErros.firstName}
                                        touched={infoTouched.firstName}
                                        onChange={handleChangeInfoForm}
                                    />
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        title="Tên"
                                        size="small"
                                        value={infoValues.lastName}
                                        readOnly={isEditInfo ? false : true}
                                        errorMessage={infoErros.lastName}
                                        onChange={handleChangeInfoForm}
                                    />
                                </div>
                                <div className={cx("form-row")}>
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        title="Ngày sinh"
                                        size="small"
                                        value={infoValues.dateOfBirth}
                                        readOnly={isEditInfo ? false : true}
                                        errorMessage={infoErros.dateOfBirth}
                                        onChange={handleChangeInfoForm}
                                    />
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        title="Số điện thoại"
                                        size="small"
                                        value={infoValues.phoneNumber}
                                        readOnly={isEditInfo ? false : true}
                                        errorMessage={infoErros.phoneNumber}
                                        onChange={(event) => handleInputChange(event)}
                                    />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    title="Email"
                                    status="disable"
                                    size="large"
                                    readOnly={true}
                                    value={infoValues.email}
                                    className={cx("form-row-full")}
                                />
                                <Input
                                    id="displayName"
                                    name="displayName"
                                    title="Tên đăng nhập"
                                    status="disable"
                                    size="large"
                                    readOnly={true}
                                    className={cx("form-row-full")}
                                    value={infoValues.displayName}
                                />
                                <Input
                                    id="role"
                                    name="role"
                                    title="Phân quyền"
                                    status="disable"
                                    size="small"
                                    readOnly={true}
                                    className={cx("form-row-full", "--capitalize")}
                                    value={infoValues.role || ""}
                                />
                            </Form>
                        </div>
                        <ActionBar visible={!isEditInfo && !isChangePass}>
                            <ActionBarItem
                                icon={images.edit}
                                title="Sửa thông tin"
                                onClick={() => {
                                    setIsEditInfo(true);
                                    firstNameRef.current?.focus();
                                }}
                            />
                            <ActionBarItem
                                icon={images.lock}
                                title="Đổi mật khẩu"
                                onClick={() => {
                                    setIsChangePass(true);
                                    passwordRef.current?.focus();
                                }}
                            />
                            <ActionBarItem
                                icon={images.logOut}
                                title="Đăng xuất"
                            />
                        </ActionBar>
                    </div>
                </div>
                <div className={cx("button-actions", isEditInfo && "active")}>
                    <Button
                        primary
                        value="Huỷ"
                        size="large"
                        buttonType="button"
                        onClick={() => setIsEditInfo(false)}
                    />
                    <Button
                        value="Lưu"
                        primary
                        fill
                        size="large"
                        buttonType="submit"
                        loading={loading}
                        onClick={() => handleSubmitInfoForm()}
                    />
                </div>
                <Toast message="Đổi mật khẩu thành công!" visible={isChangePassSuccess} />
                <div className={cx("form-dialog")}>
                    <Form
                        className={cx("form-change-password")}
                        type="dialog"
                        visible={isChangePass ? "visible" : "invisible"}
                        handleFormSubmit={handleSubmitPasswordForm}
                    >
                        <div className={cx("title")}>Thay đổi mật khẩu</div>
                        <div className={cx("form-block")}>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                title="Mật khẩu hiện tại"
                                status={loading ? "disable" : "editable"}
                                type={isCurrentPassword ? "password" : "text"}
                                value={passwordValues.currentPassword}
                                touched={passwordTouched.currentPassword}
                                inputRef={passwordRef}
                                iconRight={images.eye}
                                errorMessage={passwordErros.currentPassword}
                                onChange={handleChangePasswordForm}
                                onIconRightClick={() => setIsCurrentPassword(!isCurrentPassword)}
                            />
                            <Input
                                id="newPassword"
                                name="newPassword"
                                title="Mật khẩu mới"
                                status={loading ? "disable" : "editable"}
                                type={isNewPassword ? "password" : "text"}
                                value={passwordValues.newPassword}
                                touched={passwordTouched.newPassword}
                                iconRight={images.eye}
                                errorMessage={passwordErros.newPassword}
                                onChange={handleChangePasswordForm}
                                onIconRightClick={() => setIsNewPassword(!isNewPassword)}
                            />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                title="Nhập lại mật khẩu mới"
                                status={loading ? "disable" : "editable"}
                                type={isConfirmPassword ? "password" : "text"}
                                value={passwordValues.confirmPassword}
                                touched={passwordTouched.confirmPassword}
                                iconRight={images.eye}
                                errorMessage={passwordErros.confirmPassword}
                                onChange={handleChangePasswordForm}
                                onIconRightClick={() => setIsConfirmPassword(!isConfirmPassword)}
                            />

                            <div className={cx("error-message")} style={{ height: "2.4rem" }}>
                                {errorMessage}
                            </div>
                        </div>
                        <div className={cx("form-button-actions")}>
                            <Button
                                value="Huỷ"
                                primary
                                size="large"
                                buttonType="submit"
                                onClick={() => setIsChangePass(false)}
                            />
                            <Button
                                value="Lưu"
                                primary
                                fill
                                size="large"
                                buttonType="submit"
                                loading={loading}
                                onClick={() => handleSubmitPasswordForm()}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;