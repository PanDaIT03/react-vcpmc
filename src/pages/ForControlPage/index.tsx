import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { images } from "~/assets";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { formatDateYMD, formatMoney } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { EtmContractForControl } from "~/types/EntrustmentContractType";
import { getEtmContractForControls } from "~/state/thunk/entrustmentContract";

import style from '~/sass/ForControl.module.scss';
const cx = classNames.bind(style);

function ForControlHistoryPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setCurrentPage } = useContext(SidebarContext);

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [date, setDate] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [currentItems, setCurrentItems] = useState<Array<EtmContractForControl>>([] as Array<EtmContractForControl>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: '#',
                active: true
            }, {
                title: 'Lịch sử đối soát',
                to: '#',
                active: true
            }
        ]);

        dispatch(getEtmContractForControls());

        const currentDate = new Date();
        setDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`)

        setActive(true);
        setCurrentPage(5);
    }, []);

    useEffect(() => {
        setSearchResult(etmContract.etmContractForControl);
    }, [etmContract.etmContractForControl]);

    useEffect(() => {
        setSearchResult(etmContract.etmContractForControl.filter(contract =>
            contract.checkpointDate &&
            +new Date(formatDateYMD(contract.checkpointDate)).getMonth() === +new Date(date).getMonth() &&
            +new Date(formatDateYMD(contract.checkpointDate)).getFullYear() === +new Date(date).getFullYear()
        ));
    }, [date]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(etmContract.etmContractForControl);
            return;
        }

        setSearchResult(etmContract.etmContractForControl.filter(contract =>
            contract.records.some(record => record.title.toLowerCase().includes(value))
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    return (
        <CommonWrapper
            title='Lịch sử đối soát doanh thu'
            paging={paging}
            className={cx('history-for-control')}
        >
            <div className={cx("history-for-control__content")}>
                <div className={cx('history-for-control__filter')}>
                    <div>
                        <p style={{ marginRight: '16px' }}>Thời gian thực hiện:</p>
                        <Input
                            id="date"
                            name="date"
                            type='date'
                            value={date}
                            size="custom"
                            onChange={(event) => handleSearchDateChange(event)}
                        />
                    </div>
                    <Input
                        id="search"
                        name="search"
                        type='text'
                        value={searchValue}
                        placeholder="Nhập tên bài hát"
                        size="custom"
                        iconRight={images.search}
                        onChange={(event) => handleSearchChange(event)}
                        onIconRightClick={() => { }}
                    />
                </div>
                <p
                    style={{ fontSize: "24px", fontWeight: "700", margin: "24px 0" }}
                >Danh sách hợp đồng khai thác đã đối soát</p>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    thead={['STT', 'Số hợp đồng', 'Đơn vị khai thác', 'Thời hạn hợp đồng', 'Loại hợp đồng',
                        'Tổng lượt phát', 'Tổng doanh thu', 'Doanh thu chưa phân phối', 'Ngày chốt đối soát', '']}
                    className={cx('history-for-control__table', 'container-table-data')}
                >
                    {currentItems.map((item, index) => {
                        let CPM = item.CPM || 0;

                        return (
                            <tr key={item.docId} style={{ height: '47px' }}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.code}</p></td>
                                <td><p>{item.companyName}</p></td>
                                <td><p>{item.expirationDate}</p></td>
                                <td><p>{item.type}</p></td>
                                <td><p>{item.totalPlay}</p></td>
                                <td><p>{formatMoney(item.totalPlay * (CPM / 1000)).split('₫')[0]}</p></td>
                                <td><p>{item.unDistributedRevenue}</p></td>
                                <td><p>{item.checkpointDate}</p></td>
                                <td><p
                                    className={cx('action')}
                                    onClick={() => {
                                        navigate(`/for-control/history/detail/${item.docId}`);
                                        setActive(false);
                                    }}
                                >
                                    Xem chi tiết
                                </p></td>
                            </tr>
                        )
                    })}
                </Table>
            </div>
            <Loading loading={etmContract.loading} />
        </CommonWrapper>
    );
}

export default ForControlHistoryPage;