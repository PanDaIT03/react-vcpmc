import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { Filter } from "~/components/Filter";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { getEtmContractList } from "~/state/thunk/entrustmentContract";
import { IGlobalConstantsType } from "~/types";
import { EtmContract } from "~/types/EntrustmentContractType";

import styles from "~/sass/EntrustmentContract.module.scss";
const cx = classNames.bind(styles);

function EntrustmentContract() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const entrustmentContract = useSelector((state: RootState) => state.etmContract);

    const [searchValue, setSearchValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');

    const [searchResult, setSearchResult] = useState<EtmContract[]>([]);
    const [search, setSearch] = useState<Pick<IGlobalConstantsType, "tag">>({});
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [itemsCurrent, setItemsCurrent] = useState<Array<EtmContract>>([] as Array<EtmContract>);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        setActionbar([{
            icon: images.uPlus,
            title: "Thêm hợp đồng",
            onClick: () => navigate(routes.AddEntrustmentContractPage)
        }]);

        dispatch(getEtmContractList());
    }, []);

    useEffect(() => {
        setSearchResult(entrustmentContract.etmContractList);
    }, [entrustmentContract.etmContractList]);

    useEffect(() => {
        setSearch({
            tag: <Input
                id="search"
                name="search"
                size="custom"
                value={searchValue}
                iconRight={images.search}
                placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                onChange={(event) => handleInputChange(event)}
                className={cx('search-input')}
            />
        });
    }, [searchValue]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (value === '') {
            setSearchResult(entrustmentContract.etmContractList);
            return;
        };

        setSearchResult(entrustmentContract.etmContractList.filter(contract =>
            contract.code.toLowerCase().includes(value) || contract.name.toLowerCase().includes(value)
        ));
    }, [searchValue]);

    const handleChange = (value: string) => {
        setItemsPerPage(value);
    };

    const handleSetCurrentItems = useCallback((item: Array<EtmContract>) => {
        setItemsCurrent(item);
    }, []);

    return (
        <div className={cx('entrustment-contract-wrapper')}>
            <Filter data={[]} search={search} />
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
                            <td><p className={cx('action')}>Sao chép hợp đồng</p></td>
                        </tr>
                    );
                })}
            </Table>
            <ActionBar visible={true} data={actionbar} />
            <Loading loading={entrustmentContract.loading} />
        </div>
    );
};

export default EntrustmentContract;