import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { Checkbox } from "~/components/Checkbox";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Filter } from "~/components/Filter";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { Toast } from "~/components/Toast";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { setStatus } from "~/state/reducer/entrustmentContract";
import { deleteEmployees } from "~/state/thunk/entrustmentContract";
import { getUsers } from "~/state/thunk/user/user";
import { User } from "~/types";
import { EtmContractDetail } from "~/types/EntrustmentContractType";

import style from '~/sass/UnitUsedDetail.module.scss';
const cx = classNames.bind(style);

function UnitUsedDetailPage() {
    const { id } = useParams();

    const { setActive } = useContext(SidebarContext);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [searchValue, setSearchValue] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [toastVisible, setToastVisible] = useState<boolean>(false);

    const [itemsChosen, setItemsChosen] = useState<Array<User>>([] as Array<User>);
    const [searchResult, setSearchResult] = useState<Array<User>>([] as Array<User>);
    const [currentItems, setCurrentItems] = useState<Array<User>>([] as Array<User>);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [contractDetail, setContractDetail] = useState<EtmContractDetail>({} as EtmContractDetail);

    const search = {
        tag: <Input
            id="search"
            name="search"
            value={searchValue}
            placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
            size="custom"
            iconRight={images.search}
            onChange={(event) => handleSearchChange(event)}
            onIconRightClick={() => { }}
        />
    };

    useEffect(() => {
        setPaging([
            {
                title: 'Quản lý',
                to: routes.UnitUsedManagementPage,
                active: true
            }, {
                title: 'Đơn vị sử dụng',
                to: routes.UnitUsedManagementPage,
                active: true
            }, {
                title: 'Chi tiết',
                to: '#',
                active: true
            }
        ]);

        user.users.length <= 0 && dispatch(getUsers());

        setActive(false);
    }, []);

    const handleDeleteEmployees = useCallback(() => {
        if (typeof contractDetail === 'undefined') return;
        if (typeof contractDetail.employeeIds === 'undefined') return;

        const employeeChosen = itemsChosen.map(itemChosen => itemChosen.docId);
        const currentEmployees = contractDetail.employeeIds.filter((employeeId: string) => !employeeChosen.some(id => id === employeeId));

        dispatch(deleteEmployees({
            currentEmployees: currentEmployees,
            employeeIds: employeeChosen,
            id: contractDetail.docId
        }));
    }, [itemsChosen, contractDetail]);

    useEffect(() => {
        const currentContract = etmContract.etmContractsDetail.find(contract => contract.docId === id);
        if (typeof currentContract === 'undefined') return;

        setContractDetail(currentContract);
    }, [etmContract.etmContractsDetail]);


    useEffect(() => {
        if (!user.users.length || Object.keys(contractDetail).length <= 0) return;

        setSearchResult(user.users.filter(user =>
            contractDetail.employeeIds && contractDetail.employeeIds.some((empolyeeId: string) => empolyeeId === user.docId))
        );
    }, [user.users, contractDetail]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleChosenItem = useCallback((checked: boolean, user: User) => {
        checked
            ? setItemsChosen(prev => prev.filter(item => item.docId !== user.docId))
            : setItemsChosen([...itemsChosen, user]);
    }, [itemsChosen]);

    const handleSuccessToast = () => {
        setToastVisible(false);
        dispatch(setStatus(''));
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    return (
        <>{Object.keys(contractDetail).length &&
            <CommonWrapper
                paging={paging}
                title={`Đơn vị sử dụng - ${contractDetail.name}`}
                className={cx('unit-detail-container')}
            >
                <Filter data={[]} search={search} />
                <Table
                    thead={['STT', 'Tên người dùng', 'Vai trò', 'Email',
                        'Tên đăng nhập', 'Cập nhật lần cuối', 'Trạng thái', '']}
                    paginate={{
                        dataForPaginate: searchResult,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                    headerChildren={<th className={cx('table__row__checkbox')}>
                        <Checkbox
                            checked={itemsChosen.length === contractDetail.employeeIds?.length}
                            onClick={() => {
                                let checkedAll = itemsChosen.length === contractDetail.employeeIds?.length;

                                checkedAll ? setItemsChosen([]) : setItemsChosen(user.users.filter(user =>
                                    contractDetail.employeeIds?.some(employee =>
                                        employee === user.docId)
                                ));
                            }}
                        />
                    </th>}
                    className={cx('container-table-data', 'unit-detail-container__table')}
                >
                    {currentItems.map((item, index) => {
                        let checked = typeof itemsChosen.find(itemChosen => itemChosen.docId === item.docId) !== 'undefined';
                        let isActive = item.status?.toLowerCase() === 'active';

                        return (
                            <tr key={index} className={cx('table__row-item')} style={{ height: '47px', cursor: 'pointer' }} onClick={() => handleChosenItem(checked, item)}>
                                <td><Checkbox checked={checked} onClick={() => handleChosenItem(checked, item)} /></td>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.firstName} {item.lastName}</p></td>
                                <td><p>{item.role.name}</p></td>
                                <td><p>{item.email}</p></td>
                                <td><p>{item.userName}</p></td>
                                <td><p>{item.userName}</p></td>
                                <td><p className={cx(isActive ? 'active' : 'deactive')}>{isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}</p></td>
                                <td><p className={cx('action')} onClick={() => {
                                    navigate(`/unit-used-management/detail/${contractDetail.docId}/user/${item.docId}`);
                                    setActive(false);
                                }}>Xem chi tiết</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Thêm người dùng"
                        icon={images.uPlus}
                        onClick={() => navigate(`/unit-used-management/detail/${contractDetail.docId}/user/add`)}
                    />
                    <ActionBarItem
                        title="Xóa"
                        icon={images.fiX}
                        onClick={handleDeleteEmployees}
                        disable={itemsChosen.length <= 0}
                    />
                    <ActionBarItem
                        title="Vai trò"
                        icon={images.uPlus}
                        onClick={() => navigate('')}
                    />
                </ActionBar>
                <Toast
                    message='Thêm người dùng thành công!'
                    visible={etmContract.status === 'add successfully'}
                />
                <Loading loading={etmContract.loading} />
            </CommonWrapper>
        }</>
    );
}

export default UnitUsedDetailPage;