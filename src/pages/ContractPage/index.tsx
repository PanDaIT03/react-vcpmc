import { useRef, useState } from "react";

import { Contract } from "~/component/Contract";
import AuthorizationContractPage from "../AuthorizationContractPage";
import { Tab, Tabs } from "~/component/Tabs";

function ContractPage() {
    const [active, setActive] = useState(true);

    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);

    return (
        <Contract title="Danh sách hợp đồng">
            <Tabs>
                <Tab
                    title="Hợp đồng uỷ quyền"
                    pageRef={firstRef}
                    status={active ? "active" : "inactive"}
                    onClick={() => setActive(true)}
                />
                <Tab
                    title="Hợp đồng khai thác"
                    pageRef={secondRef}
                    status={!active ? "active" : "inactive"}
                    onClick={() => setActive(false)}
                />
            </Tabs>
            <AuthorizationContractPage />
        </Contract>
    )
};

export default ContractPage;