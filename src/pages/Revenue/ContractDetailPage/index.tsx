import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { CommonDetailPage } from "~/pages/ContractPage/EntrustmentContractPage/Components/CommonContractPage";

function RevenueContractReportDetailPage() {
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: routes.RevenueReportPage,
                active: true
            }, {
                title: 'Báo cáo doanh thu',
                to: routes.RevenueReportPage,
                active: true
            }, {
                title: 'Báo cáo chi tiết',
                to: routes.RevenueReportDetailPage,
                active: false
            }, {
                title: 'Chi tiết doanh thu',
                to: '#',
                active: false
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faFileExport} />,
                title: 'Xuất dữ liệu',
                onClick: () => { }
            }
        ]);
    }, []);

    return (
        <CommonDetailPage
            title='Doanh thu theo hợp đồng khai thác'
            pagingData={paging}
            actionData={actionData}
        />
    );
};

export default RevenueContractReportDetailPage;