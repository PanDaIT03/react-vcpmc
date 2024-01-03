import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { Checkbox } from "~/components/Checkbox";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { Table } from "~/components/Table";
import { RootState, useAppDispatch } from "~/state";
import { Loading } from "~/components/Loading";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { EtmContractDetail } from "~/types/EntrustmentContractType";
import { deleteContracts, getEtmContractListDetail } from "~/state/thunk/entrustmentContract";

import style from '~/sass/UnitManagement.module.scss';
const cx = classNames.bind(style);

function UnitUsedManagementPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive } = useContext(SidebarContext);

    const entrustmentContract = useSelector((state: RootState) => state.etmContract);
    const { etmContractsDetail } = entrustmentContract;

    const [searchValue, setSearchValue] = useState<string>('');
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [searchResult, setSearchResult] = useState<Array<EtmContractDetail>>([] as Array<EtmContractDetail>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [currentItems, setCurrentItems] = useState<Array<EtmContractDetail>>([] as Array<EtmContractDetail>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [itemsChosen, setItemsChosen] = useState<Array<EtmContractDetail>>([] as Array<EtmContractDetail>);

    useEffect(() => {
        setActive(true);

        setPaging([
            {
                title: 'Quản lý',
                to: '#',
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: '#',
                active: true
            }
        ]);

        dispatch(getEtmContractListDetail());
        etmContractsDetail.length > 0 && setSearchResult(etmContractsDetail);
    }, []);

    const handleDeleteContract = useCallback((itemsChosen: Array<EtmContractDetail>) => {
        dispatch(deleteContracts(itemsChosen));
    }, []);

    useEffect(() => {
        setActionData([
            {
                icon: <FontAwesomeIcon icon={faXmark} className={cx('action__remove')} />,
                title: 'Xóa',
                onClick: () => handleDeleteContract(itemsChosen),
                disable: itemsChosen.length === 0
            }
        ]);
    }, [itemsChosen]);

    useEffect(() => {
        setSearchResult(etmContractsDetail);
    }, [etmContractsDetail]);

    useEffect(() => {
        if (!etmContractsDetail.length) return;

        if (searchValue === '') {
            setSearchResult(etmContractsDetail);
            return;
        }

        let value = searchValue.trim().toLowerCase();

        setSearchResult(etmContractsDetail.filter(contract =>
            contract.user.userName.toLowerCase().includes(value) ||
            contract.code.toLowerCase().includes(value) ||
            contract.createdBy.docId.includes(value) ||
            contract.user.docId.includes(value)
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleChosenItem = (checked: boolean, item: EtmContractDetail) => {
        checked
            ? setItemsChosen(itemsChosen.filter(itemChosen => itemChosen.docId !== item.docId))
            : setItemsChosen([...itemsChosen, item]);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className={cx('unit-management-container')}>
            <CommonWrapper
                paging={paging}
                title='Danh sách đơn vị sử dụng'
            >
                <div className={cx("search")}>
                    <Input
                        id="search"
                        name="search"
                        value={searchValue}
                        placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                        size="custom"
                        iconRight={images.search}
                        onChange={(event) => handleSearchChange(event)}
                        onIconRightClick={() => { }}
                    />
                </div>
                <Table
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    headerChildren={
                        <th className={cx('table__row__checkbox')} style={{ paddingRight: '42px', cursor: 'pointer' }}>
                            <Checkbox
                                checked={itemsChosen.length === currentItems.length}
                                onClick={() => itemsChosen.length === currentItems.length ? setItemsChosen([]) : setItemsChosen(currentItems)}
                            />
                        </th>
                    }
                    className={cx('container-table-data', 'unit-management-table')}
                    thead={['STT', 'Tên tài khoản quản trị', 'Số hợp đồng', 'Admin', 'Người dùng',
                        'Thiết bị được chỉ định', 'Ngày hết hạn', 'Trạng thái', '']}
                >
                    {currentItems.map((item, index) => {
                        let checked = typeof itemsChosen.find(itemChosen => itemChosen.docId === item.docId) !== 'undefined';

                        return (
                            <tr key={index} style={{ height: '47px', cursor: 'pointer' }} onClick={() => handleChosenItem(checked, item)}>
                                <td className={cx('table__row__checkbox')}><Checkbox
                                    checked={checked}
                                    onClick={() => handleChosenItem(checked, item)}
                                /></td>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.createdBy.userName}</p></td>
                                <td><p>{item.code}</p></td>
                                <td><p>{item.createdBy.docId}</p></td>
                                <td><p>{item.employeeIds?.length}</p></td>
                                <td><p>{1}</p></td>
                                <td><p>{item.expirationDate}</p></td>
                                <td>{<Switch
                                    title={item.user.status === 'active' ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}
                                    status={item.user.status === 'active'}
                                    onClick={() => { }} />
                                }</td>
                                <td><p className={cx('action')} onClick={() => {
                                    navigate(`/unit-used-management/detail/${item.docId}`);
                                    setActive(false);
                                }}>
                                    Xem chi tiết
                                </p></td>
                            </tr>
                        )
                    })}
                </Table>
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Xóa"
                        icon={images.fiX}
                        onClick={() => { }}
                    />
                </ActionBar>
                <Loading loading={entrustmentContract.loading} />
            </CommonWrapper>
        </div>
    );
}

export default UnitUsedManagementPage;