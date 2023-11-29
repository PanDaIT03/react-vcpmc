import classNames from "classnames/bind";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";

import Button from "~/component/Button";
import { IUser } from "~/types";
import { Form } from "~/component/Form";
import { Input } from "~/component/Input";
import { ActionBar } from "~/component/ActionBar";
import { RootState, useAppDispatch } from "~/state";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { resetPasswordAction, updateUserAction } from "~/state/thunk/user/user";

import styles from "~/sass/BasicInfomation.module.scss";
const cx = classNames.bind(styles);

const initialPasswordValue = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
};

function BasicInfomationPage() {
    const dispatch = useAppDispatch();

    const firstNameRef = useRef<HTMLDivElement>(null);
    const passwordRef = useRef<HTMLDivElement>(null);

    const [isCurrentPassword, setIsCurrentPassword] = useState(true);
    const [isNewPassword, setIsNewPassword] = useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = useState(true);

    const [isChangePass, setIsChangePass] = useState(false);
    const [isChangePassSuccess, setIsChangePassSuccess] = useState(false);
    const [isEditInfo, setIsEditInfo] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState('');
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser, status, loading } = userState;

    const initialInfoVales = {
        id: currentUser.id,
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
            console.log(values);
            
            const data: Omit<IUser, "email" | "userName" |
                "password" | "rolesId" | "role"> = {
                id: values.id,
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

            dispatch(resetPasswordAction({ id: currentUser.id, password: values.confirmPassword }));
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
        if (status === "updated")
            setIsEditInfo(false);
    }, [userState]);

    useEffect(() => {
        if(status === "updated") {
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
                                <img src={`./images/${infoValues.avatar}`} className={cx("avatar-img")} alt="avatar" />
                                <img src="./images/fi_camera.png" className={cx("icon-camera")} alt="camera" />
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
                                icon="./images/fi_edit.png"
                                title="Sửa thông tin"
                                onClick={() => {
                                    setIsEditInfo(true);
                                    firstNameRef.current?.focus();
                                }}
                            />
                            <ActionBarItem
                                icon="./images/fi_lock.png"
                                title="Đổi mật khẩu"
                                onClick={() => {
                                    setIsChangePass(true);
                                    passwordRef.current?.focus();
                                }}
                            />
                            <ActionBarItem
                                icon="./images/fi_log-out.png"
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
                <div className={cx("toast", isChangePassSuccess && "visible")}>
                    <div className={cx("icon-check")}>
                        <div className={cx("checkmark_circle")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 44 44" fill="none">
                                <path d="M22 42.1668C33.1378 42.1668 42.1667 33.1379 42.1667 22.0002C42.1667 10.8624 33.1378 1.8335 22 1.8335C10.8623 1.8335 1.83337 10.8624 1.83337 22.0002C1.83337 33.1379 10.8623 42.1668 22 42.1668Z" stroke="#18E306" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className={cx("checkmark_check")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="27.5" height="27.5" viewBox="0 0 28 28" fill="none">
                                <path d="M23.0833 7.0415L10.4792 19.6457L4.75 13.9165" stroke="#18E306" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <p className={cx("message")}>Đổi mật khẩu thành công!</p>
                </div>
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
                                iconRight="./images/eye.png"
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
                                iconRight="./images/eye.png"
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
                                iconRight="./images/eye.png"
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

export default BasicInfomationPage;