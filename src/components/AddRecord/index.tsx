import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { IGlobalConstantsType, IRecord } from "~/types";
import { Input } from "../Input";
import { BlockDetail } from "../BlockDetail";
import { Form } from "../Form";
import { Upload } from "../Upload";
import Button from "../Button";

import styles from "~/sass/AddRecord.module.scss";
const cx = classNames.bind(styles);

interface AddRecordProps {
    visible: boolean
    className?: string
    setState: Dispatch<SetStateAction<boolean>>
};

type InitType = Pick<IRecord, "nameRecord" | "ISRCCode" | "author" | "singer" | "category" | "producer">;

const initialValues: InitType = {
    nameRecord: "",
    ISRCCode: "",
    author: "",
    singer: "",
    category: "",
    producer: ""
}

export const AddRecord = memo(({
    visible,
    className,
    setState
}: AddRecordProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const [recordInput, setRecordInput] = useState<IGlobalConstantsType[]>([]);
    const [recordInput2, setRecordInput2] = useState<IGlobalConstantsType[]>([]);

    const { values, errors, touched, handleSubmit, handleChange, setFieldTouched } = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup.string().required(),
            author: Yup.string().required(),
            singer: Yup.string().required(),
            category: Yup.string().required(),
            producer: Yup.string().required()
        }),
        onSubmit: values => {
            console.log(values);
        }
    });
    const { nameRecord, ISRCCode, author, singer, category, producer } = values;

    useEffect(() => {
        setRecordInput([
            {
                id: 1,
                tag: <Input
                    title="Tên bản ghi"
                    id="nameRecord"
                    type='text'
                    name='nameRecord'
                    size="custom"
                    isRequire={true}
                    value={nameRecord}
                    errorMessage={errors.nameRecord}
                    touched={touched.nameRecord}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('nameRecord', true)}
                    onBlur={() => setFieldTouched('nameRecord', false)}
                />
            }, {
                id: 2,
                tag: <Input
                    title="Mã ISRC"
                    id="ISRCCode"
                    type='text'
                    name='ISRCCode'
                    size="custom"
                    value={ISRCCode}
                    errorMessage={errors.ISRCCode}
                    touched={touched.ISRCCode}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('ISRCCode', true)}
                    onBlur={() => setFieldTouched('ISRCCode', false)}
                />
            }, {
                id: 3,
                tag: <Input
                    title="Tác giả"
                    id="author"
                    type='text'
                    name='author'
                    size="custom"
                    isRequire={true}
                    value={author}
                    errorMessage={errors.author}
                    touched={touched.author}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('author', true)}
                    onBlur={() => setFieldTouched('author', false)}
                />
            }, {
                id: 4,
                tag: <Input
                    title="Ca sĩ/Nhóm nhạc"
                    id="singer"
                    type='text'
                    name='singer'
                    size="custom"
                    isRequire={true}
                    value={singer}
                    errorMessage={errors.singer}
                    touched={touched.singer}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('singer', true)}
                    onBlur={() => setFieldTouched('singer', false)}
                />
            }
        ]);

        setRecordInput2([
            {
                id: 1,
                tag: <Input
                    title="Thể loại"
                    id="category"
                    type='text'
                    name='category'
                    size="custom"
                    isRequire={true}
                    value={category}
                    errorMessage={errors.category}
                    touched={touched.category}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('category', true)}
                    onBlur={() => setFieldTouched('category', false)}
                />
            }, {
                id: 2,
                tag: <Input
                    title="Nhà sản xuất"
                    id="producer"
                    type='text'
                    name='producer'
                    size="custom"
                    isRequire={true}
                    value={producer}
                    errorMessage={errors.producer}
                    touched={touched.producer}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('producer', true)}
                    onBlur={() => setFieldTouched('producer', false)}
                />
            }
        ]);
    }, []);

    return (
        <div className={classes}>
            {visible && <div className={cx("container")}>
                <div className={cx("title")}>Thêm bản ghi mới</div>
                <Form
                    className={cx("record")}
                    handleFormSubmit={handleSubmit}
                >
                    <BlockDetail
                        editable
                        data={recordInput}
                        maxWidth="custom"
                    />
                    <BlockDetail
                        editable
                        data={recordInput2}
                        maxWidth="custom"
                        isHorizontal={true}
                    />
                    <div className={cx("attach-file")}>
                        <div className={cx("item")}>
                            <p>Đính kèm bản ghi:</p>
                            <Upload />
                        </div>
                        <div className={cx("item")}>
                            <p>Đính kèm lời bài hát:</p>
                            <Upload />
                        </div>
                    </div>
                    <div className={cx("button-actions")}>
                        <Button
                            primary
                            value="Huỷ"
                            size="small"
                            onClick={() => setState(false)}
                        />
                        <Button
                            primary
                            fill
                            value="Lưu"
                            buttonType="submit"
                            size="small"
                        />
                    </div>
                </Form>
            </div>}
        </div>
    );
});