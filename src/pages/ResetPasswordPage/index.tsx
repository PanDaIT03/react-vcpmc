import * as Yup from "yup";
import Swal from "sweetalert2";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useQuery from "~/hooks";
import Button from "~/components/Button";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { resetPasswordAction } from "~/state/thunk/user/user";
import { RootState, useAppDispatch } from "~/state";
import { images } from "~/assets";
import { routes } from "~/config/routes";

import styles from "~/sass/Login.module.scss";
const cx = classNames.bind(styles);

const initialValuesLogin = {
    password: '',
    confirmPassword: ''
};

function ResetPasswordPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const query = useQuery();
    const emailAddress = query.get('emailAddress')?.toString();

    const [isPassword, setIsPassword] = useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const userState = useSelector((state: RootState) => state.user);
    const { status, loading } = userState;

    const formikResetPass = useFormik({
        initialValues: initialValuesLogin,
        validationSchema: Yup.object({
            password: Yup.string().required().min(8),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
                .required()
        }),
        onSubmit: (values) => {
            const email = emailAddress || "";
            dispatch(resetPasswordAction({ email: email, password: values.password }));
        }
    });
    const {
        errors,
        values,
        touched,
        handleChange,
        handleSubmit
    } = formikResetPass;

    useEffect(() => {
        if (Object.keys(touched).length < 2
            || Object.keys(errors).length === 0) {
            setErrorMessage('');
            return;
        };

        if (errors.confirmPassword === 'Mật khẩu không khớp')
            setErrorMessage('Mật khẩu không khớp');
        else if (errors.password)
            setErrorMessage('Hãy nhập mật khẩu');
        else if (errors.confirmPassword)
            setErrorMessage('Hãy nhập mật khẩu');
        else setErrorMessage('');
    }, [errors, touched]);

    useEffect(() => {
        if (status === "user updated")
            Swal.fire({
                title: "Khôi phục mật khẩu thành công",
                text: "Dùng mật khẩu mới của bạn để đăng nhập",
                icon: "success",
                confirmButtonText: "Đăng nhập",
                width: 400
            }).then((result) => {
                if (result.isConfirmed)
                    navigate(routes.LoginPage);
            });
    }, [userState]);

    const handleFocus = (field: string) => {
        formikResetPass.setFieldTouched(field, true);
    };

    useEffect(() => {
        document.title = 'Khôi phục mật khẩu';

        if (!emailAddress)
            navigate(routes.ErrorConnectPage);
    }, []);

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <div className={cx("main-logo")}>
                    <img src={images.logo} alt="main_logo" />
                </div>
                <Form
                    title="Đặt lại mật khẩu"
                    className={cx("form-reset-password")}
                    handleFormSubmit={handleSubmit}
                >
                    <Input
                        id="password"
                        name="password"
                        title="Mật khẩu mới"
                        status={loading ? "disable" : "editable"}
                        className={cx("form-row")}
                        type={isPassword ? "password" : "text"}
                        value={values.password}
                        touched={touched.password}
                        errorMessage={errors.password}
                        iconRight={images.eye}
                        onFocus={() => handleFocus("password")}
                        onChange={handleChange}
                        onIconRightClick={() => setIsPassword(!isPassword)}
                    />
                    <Input
                        id="confirm-password"
                        name="confirmPassword"
                        title="Nhập lại mật khẩu mới"
                        status={loading ? "disable" : "editable"}
                        className={cx("form-row")}
                        type={isConfirmPassword ? "password" : "text"}
                        value={values.confirmPassword}
                        touched={touched.confirmPassword}
                        errorMessage={errors.confirmPassword}
                        iconRight={images.eye}
                        onFocus={() => handleFocus("confirmPassword")}
                        onChange={handleChange}
                        onIconRightClick={() => setIsConfirmPassword(!isConfirmPassword)}
                    />
                    <p className={cx("error-message")}>{errorMessage && errorMessage}</p>
                    <div className={cx("btn-reset")}>
                        <Button
                            primary
                            fill
                            value="Xác nhận"
                            buttonType="submit"
                            loading={loading}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;