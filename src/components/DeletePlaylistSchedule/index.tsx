import classNames from "classnames/bind";
import { Dispatch, Fragment, memo, useState } from "react";

import { Checkbox } from "../Checkbox";
import Button from "../Button";

import styles from "~/sass/DeletePlaylistSchedule.module.scss";
const cx = classNames.bind(styles);

interface DeletePlaylistScheduleProps {
    data: string[]
    selectArray: string[]
    className?: string
    setVisible: Dispatch<React.SetStateAction<boolean>>
    setSelectArray: React.Dispatch<React.SetStateAction<string[]>>
};

export const DeletePlaylistSchedule = memo(({
    data,
    selectArray,
    className,
    setVisible,
    setSelectArray
}: DeletePlaylistScheduleProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const [select, setSelect] = useState<string[]>([]);

    const handleClickCheckbox = (day: string, isExisted: boolean) => {
        if (!isExisted) setSelect([...select, day]);
        else setSelect(() => select.filter(item => item !== day));
    };

    return (
        <div className={classes}>
            <div className={cx("content")}>
                <h2>Xóa lịch phát</h2>
                <div className={cx("description")}>Xóa tất cả lịch phát trong ngày</div>
                {data.map((item, index) => {
                    const isChecked = select.filter(selectItem => selectItem === item).length > 0;

                    return (
                        <Fragment key={index}>
                            <Checkbox
                                label={item}
                                checked={isChecked}
                                onClick={() => handleClickCheckbox(item, isChecked)}
                            />
                        </Fragment>
                    );
                })}
            </div>
            <div className={cx("actions")}>
                <Button
                    primary
                    size="small"
                    value="Huỷ"
                    onClick={() => setVisible(false)}
                />
                <Button
                    primary
                    fill
                    size="small"
                    value="Xoá"
                    onClick={() => setSelectArray(select)}
                />
            </div>
        </div>
    );
});