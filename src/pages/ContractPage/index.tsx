import classNames from "classnames/bind";

import { Contract } from "~/component/Contract";
import AuthorizationContractPage from "../AuthorizationContractPage";

import styles from "~/sass/Contract.module.scss";
import { Tabs } from "~/component/Tabs";
import { useRef } from "react";
const cx = classNames.bind(styles);

function ContractPage() {
    return (
        <Contract title="Danh sách hợp đồng">
            <Tabs
                firstTab="Hợp đồng uỷ quyền"
                secondTab="Hợp đồng khai thác"
            />
            <AuthorizationContractPage />
        </Contract>
    )
};

export default ContractPage;