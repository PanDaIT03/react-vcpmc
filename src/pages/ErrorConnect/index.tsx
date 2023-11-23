import classNames from "classnames/bind";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "~/component/Button";
import { Form } from "~/component/Form";
import styles from "~/sass/Login.module.scss";
const cx = classNames.bind(styles);

function ErrorConnect() {
    const navigate = useNavigate();

    const handleSubmit = useCallback((event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/forgot-password");
    }, []);

    return (
        <div className={cx("container")}>
            <div className={cx("content")}>
                <div className={cx("main-logo")}>
                    <img src="../images/logo.png" alt="main_logo" />
                </div>

                <Form
                    title="Không thể kết nối !!"
                    className={cx("form-error")}
                    handleFormSubmit={(event) => handleSubmit(event)}
                >
                    <p className={cx("hint", "w-585")}>
                        Dường như đã có chút trục trặc hoặc link này đã hết hạn. Vui lòng thử lại hoặc yêu cầu gửi lại link để đặt lại mật khẩu của bạn.
                    </p>
                    <Button
                        primary
                        value="Yêu cầu gửi lại link"
                        buttonType="submit"
                    />
                </Form>
                <div className={cx("action")} onClick={() => navigate("/login")}>Quay lại đăng nhập</div>
            </div>
        </div>
    );
};

export default ErrorConnect;