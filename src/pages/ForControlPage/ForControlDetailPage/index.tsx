import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useSelector } from "react-redux";
import { EtmContractForControl } from "~/api/entrustmentContract";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { CommonDetailPage } from "~/pages/EntrustmentContract/Components/CommonContractPage";
import { RootState } from "~/state";

function ForControlHistoryDetailPage() {
    const { id } = useParams();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [entrustmentContract, setEntrustmentContract] = useState<EtmContractForControl>({} as EtmContractForControl);
    const [monthPeriod, setMonthPeriod] = useState<string>('');

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: routes.ForControlHistoryPage,
                active: true
            }, {
                title: 'Lịch sử đối soát',
                to: routes.ForControlHistoryPage,
                active: true
            }, {
                title: 'Chi tiết',
                to: '#',
                active: false
            }
        ]);

        setActionData([{
            icon: <FontAwesomeIcon icon={faFileExport} />,
            title: 'Xuất dữ liệu',
            onClick: () => { }
        }]);

        let currentContract = etmContract.etmContractForControl.find(contract => contract.docId === id);

        if (typeof currentContract !== 'undefined') setEntrustmentContract(currentContract);
    }, []);

    useEffect(() => {
        let monthPeriodSplit = entrustmentContract.checkpointDate?.split('/');

        typeof monthPeriodSplit !== 'undefined'
            && setMonthPeriod(`${monthPeriodSplit[1]}/${monthPeriodSplit[2]}`);
    }, [entrustmentContract]);

    return (
        <CommonDetailPage
            title={`Doanh thu theo hợp đồng - ${entrustmentContract.code} - Kỳ Tháng ${monthPeriod}`}
            pagingData={paging}
            actionData={actionData}
        />
    )
}

export default ForControlHistoryDetailPage;