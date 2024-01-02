import classNames from "classnames/bind";
import Switch from "react-switch";
import { memo, useEffect, useState } from "react";

import { IPLaylist } from "~/types/PlaylistType";
import { IRecord } from "~/types";
import { getTotalMoment } from "~/constants";
import { Input } from "~/components/Input";
import { Topic } from "~/components/Topic";

import style from '~/sass/EditPlaylist.module.scss';
const cx = classNames.bind(style);

interface EditPlaylistProps {
    data: IPLaylist
    formik: any
    className?: string
};

export const EditPlaylist = memo(({
    data,
    formik,
    className
}: EditPlaylistProps) => {
    if (!className) className = "";

    const classes = cx('wrapper', {
        [className]: className
    });

    const [isChecked, setIsChecked] = useState(false);

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    const { values, errors, touched, handleChange, setValues, setFieldTouched } = formik;
    const { title, description } = values;

    useEffect(() => {
        setValues({
            imageURL: data.imageURL,
            title: data.title,
            description: data.description
        });
    }, [data]);

    return (
        <div className={classes}>
            <div className={cx("container")}>
                <div className={cx("title-primary")}>
                    <Input
                        id="title"
                        type='text'
                        name='title'
                        title='Tiêu đề'
                        isRequire={true}
                        size="custom"
                        value={title}
                        errorMessage={errors.title}
                        touched={touched.title}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('title', true)}
                        onBlur={() => setFieldTouched('title', false)}
                    />
                </div>
                <div className={cx("line")}></div>
                <div className={cx("infomation-records")}>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Người tạo:</div>
                        <div className={cx("content")}>{data.createdBy}</div>
                    </div>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Tổng số:</div>
                        <div className={cx("content")}>{data.records.length} bản ghi</div>
                    </div>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Tổng thời lượng:</div>
                        <div className={cx("content")}>{totalPlaylistTime(data.records)}</div>
                    </div>
                </div>
                <div className={cx("line")}></div>
                <div className={cx("description")}>
                    <Input
                        as="textarea"
                        id="description"
                        type='text'
                        name='description'
                        size="custom"
                        title="Mô tả"
                        className={cx("textarea-description")}
                        value={description}
                        errorMessage={errors.description}
                        touched={touched.description}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('description', true)}
                        onBlur={() => setFieldTouched('description', false)}
                    />
                </div>
                <div className={cx("line")}></div>
                <div className={cx("topics")}>
                    <p>Chủ đề:</p>
                    <Topic />
                </div>
                <div className={cx("line")}></div>
                <div className={cx("actions")}>
                    <Switch
                        id="switch"
                        onColor="#347AFF"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        onChange={() => setIsChecked(!isChecked)}
                        checked={isChecked}
                    />
                    <label htmlFor="switch">Chế độ công khai</label>
                </div>
            </div>
        </div>
    );
});