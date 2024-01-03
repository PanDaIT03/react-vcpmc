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
import { Switch } from "~/components/Switch";
import { Table } from "~/components/Table";
import { Tab, Tabs } from "~/components/Tabs";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getFunctionalTypes, getFunctionals } from "~/state/thunk/functional";
import { deleteRole, getRoleList } from "~/state/thunk/role/role";
import { getUsers } from "~/state/thunk/user/user";
import { Role, User } from "~/types";

import style from '~/sass/AuthorizationUser.module.scss';
const cx = classNames.bind(style);

function UserAuthorizationPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive, setCurrentPage } = useContext(SidebarContext);

    const user = useSelector((state: RootState) => state.user);
    const role = useSelector((state: RootState) => state.role);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<User>>([] as Array<User>);
    const [currentItems, setCurrentItems] = useState<Array<User>>([] as Array<User>);
    const [searchRoleResult, setSearchRoleResult] = useState<Array<Role>>([] as Array<Role>);
    const [currentRoleItems, setCurrentRoleItems] = useState<Array<Role>>([] as Array<Role>);
    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [displayUserTable, setDisplayUserTable] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: '#',
                active: true
            }, {
                title: 'Phân quyền người dùng',
                to: '#',
                active: true
            }
        ]);

        dispatch(getUsers());
        dispatch(getRoleList());
        dispatch(getFunctionalTypes());
        dispatch(getFunctionals());

        setActive(true);
        setCurrentPage(6)
    }, []);

    useEffect(() => {
        if (user.loading) setLoading(true);
        else if (role.loading) setLoading(true);
        else setLoading(false);
    }, [user.loading, role.loading]);

    useEffect(() => {
        setSearchResult(user.users);
    }, [user.users]);

    useEffect(() => {
        setSearchRoleResult(role.roleDetails);
    }, [role.roleDetails]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();

        if (displayUserTable) {
            if (value === '') {
                setSearchResult(user.users);
                return;
            }

            setSearchResult(user.users.filter(user =>
                user.userName.toLowerCase().includes(value) ||
                user.firstName.toLowerCase().includes(value) ||
                user.lastName.toLowerCase().includes(value)
            ));
        }
        else {
            if (value === '') {
                setSearchRoleResult(role.roleDetails);
                return;
            }

            setSearchRoleResult(role.roleDetails.filter(role => role.name.toLowerCase().includes(value)));
        }
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleSetCurrentRoleItems = useCallback((items: Array<any>) => {
        setCurrentRoleItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    return (
        <CommonWrapper
            title='Danh sách người dùng'
            paging={paging}
            className={cx('authorization-user-container')}
        >
            <div className={cx('authorization-user-container__filter')}>
                <Tabs>
                    <Tab
                        visible={displayUserTable}
                        title="Danh sách người dùng"
                        onClick={() => setDisplayUserTable(true)}
                    />
                    <Tab
                        visible={!displayUserTable}
                        title="Vai trò người dùng"
                        onClick={() => setDisplayUserTable(false)}
                    />
                </Tabs>
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
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                paginateClass={cx('table__row__paginate')}
                className={cx('container-table-data', displayUserTable ? 'active' : 'disable')}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Họ tên', 'Tên đăng nhập', 'Vai trò', 'Trạng thái', 'Email', 'Số điện thoại', 'Ngày hết hạn', '']}
            >
                {currentItems.map((item, index) => (
                    <tr key={index}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.firstName} {item.lastName}</p></td>
                        <td><p>{item.userName}</p></td>
                        <td><p>{item.role.name}</p></td>
                        <td><Switch status={item.status === 'active'} title='Đang kích hoạt' /></td>
                        <td><p>{item.email}</p></td>
                        <td><p>{item.phoneNumber}</p></td>
                        <td><p>{item.expirationDate}</p></td>
                        <td><p
                            className={cx('action')}
                            onClick={() => { navigate(`/authorization/user/${item.docId}/edit`); setActive(false); }}
                        >
                            Chỉnh sửa
                        </p></td>
                    </tr>
                ))}
            </Table>
            <Table
                paginate={{
                    dataForPaginate: searchRoleResult,
                    setCurrentItems: handleSetCurrentRoleItems
                }}
                paginateClass={cx('table__row__paginate')}
                className={cx('container-table-data', !displayUserTable ? 'active' : 'disable')}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                thead={['STT', 'Tên nhóm người dùng', 'Số lượng người dùng', 'Vai trò', 'Mô tả', '', '']}
            >
                {currentRoleItems.map((item, index) => (
                    <tr key={index}>
                        <td><p>{index + 1}</p></td>
                        <td><p>{item.name}</p></td>
                        <td><p>{user.users.filter(user => user.rolesId === item.docId).length}</p></td>
                        <td><p>{item.role}</p></td>
                        <td><p className={cx('table__col__description')}>{item.description}</p></td>
                        <td><p className={cx('action')} onClick={() => {
                            navigate(`/authorization/role/edit/${item.docId}`);
                            setActive(false);
                        }}>Cập nhật</p></td>
                        <td>{item.allowDelete
                            && <p className={cx('action')} onClick={() => { dispatch(deleteRole(item.docId)) }}>Xóa</p>
                        }</td>
                    </tr>
                ))}
            </Table>
            <ActionBar visible={true}>
                {displayUserTable
                    ? <ActionBarItem
                        title="Thêm người dùng"
                        icon={images.userPlus}
                        onClick={() => navigate(routes.AuthorizedAddUserPage)}
                    />
                    : <ActionBarItem
                        title="Thêm vai trò"
                        icon={images.users}
                        onClick={() => navigate(routes.AuthorizedAddRolePage)}
                    />}
            </ActionBar>
            <Loading loading={loading} />
        </CommonWrapper>
    );
}

export default UserAuthorizationPage;