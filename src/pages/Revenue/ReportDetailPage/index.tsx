import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Dialog } from "~/components/Dialog";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { QUARTERLY, formatDateYMD } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { checkpointAllContract, getEtmContractForControls } from "~/state/thunk/entrustmentContract";
import { IGlobalConstantsType } from "~/types";
import { EtmContractForControl, Quarterly } from "~/types/EntrustmentContractType";
import { Filter } from "..";

import style from '~/sass/RevenueReportDetail.module.scss';
const cx = classNames.bind(style);

function RevenueReportDetailPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [currentDate, setCurrentDate] = useState<Date>();
    const [toastActive, setToastActive] = useState<boolean>(false);
    const { setActive, setCurrentPage } = useContext(SidebarContext);

    const [searchValue, setSearchValue] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [filter, setFilter] = useState<Filter>({ type: '', data: [], dataActive: '' } as Filter);
    const [searchResult, setSearchResult] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [currentItems, setCurrentItems] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [monthActive, setMonthActive] = useState<IGlobalConstantsType>({
        id: 1,
        title: 'Tháng 1'
    });
    const [type, setType] = useState<IGlobalConstantsType>({
        id: 1,
        title: 'Theo tháng'
    });

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
                to: '#',
                active: false
            }
        ]);
        setActionbar([
            {
                title: "Chốt doanh thu",
                icon: images.checkAll,
                onClick: () => setToastActive(true)
            }, {
                title: "Xuất dữ liệu",
                icon: images.fileExport,
                onClick: () => setToastActive(true)
            }
        ]);

        let currentDate = new Date();
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);

        setFilter({
            ...filter,
            data: months,
            type: 'Theo tháng',
            dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        });
        setMonthActive({ id: currentDate.getMonth() + 1, title: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` });
        setCurrentDate(currentDate);

        etmContract.etmContractForControl.length === 0 && dispatch(getEtmContractForControls());
    }, []);

    useEffect(() => {
        if (!filter.data.length) return;

        setFilter({ ...filter, dataActive: `${monthActive.title}/${new Date().getFullYear()}` });
    }, [monthActive]);

    useEffect(() => {
        if (typeof currentDate === 'undefined' || !etmContract.etmContractForControl.length) return;

        setSearchResult(etmContract.etmContractForControl
            .map(contract => {
                let quarter: Quarterly = { quarter: '', time: '' };

                if (filter.type === 'Theo quý')
                    quarter = QUARTERLY.find(quarter => quarter.quarter === filter.dataActive.split('/')[0]) || { quarter: '', time: '' };

                let recordPlayArray = contract.recordPlay
                    .filter(recordPlay => {
                        let recordPlayDate = new Date(formatDateYMD(recordPlay.date));

                        if (filter.type === 'Theo tháng') {
                            let filterDate = new Date(formatDateYMD(`${currentDate.getDate()}/${filter.dataActive.split(' ')[1]}`));
                            return recordPlayDate.getMonth() === filterDate.getMonth() && recordPlayDate.getFullYear() === filterDate.getFullYear();
                        }
                        else {
                            let timeSplit = quarter.time.split('-');
                            let startTimeSplit = timeSplit[0].trim().split('/');
                            let endTimeSplit = timeSplit[1].trim().split('/');
                            let startDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${startTimeSplit[1]}-${startTimeSplit[0]}`));
                            let endDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${endTimeSplit[1]}-${endTimeSplit[0]}`));

                            return recordPlayDate.getMonth() >= startDate.getMonth() && recordPlayDate.getMonth() <= endDate.getMonth();
                        }
                    });

                let totalPlay = recordPlayArray.reduce((sum, item) => sum + parseInt(item.playsCount), 0);

                if (recordPlayArray.length)
                    return {
                        ...contract,
                        recordPlay: recordPlayArray,
                        totalPlay: totalPlay,
                        revenue: totalPlay * contract.CPM / 1000,
                    }

                return {
                    ...contract,
                    records: [],
                    unDistributedRevenue: 0,
                    administrativeFee: 0,
                    recordPlay: recordPlayArray,
                    totalPlay: totalPlay,
                    revenue: totalPlay * contract.CPM / 1000,
                }
            })
        );
    }, [filter, etmContract.etmContractForControl]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(etmContract.etmContractForControl);
            return;
        }

        setSearchResult(etmContract.etmContractForControl.filter(contract => contract.code.toLowerCase().includes(value)));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleForControlSubmit = useCallback(async () => {
        if (typeof currentDate === 'undefined') return;

        dispatch(checkpointAllContract({
            contracts: searchResult,
            checkpointDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        }));

        setToastActive(false);
    }, [searchResult]);

    useEffect(() => {
        if (!filter.data.length) return;

        setFilter({ ...filter, dataActive: `${monthActive.title}/${new Date().getFullYear()}` });
    }, [monthActive]);

    useEffect(() => {
        if (typeof currentDate === 'undefined') return;

        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);
        let quarters = QUARTERLY.map(quaterly => quaterly.quarter);

        if (type.title === 'Theo tháng') {
            setMonthActive({ id: 1, title: 'Tháng 1' });
            setFilter({
                ...filter,
                data: months,
                type: 'Theo tháng',
                dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
            })
        }
        else {
            setMonthActive({ id: 1, title: 'Quý 1' });
            setFilter({
                ...filter,
                data: quarters,
                type: 'Theo quý',
                dataActive: `${quarters[0]}/${currentDate.getFullYear()}`
            });
        }
    }, [type]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <CommonWrapper
            paging={paging}
            title='Báo cáo doanh thu'
            className={cx('renvenue-report-detail')}
        >
            <div className={cx('renvenue-report-detail__filter')}>
                <div>
                    <p>Theo:</p>
                    <OptionMenu
                        data={[{ id: 1, title: 'Theo tháng' }, { id: 2, title: 'Theo quý' }]}
                        setState={setType}
                        state={type}
                    />
                    <OptionMenu
                        data={filter.data.map((item, index) => ({ id: index + 1, title: item }))}
                        state={monthActive}
                        setState={setMonthActive}
                    />
                </div>
                <div style={{ width: "100%", maxWidth: "37.1rem" }}>
                    <Input
                        id="search"
                        name="search"
                        value={searchValue}
                        placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                        size="custom"
                        iconRight={images.search}
                        onChange={(event) => handleSearchChange(event)}
                    />
                </div>
            </div>
            <Table
                thead={['STT', 'Số hợp đồng', 'Dơn vị khai thác', 'Thời hạn hợp đồng', 'Loại hợp đồng',
                    'Số thiết bị đã đồng bộ', 'Tổng số lượt phát', 'Ngày chốt đối soát', '', '']}
                className={cx('container-table-data', 'renvenue-report-detail__table')}
            >
                {currentItems.map((item, index) => (
                    <tr key={index} style={{ height: '47px' }}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.code}</p></td>
                        <td><p>{item.companyName}</p></td>
                        <td><p>{item.effectiveDate} - {item.expirationDate}</p></td>
                        <td><p>{item.type}</p></td>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.totalPlay}</p></td>
                        <td><p>{item.checkpointDate}</p></td>
                        <td><p className={cx('action')} onClick={() => {
                            navigate(`/revenue/report/detail/contract/${item.docId}`);
                            setActive(false);
                        }}>Chi tiết doanh thu</p></td>
                        <td><p className={cx('action')}>Lịch sử đồng bộ trên thiết bị</p></td>
                    </tr>
                ))}
            </Table>
            <Dialog
                visible={toastActive}
                className={cx('renvenue-report-detail__form')}
            >
                <h3>Chốt doanh thu</h3>
                <div className={cx('form__content')}>
                    <p>Doanh thu sẽ được chốt từ ngày 01/05/2021 đến ngày 14/05/2021 trên tất cả các hợp đồng sử dụng. </p>
                    <p>{`Nhấn <Tiếp tục> để chốt doanh thu.`}</p>
                    <p>{`Nhấn <Hủy> để hủy bỏ và không chốt doanh thu.`}</p>
                </div>
                <div className={cx('form__action')}>
                    <Button primary onClick={() => setToastActive(false)} value="Hủy" />
                    <Button primary fill onClick={handleForControlSubmit} value="Tiếp tục" />
                </div>
            </Dialog>
            <ActionBar data={actionbar} />
            <Loading loading={etmContract.loading} />
        </CommonWrapper>
    );
};

export default RevenueReportDetailPage;