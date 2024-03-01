import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { formatDateDMYHPTS, formatDateYMD, formatMoney } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { setContractsDetail } from "~/state/reducer/contract";
import { getContractsAction } from "~/state/thunk/contract";
import { getRecordsAction } from "~/state/thunk/record";
import { getRecordPlays } from "~/state/thunk/recordPlay";
import { ContractDetail, RecordDetail } from "~/types/AuthorizedPartnerType";
import { User } from "~/types/UserType";

import style from '~/sass/RevenueDistribution.module.scss';
const cx = classNames.bind(style);

function RevenueDistributionPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useContext(SidebarContext);

    const authorized = useSelector((state: RootState) => state.contract);
    const recordPlay = useSelector((state: RootState) => state.recordPlay);
    const record = useSelector((state: RootState) => state.record);
    const user = useSelector((state: RootState) => state.user);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [currentItems, setCurrentItems] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [contractDetailList, setContractDetailList] = useState<Array<ContractDetail>>([] as Array<ContractDetail>);
    const [loading, setLoading] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: '#',
                active: true
            }, {
                title: 'Phân phối doanh thu',
                to: '#',
                active: true
            }
        ]);

        setActionData([
            {
                icon: <FontAwesomeIcon icon={faFileExport} />,
                title: 'Xuất dữ liệu',
                onClick: () => { }
            }
        ]);

        authorized.contracts.length <= 0 && dispatch(getContractsAction());
        record.records.length <= 0 && dispatch(getRecordsAction(''));
        dispatch(getRecordPlays());

        let dateList = new Date().toLocaleString().split(',')[0].split('/');
        setDate(`${dateList[dateList.length - 1]}-${dateList[0]}-${dateList[1]}`);

        setActive(true);
    }, []);

    useEffect(() => {
        if (authorized.contracts.length <= 0 || record.records.length <= 0 ||
            recordPlay.recordPlays.length <= 0) return;

        const contractsDetail = authorized.contracts.map(contract => {
            const recordItem = record.records.filter(record => record.contractId === contract.docId);
            const records: RecordDetail[] = recordItem.map(record => {
                const recordPlayItem = recordPlay.recordPlays.filter(recordPlay => recordPlay.recordsId === record.docId);

                return {
                    records: record,
                    recordPlays: recordPlayItem,
                    totalPlay: recordPlayItem.reduce((sum, item) => sum + parseInt(item.playsCount), 0)
                }
            });
            const totalPlay = records.reduce((sum, item) => sum + item.totalPlay, 0);
            const authorizedPerson = user.users.find(user => user.docId === contract.authorizedPerson) || {} as User;
            const createdBy = user.users.find(user => user.docId === contract.createdBy) || {} as User;

            return {
                contract: {
                    ...contract,
                    authorizedPerson: authorizedPerson,
                    createdBy: createdBy
                },
                records: records,
                totalPlay: totalPlay,
                revenue: totalPlay * (parseInt(contract.CPM) / 1000),
                royalties: (totalPlay * (parseInt(contract.CPM) / 1000) * parseFloat(contract.royalties)) / 100,
                date: formatDateDMYHPTS(date),
                administrativeFee: (totalPlay * (parseInt(contract.CPM) / 1000) * parseInt(contract.administrativeFee)) / 100,
            }
        });

        setContractDetailList(contractsDetail);
        setSearchResult(contractsDetail);
    }, [authorized.contracts, record.records, recordPlay.recordPlays]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        let searchFilterDate = contractDetailList.filter(prev =>
            prev.records.some(record =>
                record.recordPlays.some(recordPlay =>
                    +new Date(formatDateYMD(recordPlay.date)).getMonth() === +new Date(date).getMonth() &&
                    +new Date(formatDateYMD(recordPlay.date)).getFullYear() === +new Date(date).getFullYear()
                )
            )
        );

        if (value === '') {
            setSearchResult(searchFilterDate);
            return;
        }

        setSearchResult(searchFilterDate.filter(contract =>
            contract.records.some(record => record.records.nameRecord.toLowerCase().includes(value)))
        );
    }, [searchValue, date]);

    useEffect(() => {
        if (authorized.loading === true) setLoading(true);
        else if (recordPlay.loading === true) setLoading(true);
        else if (record.loading === true) setLoading(true);
        else setLoading(false);
    }, [authorized.loading, record.loading, recordPlay.loading]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleDetailClick = (id: string) => {
        navigate(`/revenue/distribution/detail/${id}`);
        dispatch(setContractsDetail(contractDetailList));
        setActive(false);
    }

    return (
        <CommonWrapper
            title='Quản lý phân phối doanh thu'
            className={cx('revenue-management-container')}
            paging={paging}
        >
            <div className={cx('revenue-management-container__filter')}>
                <div>
                    <p>Theo tháng:</p>
                    <Input
                        name='date'
                        type='date'
                        value={date}
                        onChange={(e: any) => setDate(e.target.value)}
                    />
                </div>
                <Input
                    id="search"
                    type='text'
                    name='search'
                    size="custom"
                    placeholder="Tên bản ghi, ca sĩ..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <p className={cx('table__title')}>Danh sách hợp đồng ủy quyền</p>
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Hợp đồng ủy quyền', 'Người ủy quyền', 'Số bài hát ủy quyền', 'Doanh thu (VNĐ)',
                    'Hành chính phí (VNĐ)', 'Mức nhuận bút (VNĐ)', 'Ngày chốt đối soát', 'Chi tiết doanh thu']}
                className={cx('revenue-management-container__table')}
            >
                {currentItems.map((item, index) => (
                    <tr key={index} style={{ height: '56px' }}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.contract.contractCode}</p></td>
                        <td><p>{item.contract.authorizedPerson.firstName} {item.contract.authorizedPerson.lastName}</p></td>
                        <td><p>{item.records.length}</p></td>
                        <td><p>{formatMoney(item.revenue).split('₫')[0]}</p></td>
                        <td><p>{formatMoney(item.royalties).split('₫')[0]}</p></td>
                        <td><p>{formatMoney(item.royalties).split('₫')[0]}</p></td>
                        <td><p>{item.contract.forControlDate === '' ? '-' : item.contract.forControlDate}</p></td>
                        <td><p className={cx('action')} onClick={() => handleDetailClick(item.contract.docId)}>Chi tiết</p></td>
                    </tr>
                ))}
            </Table>
            <ActionBar visible={true}>
                <ActionBarItem
                    title="Xuất dữ liệu"
                    icon={images.fileExport}
                    onClick={() => { }}
                />
            </ActionBar>
            <Loading loading={loading} />
        </CommonWrapper >
    );
}

export default RevenueDistributionPage;