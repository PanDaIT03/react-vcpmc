import classNames from "classnames/bind";
import { memo, useEffect, useState } from "react";
import { useFormik } from "formik";

import { IGlobalConstantsType, IRecord } from "~/types";

import styles from "~/sass/AddRecord.module.scss";
const cx = classNames.bind(styles);

interface AddRecordProps {
    className?: string
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
    className
}: AddRecordProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    const [recordInput, setRecordInput] = useState<IGlobalConstantsType[]>([]);

    const { } = useFormik({
        initialValues: initialValues,
        onSubmit: values => {
            console.log(values);
        }
    });

    useEffect(() => {
        // setRecordInput([
        //     {
        //         id: 5,
        //         title: 'Ngân hàng',
        //         tag: <Input
        //             id="bank"
        //             type='text'
        //             name='bank'
        //             size="small"
        //             value={bank}
        //             errorMessage={errors.bank}
        //             touched={touched.bank}
        //             onChange={handleChange}
        //             onFocus={() => setFieldTouched('bank', true)}
        //             onBlur={() => setFieldTouched('bank', false)}
        //         />
        //     }
        // ]);
    }, []);

    return (
        <div className={classes}>
            <div className={cx("container")}>
                <div className={cx("title")}>Thêm bản ghi mới</div>
            </div>
        </div>
    );
});