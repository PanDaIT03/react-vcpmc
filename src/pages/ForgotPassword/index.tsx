import * as Yup from "yup";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import PropagateLoader from "react-spinners/PropagateLoader";

import Button from "~/component/Button";
import { Form } from "~/component/Form";
import { forgotPassword } from "~/api/user";
import { useState } from "react";
import { Input } from "~/component/Input";
import { RootState } from "~/state";

import styles from "~/sass/Login.module.scss";
const cx = classNames.bind(styles);

const initialValues = {
    email: ''
};

function ForgotPassword() {
    const navigate = useNavigate();

    const [recover, setRecover] = useState(false);
    const userState = useSelector((state: RootState) => state.user);
    const { loading } = userState;

    const formikRecover = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            email: Yup.string().required('Hãy nhập email').email('Email không đúng định dạng')
        }),
        onSubmit: (values) => {
            forgotPassword(values.email)
                .then(() => {
                    setRecover(true);
                })
                .catch(e => console.log(e.message))
        }
    });
    const {
        errors: recoverErrors,
        values: recoverValues,
        touched: recoverTouched,
        handleChange: handleChangeRecover,
        handleSubmit: handleSubmitRecover
    } = formikRecover;

    const handleFocus = (field: string) => {
        formikRecover.setFieldTouched(field, true);
    };

    const handleClickAction = () => {
        navigate("/login");
    };

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <div className={cx("main-logo")}>
                    <img src="../images/logo.png" alt="main_logo" />
                </div>
                <Form
                    title="Khôi phục mật khẩu"
                    className={cx("form-recover")}
                    handleFormSubmit={handleSubmitRecover}
                >
                    <p className={cx("hint", !recover ? "active" : "inactive")}>
                        Vui lòng nhập địa chỉ email đã đăng ký để yêu cầu khôi phục mật khẩu
                    </p>
                    <p className={cx("hint", recover ? "active" : "inactive")}>
                        Link khôi phục mật khẩu đã được gửi vào mail của bạn. Vui lòng kiểm tra mail. <br />
                        Click vào đường link được đính kèm trong mail để chuyển đến trang đặt lại mật khẩu.
                    </p>
                    {!recover &&
                        <>
                            <Input
                                id="email"
                                name="email"
                                title="Email"
                                size="extra-large"
                                className={cx("recover")}
                                value={recoverValues.email}
                                touched={recoverTouched.email}
                                errorMessage={recoverErrors.email}
                                onFocus={() => handleFocus("email")}
                                onChange={handleChangeRecover}
                            />
                            <p className={cx("error-message")}>{recoverErrors && recoverErrors.email}</p>
                        </>
                    }
                    {!recover && <Button
                        primary
                        fill
                        value="Xác nhận"
                        buttonType="submit"
                    />}
                </Form>
                <div className={cx("action")} onClick={handleClickAction}>Quay lại đăng nhập</div>

                {loading && <p className={cx("loading-spinner")}>
                    <PropagateLoader color="#36d7b7" />
                </p>}
            </div>
        </div>
    );
};

export default ForgotPassword;