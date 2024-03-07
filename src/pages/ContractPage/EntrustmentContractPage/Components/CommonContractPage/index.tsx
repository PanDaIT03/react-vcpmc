import classNames from "classnames/bind";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { formatDateYMD, formatMoney } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState } from "~/state";
import { EtmContractForControl, OwnRecord } from "~/types/EntrustmentContractType";

import style from '~/sass/EntrustmentContractCommon.module.scss';
const cx = classNames.bind(style);

interface CommonDetailPageProps {
    title: string;
    pagingData: Array<PagingItemType>;
    actionData: Array<any>;
    style?: any
};

export const CommonDetailPage = memo(({ title, pagingData, actionData, style }: CommonDetailPageProps) => {
    const { id } = useParams();

    const { setActive } = useContext(SidebarContext);
    const etmContract = useSelector((state: RootState) => state.etmContract);
    const [entrustmentContract, setEntrustmentContract] = useState<EtmContractForControl>({} as EtmContractForControl);

    const [date, setDate] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const [searchResult, setSearchResult] = useState<Array<OwnRecord>>([] as Array<OwnRecord>);
    const [currentItems, setCurrentItems] = useState<Array<OwnRecord>>([] as Array<OwnRecord>);

    useEffect(() => {
        let currentContract = etmContract.etmContractForControl.find(contract => contract.docId === id);

        if (typeof currentContract !== 'undefined') setEntrustmentContract(currentContract);
        setActive(false);
    }, []);

    useEffect(() => {
        let monthPeriodSplit = entrustmentContract.checkpointDate?.split('/');

        entrustmentContract.records && setSearchResult(entrustmentContract.records);

        if (typeof monthPeriodSplit === 'undefined' || typeof entrustmentContract.checkpointDate === 'undefined')
            return;

        setDate(formatDateYMD(entrustmentContract.checkpointDate));
    }, [entrustmentContract]);

    useEffect(() => {
        if (typeof entrustmentContract.records === 'undefined') return;

        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(entrustmentContract.records);
            return;
        }

        setSearchResult(entrustmentContract.records.filter(record => record.nameRecord.toLowerCase().includes(value)));
    }, [searchValue, date]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <>
            {Object.keys(entrustmentContract).length
                && <CommonWrapper
                    title={title}
                    paging={pagingData}
                    className={cx('history-for-control')}
                >
                    <div className={cx("history-for-control__content")} style={style}>
                        <div className={cx('history-for-control__container-left')}>
                            <div className={cx('container-left__contract-info')}>
                                <p>Thông tin hợp đồng</p>
                                <div>
                                    <div className={cx('contract-info__left')}>
                                        <p>Số hợp đồng:</p>
                                        <p>Đơn vị khai thác:</p>
                                        <p>Loại hợp đồng:</p>
                                        <p>Hiệu lực từ:</p>
                                        <p>Ngày hết hạn:</p>
                                        <p>Giá trị hợp đồng:</p>
                                        <p>Giá trị phân phối theo ngày:</p>
                                    </div>
                                    <div className={cx('contract-info__right')}>
                                        <p>{entrustmentContract.code}</p>
                                        <p>{entrustmentContract.companyName}</p>
                                        <p>{entrustmentContract.type}</p>
                                        <p>{entrustmentContract.effectiveDate}</p>
                                        <p>{entrustmentContract.expirationDate}</p>
                                        <p>{entrustmentContract.CPM ? formatMoney(entrustmentContract.totalPlay * (entrustmentContract.CPM / 1000)).split('₫')[0] : 0} VNĐ</p>
                                        <p>{entrustmentContract.CPM ? formatMoney(entrustmentContract.totalPlay * (entrustmentContract.CPM / 1000)).split('₫')[0] : 0} VNĐ</p>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('container-left__for-control-info')}>
                                <p>Thông tin đối soát</p>
                                <div>
                                    <div className={cx('contract-info__left')}>
                                        <p>Ký đối soát:</p>
                                        <p>Số bài hát:</p>
                                        <p>Tổng số lượt phát:</p>
                                        <p>Tổng doanh thu:</p>
                                        <p>Doanh thu chưa phân phối::</p>
                                        <p>Trạng thái đối soát:</p>
                                    </div>
                                    <div className={cx('contract-info__right')}>
                                        <p>{entrustmentContract.checkpointDate}</p>
                                        <p>{entrustmentContract.records.length}</p>
                                        <p>{entrustmentContract.totalPlay}</p>
                                        <p>{entrustmentContract.CPM ? formatMoney(entrustmentContract.totalPlay * (entrustmentContract.CPM / 1000)).split('₫')[0] : 0} VNĐ</p>
                                        <p>{entrustmentContract.CPM ? formatMoney(entrustmentContract.totalPlay * (entrustmentContract.CPM / 1000)).split('₫')[0] : 0} VNĐ</p>
                                        <p>{entrustmentContract.statusForControl}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('history-for-control__container-right')}>
                            <p>Danh sách bản ghi</p>
                            <div className={cx('filter-box')}>
                                <Input
                                    name='date'
                                    title='Xem theo ngày/tuần'
                                    type='date'
                                    value={date}
                                    onChange={(e: any) => setDate(e.target.value)}
                                />
                                <Input
                                    name='searchValue'
                                    type='text'
                                    value={searchValue}
                                    onChange={(e: any) => setSearchValue(e.target.value)}
                                    placeholder='Nhập tên bài hát'
                                />
                            </div>
                            <Table
                                minWidth="1180px"
                                thead={['STT', 'Tên bài hát', 'Tổng số lượt phát', 'Tổng doanh thu',
                                    'Quyền biểu diễn', 'Quyền sản xuất', 'VCPMC']}
                                paginate={{
                                    dataForPaginate: searchResult,
                                    setCurrentItems: handleSetCurrentItems
                                }}
                                itemsPerPage={itemsPerPage}
                                setItemsPerPage={handleChange}
                            >
                                {currentItems.map((item, index) => {
                                    let revenue = typeof entrustmentContract.CPM !== 'undefined' ? formatMoney(item.totalPlay * (entrustmentContract.CPM / 1000)).split('₫')[0] : 0;
                                    let performanceRight = typeof entrustmentContract.performanceRight !== 'undefined' ? formatMoney(item.totalPlay * (entrustmentContract.performanceRight / 100)).split('₫')[0] : 0;
                                    let productionRight = typeof entrustmentContract.productionRight !== 'undefined' ? formatMoney(item.totalPlay * (entrustmentContract.productionRight / 100)).split('₫')[0] : 0;
                                    let vcpmcRight = typeof entrustmentContract.vcpmcRight !== 'undefined' ? formatMoney(item.totalPlay * (entrustmentContract.vcpmcRight / 100)).split('₫')[0] : 0;

                                    return (
                                        <tr key={item.docId} style={{ height: '47px' }}>
                                            <td><p>{index + 1}</p></td>
                                            <td><p>{item.nameRecord}</p></td>
                                            <td><p>{item.totalPlay}</p></td>
                                            <td><p>{revenue}</p></td>
                                            <td><p>{performanceRight}</p></td>
                                            <td><p>{productionRight}</p></td>
                                            <td><p>{vcpmcRight}</p></td>
                                        </tr>
                                    )
                                })}
                            </Table>
                        </div>
                    </div>
                    <Loading loading={etmContract.loading} />
                </CommonWrapper>}
        </>
    );
})