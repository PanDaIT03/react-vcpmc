import classNames from "classnames/bind";
import { ReactNode, memo } from "react";

import { images } from "~/assets";
import Button from "../Button";

import styles from "~/sass/AddContractSuccess.module.scss";
const cx = classNames.bind(styles);

interface AddContractSuccessProps {
    className?: string
};

interface AddContractSuccessItemProps {
    option: number
    title: string
    subTitle: string
    children: ReactNode
    className?: string
};

const AddContractSuccessItem = memo(({
    option,
    title,
    subTitle,
    children,
    className
}: AddContractSuccessItemProps) => {
    if (!className) className = "";

    const classes = cx("item-wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("method_title")}>
                <h3>{`Cách ${option}`}</h3>
                <p>{title}</p>
            </div>
            <div className={cx("method_content")}>{subTitle}</div>
            {children}
        </div>
    );
});

export const AddContractSuccess = memo(({
    className
}: AddContractSuccessProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            <div className={cx("container")}>
                <div className={cx("title")}>
                    <img src={images.checkCircle} alt="success" />
                    <h1>Hợp đồng đã được tạo thành công</h1>
                </div>
                <div className={cx("content")}>
                    <div className={cx("line")}></div>
                    <div className={cx("sub-title")}>
                        <h2>Có 2 cách để tạo bản ghi:</h2>
                    </div>
                    <div className={cx("upload-methods")}>
                        <AddContractSuccessItem
                            option={1}
                            title="Upload bản ghi trực tiếp"
                            subTitle="Bạn có thể thực hiện thêm bản ghi ngay trên website"
                        >
                            <div className={cx("btn-upload")}>
                                <Button
                                    primary
                                    fill
                                    value="Thêm bản ghi trực tiếp"
                                    size="custom"
                                    // onClick={ }
                                />
                            </div>
                        </AddContractSuccessItem>
                        <AddContractSuccessItem
                            option={2}
                            title="Upload bản ghi qua phần mềm"
                            subTitle="Bạn có thể thêm bản ghi bằng tool"
                        >
                            <div className={cx("btn-upload")}>
                                <Button primary value="Thêm bản ghi trực tiếp" size="custom" />
                            </div>
                        </AddContractSuccessItem>
                    </div>
                    <div className={cx("note")}>Lưu ý: Hợp đồng chỉ có hiệu lực khi thêm bản ghi thành công.</div>
                </div>
            </div>
        </div>
    );
});