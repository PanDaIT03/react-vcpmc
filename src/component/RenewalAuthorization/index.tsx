import classNames from "classnames/bind";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Input } from "../Input";
import { images } from "~/assets";
import { Checkbox } from "../Checkbox";
import { Upload } from "../Upload";
import { BlockDetail } from "../BlockDetail";
import { IGlobalConstantsType } from "~/types";

import styles from "~/sass/RenewalAuthorization.module.scss";
import Button from "../Button";
const cx = classNames.bind(styles);

interface RenewalAuthorizationProps {
    title: string
    from: string
    className?: string
    setVisible: Dispatch<SetStateAction<boolean>>
};

export const RenewalAuthorization = ({
    title,
    from,
    className,
    setVisible
}: RenewalAuthorizationProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className,
    });

    const [checked, setChecked] = useState(false);
    const [toDate, setTodate] = useState('');

    const [fileAttach, setFileAttach] = useState<IGlobalConstantsType[]>([]);

    useEffect(() => {
        setFileAttach([
            {
                id: 1,
                title: "",
                value: [
                    {
                        id: 1,
                        icon: images.iconFileWord,
                        title: "hetthuongcannho.doc"
                    },
                    {
                        id: 2,
                        icon: images.iconFile,
                        title: "hetthuongcannho.doc"
                    }
                ]
            }
        ]);
    }, []);

    const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    };

    return (
        <div className={classes}>
            <h2 className={cx("title")}>{title}</h2>
            <div className={cx("content")}>
                <div className={cx("content_top")}>
                    <div className={cx("left")}>
                        <div className={cx("left_title")}>
                            <h3>Thời gian gia hạn</h3>
                            <img src={images.force} alt="force" />
                        </div>
                        <div className={cx("from")}>Từ ngày: {from}</div>
                        <div className={cx("to")}>
                            <span>Đến ngày:</span>
                            <div className={cx("calendar-picker")}>
                                <Input
                                    name="calendar"
                                    value={toDate}
                                    type="date"
                                    size="custom"
                                    min={from}
                                    onChange={(event) => setTodate(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx("note")}>Lưu ý: Thời gian bắt đầu gia hạn hợp đồng mới được tính sau ngày hết hạn hợp đồng cũ một ngày.</div>
                    </div>
                    <div className={cx("right")}>
                        <div className={cx("right_title")}>
                            <h3>Mức nhuận bút</h3>
                            <img src={images.force} alt="force" />
                        </div>
                        <div className={cx("content")}>
                            <div className={cx("content_row")}>
                                <Checkbox
                                    checked={checked}
                                    visible={true}
                                    label="Quyền tác giả"
                                    onClick={() => setChecked(!checked)}
                                />
                                <div className={cx("author")}>
                                    <Input value="0" name="author" size="custom" onChange={(event) => handelChange(event)} />
                                </div>
                                <p>%</p>
                            </div>
                            <div className={cx("items", "content_row")}>
                                <Checkbox
                                    checked={checked}
                                    visible={true}
                                    label="Quyền liên quan"
                                    onClick={() => setChecked(!checked)}
                                />
                                <div className={cx("item")}>
                                    <p className={cx("line")}></p>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.2rem"
                                    }}>
                                        <div className={cx("content_row")}>
                                            <Checkbox
                                                checked={checked}
                                                visible={true}
                                                label="Quyền của người biểu diễn"
                                                onClick={() => setChecked(!checked)}
                                            />
                                            <div className={cx("author")}>
                                                <Input value="0" name="author" size="custom" onChange={(event) => handelChange(event)} />
                                            </div>
                                            <p>%</p>
                                        </div>
                                        <div className={cx("content_row")}>
                                            <Checkbox
                                                checked={checked}
                                                visible={true}
                                                label="Quyền của nhà sản xuất (bản ghi/video)"
                                                labelMaxWidth="193"
                                                onClick={() => setChecked(!checked)}
                                            />
                                            <div className={cx("author")}>
                                                <Input value="0" name="author" size="custom" onChange={(event) => handelChange(event)} />
                                            </div>
                                            <p>%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx("content_bottom")}>
                    <div className={cx("content_bottom_left")}>
                        <h3>Đính kèm tệp:</h3>
                    </div>
                    <div className={cx("content_bottom_right")}>
                        <Upload />
                        <BlockDetail data={fileAttach} />
                    </div>
                </div>
            </div>
            <div className={cx("actions")}>
                <Button primary size="large" value="Huỷ" onClick={() => setVisible(false)} />
                <Button primary size="large" fill value="Lưu" />
            </div>
        </div>
    );
};