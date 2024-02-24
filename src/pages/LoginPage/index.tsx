import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { images } from "~/assets";
import Button from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { RootState, useAppDispatch } from "~/state";
import { getRoleAction } from "~/state/thunk/role/role";
import { checkLoginAction } from "~/state/thunk/user/user";

import styles from "~/sass/Login.module.scss";
const cx = classNames.bind(styles);

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    const [remember, setRemember] = useState(true);
    const [isPassword, setIsPassword] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const { loading, status, currentUser } = useSelector((state: RootState) => state.user);
    const { loading: roleLoading, roles } = useSelector((state: RootState) => state.role);

    const initialValuesLogin = {
        name: currentUser.userName || 'daiphuc2003',
        password: currentUser.password || 'dai090909'
    };

    const formikLogin = useFormik({
        initialValues: initialValuesLogin,
        validationSchema: Yup.object({
            name: Yup.string().required().min(5),
            password: Yup.string().required().min(8)
        }),
        onSubmit: (values) => {
            const { name, password } = values;
            dispatch(checkLoginAction({ userName: name, password: password, roles: roles }));
        }
    });
    const {
        errors: loginErrors,
        values: loginValues,
        touched: loginTouched,
        handleChange: handleChangeLogin,
        handleSubmit: handleSubmitLogin
    } = formikLogin;

    useEffect(() => {
        if (!Object.keys(loginTouched).length) return;

        if (loginErrors.name && loginErrors.password)
            setErrorMessage('Hãy nhập tài khoản và mật khẩu');
        else if (loginErrors.name)
            setErrorMessage('Hãy nhập tài khoản');
        else if (loginErrors.password)
            setErrorMessage('Hãy nhập mật khẩu');
        else setErrorMessage('');
    }, [loginErrors, loginTouched]);

    useEffect(() => {
        if (status === "loggin successfully")
            navigate(location.state?.from ?? "/contract-management");
    }, [status]);

    useEffect(() => {
        if (status === "loggin failed")
            setErrorMessage("Sai tên đăng nhập hoặc mật khẩu");
        else
            setErrorMessage("");
    }, [status, loading]);

    useEffect(() => {
        document.title = 'Trang đăng nhập';
        dispatch(getRoleAction());
    }, []);

    const handleFocus = (field: string) => {
        formikLogin.setFieldTouched(field, true);
    };

    const handleClickAction = () => {
        navigate("/forgot-password");
    };

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <div className={cx("main-logo")}>
                    <img src={images.logo} alt="main_logo" />
                </div>
                <Form
                    title="Đăng nhập"
                    className={cx("form-login")}
                    handleFormSubmit={handleSubmitLogin}
                >
                    <Input
                        id="name"
                        name="name"
                        title="Tên đăng nhập"
                        status={loading ? "disable" : "editable"}
                        className={cx("form-row")}
                        value={loginValues.name}
                        touched={loginTouched.name}
                        errorMessage={loginErrors.name}
                        onChange={handleChangeLogin}
                        onFocus={() => handleFocus("name")}
                    />
                    <Input
                        id="password"
                        name="password"
                        title="Mật khẩu"
                        status={loading ? "disable" : "editable"}
                        type={isPassword ? "password" : "text"}
                        value={loginValues.password}
                        touched={loginTouched.password}
                        errorMessage={loginErrors.password}
                        iconRight={isPassword ? images.eye : images.eyeSlash}
                        onFocus={() => handleFocus("password")}
                        onChange={handleChangeLogin}
                        onIconRightClick={() => setIsPassword(!isPassword)}
                    />
                    <p className={cx("error-message")}>{errorMessage && errorMessage}</p>
                    <Checkbox
                        checked={remember}
                        label="Ghi nhớ đăng nhập"
                        onClick={() => setRemember(!remember)}
                    />
                    <div className={cx("btn-login")}>
                        <Button
                            primary
                            fill
                            loading={loading}
                            value="Đăng nhập"
                            buttonType="submit"
                        />
                    </div>
                </Form>
                <div className={cx("action")} onClick={handleClickAction}>Quên mật khẩu</div>
                <Loading loading={roleLoading} />
            </div>
        </div>
    );
};

export default LoginPage;