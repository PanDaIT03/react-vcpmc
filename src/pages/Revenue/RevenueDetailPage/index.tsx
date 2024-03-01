import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { formatMoney } from "~/constants";
import { RootState } from "~/state";
import { ContractDetail, IRecord } from "~/types";
import { RecordDetail } from "~/types/AuthorizedPartnerType";
import { RecordPlays } from "~/types/RecordPlayType";

import style from '~/sass/RevenueDetail.module.scss';
const cx = classNames.bind(style);

function RevenueDistributionDetailPage() {
    const { id } = useParams();

    const contract = useSelector((state: RootState) => state.contract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [contractDetail, setContractDetail] = useState<ContractDetail>({} as ContractDetail);
    const [searchResult, setSearchResult] = useState<Array<RecordDetail>>([] as Array<RecordDetail>);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentItems, setCurrentItems] = useState<Array<RecordDetail>>([] as Array<RecordDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [itemActive, setItemActive] = useState<RecordDetail & { totalPlay: number, revenue: number }>({
        records: {} as IRecord,
        recordPlays: [] as Array<RecordPlays>,
        totalPlay: 0,
        revenue: 0
    } as RecordDetail & { totalPlay: number, revenue: number });
    const [currentItemsActive, setCurrentItemsActive] = useState<Array<RecordPlays>>([] as Array<RecordPlays>);
    const [itemsActivePerPage, setItemsActivePerPage] = useState<string>('8');

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: routes.RevenueDistributionPage,
                active: true
            }, {
                title: 'Phân phối doanh thu',
                to: routes.RevenueDistributionPage,
                active: true
            }, {
                title: 'Chi tiết doanh thu',
                to: '#',
                active: false
            }
        ]);

        const contractDetail = contract.contractDetails.find(contractDetail => contractDetail.contract.docId === id) || {} as ContractDetail

        setContractDetail(contractDetail);
        setSearchResult(contractDetail.records);
    }, []);

    useEffect(() => {
        if (typeof contractDetail.records === 'undefined') return;

        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setCurrentItems(contractDetail.records);
            return;
        }

        setCurrentItems(contractDetail.records.filter(record =>
            record.records.nameRecord.toLowerCase().includes(value))
        );
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleRecordItemClick = (item: RecordDetail) => {
        let revenue = item.totalPlay * parseInt(contractDetail.contract.CPM) / 1000;

        setItemActive({ ...item, revenue: revenue });
    }

    const handleSetCurrentItemActive = useCallback((items: Array<any>) => {
        setCurrentItemsActive(items);
    }, []);

    const handleChangeItemActive = useCallback((value: string) => {
        setItemsActivePerPage(value);
    }, []);

    return (
        <>{Object.keys(contractDetail).length > 0 &&
            <CommonWrapper
                title={`Hợp đồng Ủy quyền ${contractDetail.contract.contractCode} -${contractDetail.date}`}
                paging={paging}
                className={cx('revenue-detail')}
            >
                <div className={cx('revenue-detail__filter')}>
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
                <div className={cx('revenue-detail__table')}>
                    <Table
                        paginate={{
                            dataForPaginate: searchResult,
                            setCurrentItems: handleSetCurrentItems
                        }}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleChange}
                        thead={['STT', 'Bài hát', 'Số lượt phát', 'Doanh thu (VNĐ)', 'Hành chính phí (VNĐ)', 'Nhuận bút (VNĐ)']}
                        className={cx('revenue-detail__table-record')}
                    >
                        <tr style={{ height: '56px' }}>
                            <td><p>Tổng</p></td>
                            <td><p>{currentItems.length}</p></td>
                            <td><p>{currentItems.reduce((sum, item) => sum + item.totalPlay, 0)}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000).split('₫')[0]}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000 * parseInt(contractDetail.contract.administrativeFee) / 100).split('₫')[0]}</p></td>
                            <td><p>{formatMoney(currentItems.reduce((sum, item) => sum + item.totalPlay, 0) * parseInt(contractDetail.contract.CPM) / 1000 * parseInt(contractDetail.contract.royalties) / 100).split('₫')[0]}</p></td>
                        </tr>
                        {currentItems.map((item, index) => {
                            let revenue = item.totalPlay * parseInt(contractDetail.contract.CPM) / 1000;
                            let royalties = revenue * parseInt(contractDetail.contract.royalties) / 100;
                            let administrativeFee = revenue * parseInt(contractDetail.contract.administrativeFee) / 100;

                            return (
                                <tr key={item.records.docId} style={{ height: '56px' }} className={cx('table-record__tr__item')} onClick={() => handleRecordItemClick(item)}>
                                    <td><p style={{ textAlign: 'center' }}>{index + 1}</p></td>
                                    <td><p>{item.records.nameRecord}</p></td>
                                    <td><p>{item.totalPlay}</p></td>
                                    <td><p>{formatMoney(revenue).split('₫')[0]}</p></td>
                                    <td><p>{formatMoney(administrativeFee).split('₫')[0]}</p></td>
                                    <td><p>{formatMoney(royalties).split('₫')[0]}</p></td>
                                </tr>
                            )
                        })}
                    </Table>
                    <div className={cx('table-right')}>
                        <p className={cx('table-right__title')}>Doanh thu bản ghi</p>
                        <p className={cx('table-right__record-name')}>{itemActive.records.nameRecord || 'Tên bản ghi'}</p>
                        <Table
                            thead={['Đơn vị khai thác', 'Số lượt phát', 'Doanh thu (VNĐ)']}
                            className={cx('table__record-plays')}
                            paginate={{
                                dataForPaginate: itemActive.recordPlays,
                                setCurrentItems: handleSetCurrentItemActive
                            }}
                            itemsPerPage={itemsActivePerPage}
                            setItemsPerPage={handleChangeItemActive}
                        >
                            <tr style={{ height: '47px' }}>
                                <td><p>Tổng</p></td>
                                <td><p>{itemActive.recordPlays.reduce((sum, item) => sum + parseInt(item.playsCount), 0)}</p></td>
                                <td><p>{formatMoney(itemActive.revenue).split('₫')[0]}</p></td>
                            </tr>
                            {currentItemsActive.map((item) => {
                                let revenue = parseInt(item.playsCount) * parseInt(contractDetail.contract.CPM) / 1000;

                                return (
                                    <tr key={item.id} style={{ height: '47px' }} className={cx('table-record__tr__item')}>
                                        <td><p>CTy TNHH A</p></td>
                                        <td><p>{item.playsCount}</p></td>
                                        <td><p>{formatMoney(revenue).split('₫')[0]}</p></td>
                                    </tr>
                                )
                            })}
                        </Table>
                    </div>
                </div>
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Xuất dữ liệu"
                        icon={images.fileExport}
                        onClick={() => { }}
                    />
                </ActionBar>
                <Loading loading={loading} />
            </CommonWrapper>
        }</>
    );
}

export default RevenueDistributionDetailPage;