import { useState } from "react";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { Tab, Tabs } from "~/components/Tabs";
import { routes } from "~/config/routes";
import AuthorizationContractPage from "./AuthorizationContractPage";
import EntrustmentContract from "./EntrustmentContractPage";

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: routes.ContractPage
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.ContractPage
    }
];

function ContractPage() {
    const [switchPage, setSwitchPage] = useState(true);

    return (
        <CommonWrapper
            title="Danh sách hợp đồng"
            paging={PAGING_ITEMS}
        >
            <Tabs>
                <Tab
                    visible={switchPage}
                    title="Hợp đồng uỷ quyền"
                    onClick={() => setSwitchPage(true)}
                />
                <Tab
                    visible={!switchPage}
                    title="Hợp đồng khai thác"
                    onClick={() => setSwitchPage(false)}
                />
            </Tabs>
            {switchPage ? <AuthorizationContractPage /> : <EntrustmentContract />}
        </CommonWrapper>
    )
};

export default ContractPage;