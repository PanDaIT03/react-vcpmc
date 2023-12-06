import classNames from "classnames/bind";
import { memo } from "react";

import { images } from "~/assets";
import styles from "~/sass/Upload.module.scss";
const cx = classNames.bind(styles);

interface UploadProps {
    className?: string
}

export const Upload = memo(({ className }: UploadProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    })

    return (
        <div className={classes}>
            <div className={cx("content")}>
                <img src={images.cloudUpload} alt="upload"/>
                <p className={cx("text")}>Tải lên</p>
            </div>
        </div>
    )
});