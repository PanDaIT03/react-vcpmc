import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Switch } from "~/components/Switch";
import { Table } from "~/components/Table";
import { getCurrentDateMDY } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { getAuthorizedContracts } from "~/state/thunk/authorizedPartner";
import { AuthorizedContractDetail } from "~/types/AuthorizedPartnerType";
import { images } from "~/assets";
import { Input } from "~/components/Input";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";

import style from '~/sass/AuthorizedPartner.module.scss';
const cx = classNames.bind(style);

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Quản lý',
        to: '#',
        active: true
    }, {
        title: 'Đối tác uỷ quyền',
        to: '#',
        active: true
    }
];

function AuthorizedPartnerPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { contracts, loading } = useSelector((state: RootState) => state.authorized);

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [searchValue, setSearchValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState('8');
    const [searchResult, setSearchResult] = useState<AuthorizedContractDetail[]>([] as AuthorizedContractDetail[]);
    const [currentItems, setCurrentItems] = useState<AuthorizedContractDetail[]>([] as AuthorizedContractDetail[]);

    useEffect(() => {
        setActive(true);
        setCurrentPage(4);
        dispatch(getAuthorizedContracts());
    }, []);

    useEffect(() => {
        setSearchResult(contracts);
    }, [contracts]);

    useEffect(() => {
        const search = searchValue.toLowerCase().trim();

        setSearchResult(contracts.filter(item =>
            item.authorizedPerson.firstName.toLowerCase().includes(search) ||
            item.authorizedPerson.lastName.toLowerCase().includes(search) ||
            item.authorizedPerson.userName.toLowerCase().includes(search) ||
            item.authorizedPerson.email.toLowerCase().includes(search) ||
            item.authorizedPerson.phoneNumber.toLowerCase().includes(search) ||
            item.expirationDate.toLowerCase().includes(search)
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleClickSearch = () => { };

    return (
        <div className={cx('authorized-contract-container')}>
            <CommonWrapper
                paging={PAGING_ITEMS}
                title='Danh sách đối tác ủy quyền'
            // search={{
            //     placeHolder: 'Họ tên, tên đăng nhập, email...',
            //     searchValue: searchValue,
            //     setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
            // }}
            >
                <div className={cx("search")}>
                    <Input
                        id="search"
                        name="search"
                        size="custom"
                        placeholder="Họ tên, tên đăng nhập, email..."
                        value={searchValue}
                        iconRight={images.search}
                        onChange={(event) => setSearchValue(event.target.value)}
                        onIconRightClick={handleClickSearch}
                    />
                </div>
                <Table
                    // paginate={{
                    //     dataForPaginate: searchResult,
                    //     setCurrentItems: handleSetCurrentItems
                    // }}
                    // paginateClass={cx('table__row__paginate')}
                    // loading={authorizedContract.loading}
                    // itemsPerPage={itemsPerPage}
                    // setItemsPerPage={handleChange}
                    thead={['STT', 'Họ tên', 'Tên đăng nhập', 'Email', 'Ngày hết hạn', 'Số điện thoại', 'Trạng thái', '']}
                >
                    {searchResult.map((item, index) => {
                        let isExpirationDate = item.expirationDate > getCurrentDateMDY();

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.authorizedPerson.firstName} {item.authorizedPerson.lastName}</td>
                                <td>{item.authorizedPerson.userName}</td>
                                <td>{item.authorizedPerson.email}</td>
                                <td>{item.expirationDate}</td>
                                <td>{item.authorizedPerson.phoneNumber}</td>
                                <td>{<Switch
                                    title={isExpirationDate ? 'Đang kích hoạt' : 'Ngừng kích hoạt'}
                                    status={isExpirationDate}
                                    onClick={() => { }} />
                                }</td>
                                <td
                                    className={cx('action')}
                                    onClick={() => navigate(`/authorized-partner/edit/${item.docId}`)}
                                >Cập nhật</td>
                            </tr>
                        );
                    })}
                </Table>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};
export default AuthorizedPartnerPage;