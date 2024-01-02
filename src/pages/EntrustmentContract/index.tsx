import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { Input } from "~/components/Input";
import { Table } from "~/components/Table";
import { RootState, useAppDispatch } from "~/state";
import { getEtmContractList } from "~/state/thunk/entrustmentContractThunk";

import { EtmContract } from "~/api/entrustmentContract";
import styles from "~/sass/EntrustmentContract.module.scss";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { Loading } from "~/components/Loading";
import { routes } from "~/config/routes";
const cx = classNames.bind(styles);

function EntrustmentContract() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const entrustmentContract = useSelector((state: RootState) => state.etmContract);

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<EtmContract[]>([]);
    const [itemsCurrent, setItemsCurrent] = useState<Array<EtmContract>>([] as Array<EtmContract>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        dispatch(getEtmContractList());
    }, []);

    useEffect(() => {
        setSearchResult(entrustmentContract.etmContractList);
    }, [entrustmentContract.etmContractList]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(entrustmentContract.etmContractList);
            return;
        }

        setSearchResult(entrustmentContract.etmContractList.filter(contract =>
            contract.code.toLowerCase().includes(value) || contract.name.toLowerCase().includes(value)
        ));
    }, [searchValue]);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    }

    const handleSetCurrentItems = useCallback((item: Array<EtmContract>) => {
        setItemsCurrent(item);
    }, []);

    return (
        <div className={cx('entrustment-contract-wrapper')}>
            <Input
                id="search"
                name="search"
                value={searchValue}
                placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                size="custom"
                iconRight={images.search}
                onChange={(event) => handleInputChange(event)}
                className={cx('search-input')}
            />
            <Table
                thead={['STT', 'Số hợp đồng', 'Khách hàng', 'Ngày tạo',
                    'Ngày hiệu lực', 'Ngày hết hạn', 'Hiệu lực hợp đồng', '', '']}
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                className={cx("entrusment-contract")}
            >
                {itemsCurrent.map((contract, index) => {
                    let status = 'cancelled';
                    if (contract.status === 'Mới')
                        status = 'new';
                    if (contract.status === 'Đang hiệu lực')
                        status = 'still';
                    if (contract.status === 'Hết hiệu lực')
                        status = 'expiration';

                    return (
                        <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{contract.code}</p></td>
                            <td><p>{contract.name}</p></td>
                            <td><p>{contract.createdDate}</p></td>
                            <td><p>{contract.effectiveDate}</p></td>
                            <td><p>{contract.expirationDate}</p></td>
                            <td><p className={cx('status', status)}>{contract.status}</p></td>
                            <td><p className={cx('action')} onClick={() => navigate(`/contract-management/entrustment-contract/detail/${contract.docId}`)}>Xem chi tiết</p></td>
                            <td><p className={cx('action')} onClick={() => navigate(`/entrustment-contract/copy/${contract.docId}`)}>Sao chép hợp đồng</p></td>
                        </tr>
                    );
                })}
            </Table>
            <ActionBar visible={true}>
                <ActionBarItem
                    title="Thêm hợp đồng"
                    icon={images.uPlus}
                    onClick={() => navigate(routes.AddEntrustmentContract)}
                />
            </ActionBar>
            <Loading loading={entrustmentContract.loading} />
        </div>
    );
}

export default EntrustmentContract;