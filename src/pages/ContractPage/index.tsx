import { useContext, useEffect, useState } from "react";

import { Contract } from "~/components/Contract";
import { Tab, Tabs } from "~/components/Tabs";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import AuthorizationContractPage from "../AuthorizationContractPage";

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
    const { setActive } = useContext(SidebarContext);
    const [switchPage, setSwitchPage] = useState(true);

    useEffect(() => {
        setActive(true);
    }, []);

    return (
        <Contract
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
            <AuthorizationContractPage />
        </Contract>
    )
};

export default ContractPage;