import classNames from "classnames/bind";
import { useFormik } from "formik";

import { IContract, IUserDetail } from "~/types";
import { ActionContract } from "~/components/ActionContract";
import styles from "~/sass/Detail.module.scss";
const cx = classNames.bind(styles);

interface DetailProps {
    loading: boolean
    contractDetail: IContract & IUserDetail
};

interface InitType {
    fullName: string
};

const initialValues: InitType = {} as InitType;

export const Detail = ({ loading, contractDetail }: DetailProps) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: () => { }
    });

    return (
        <div className={cx("wrapper")}>
            <div className={cx("content")}>
                <ActionContract
                    formik={formik}
                    contractDetail={contractDetail}
                    loading={loading}
                    type="detail"
                />
            </div>
        </div>
    );
};