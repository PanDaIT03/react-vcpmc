import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import Button from "~/components/Button";
import { CancleForm } from "~/components/CancelForm";
import { Dialog } from "~/components/Dialog";
import { Filter } from "~/components/Filter";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { IOptionMenu } from "~/components/OptionMenu";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { CB_OWNER_ITEMS, VALIDITY_CONTRACT_ITEMS } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getContractsAction } from "~/state/thunk/contract";
import { IContract, IGlobalConstantsType, IOwnerShip, IUserDetail } from "~/types";

import styles from "~/sass/AuthorizationContract.module.scss";
const cx = classNames.bind(styles);

const initialState = {
    id: 1,
    title: "Tất cả"
};

const initialOwnerShip: IOwnerShip = {
    name: "Tất cả",
    value: 0
};

function AuthorizationContractPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setCurrentPage } = useContext(SidebarContext);

    const [visible, setVisible] = useState(false);
    const [contractId, setContractId] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState('8');
    const [contractReason, setContractReason] = useState('');

    const [filter, setFilter] = useState<IOptionMenu[]>([]);
    const [search, setSearch] = useState<Pick<IGlobalConstantsType, "tag">>({});
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [ownership, setOwnerShip] = useState<IGlobalConstantsType>(initialState);
    const [validity, setValidity] = useState<IGlobalConstantsType>(initialState);

    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading } = contractState;
    const [currentItems, setCurrentItems] = useState<(IContract & IUserDetail)[]>([]);
    const [searchResult, setSearchResult] = useState<(IContract & IUserDetail)[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleCurrentItems = (items: any[]) => {
        setCurrentItems(items);
    };

    const handleItemsPerPage = (value: string) => {
        setItemsPerPage(value);
    };

    useEffect(() => {
        setCurrentPage(4);
        setFilter([
            {
                title: "Quyền sở hữu",
                data: CB_OWNER_ITEMS,
                setState: setOwnerShip
            }, {
                title: "Hiệu lực hợp đồng",
                data: VALIDITY_CONTRACT_ITEMS,
                setState: setValidity
            }
        ]);
        setActionbar([{
            title: "Thêm hợp đồng",
            icon: images.uPlus,
            onClick: () => navigate(routes.AddPage)
        }]);

        dispatch(getContractsAction());
    }, []);

    useEffect(() => {
        setSearchResult(contracts);
    }, [contractState]);

    useEffect(() => {
        contractId !== '' && setVisible(true);
    }, [contractId]);

    useEffect(() => {
        setSearch({
            tag: <Input
                id="search"
                name="search"
                size="custom"
                value={searchValue}
                iconRight={images.search}
                placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                onChange={(event) => handleChange(event)}
            />
        });
    }, [searchValue]);

    useEffect(() => {
        const ownershipValue = ownership.title;
        const validityValue = validity.title;
        const search = searchValue.toLowerCase().trim();

        if (!ownershipValue || !validityValue) return;

        const result = contracts.filter(contract => {
            let itemResult;

            let ownerShips = contract.ownerShips.find(item =>
                item.name.toString().toLowerCase() === ownershipValue.toString().toLowerCase()) || initialOwnerShip;

            if (Object.keys(ownerShips).length > 0) {
                if (ownershipValue === "Tất cả")
                    itemResult = contract;
                else if (ownerShips?.name.includes(ownershipValue)) {
                    if (ownershipValue === "Người biểu diễn")
                        itemResult = contract;
                    else if (ownershipValue === "Nhà sản xuất")
                        itemResult = contract;
                };

                if (validityValue === "Tất cả")
                    return itemResult;
                else if (itemResult?.status.includes(validityValue)) {
                    if (contract.status === "Mới")
                        itemResult = contract;
                    else if (contract.status === "Còn thời hạn")
                        itemResult = contract;
                    else if (contract.status === "Đã huỷ")
                        itemResult = contract;

                    return itemResult;
                };
            };
        });

        setSearchResult(result.filter(item =>
            item.contractCode.toLowerCase().includes(search) ||
            item.customer.toLowerCase().includes(search) ||
            item.authorized.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search) ||
            item.dateCreated.toLowerCase().includes(search)
        ));
    }, [ownership, validity, searchValue]);

    return (
        <div className={cx("wrapper")}>
            <Filter data={filter} search={search} />
            <Table
                className={cx("contract")}
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleCurrentItems
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPage}
                thead={["STT", "Số hợp đồng", "Tên hợp đồng", "Người uỷ quyền",
                    "Quyền sở hữu", "Hiệu lực hợp đồng", "Ngày tạo", '', '']}
            >
                {currentItems.map((contract, index) => (
                    <tr className={cx("contract_item")} key={index}>
                        <td >{index + 1}</td>
                        <td >{contract.contractCode}</td>
                        <td >{contract.customer}</td>
                        <td >
                            {contract.authorized !== ""
                                ? contract.authorized
                                : "Chưa có"
                            }</td>
                        <td>
                            {contract.ownerShips.map((ownership, index) => (
                                <p key={index}>{ownership.name}</p>
                            ))}
                        </td>
                        <td>
                            {VALIDITY_CONTRACT_ITEMS.map((item, index) => (
                                item.title === contract.status
                                && <span
                                    key={index}
                                    className={cx("vadility")}
                                >
                                    <img src={item.icon} alt="icon" />
                                    <p>{item.title}</p>
                                </span>))}
                        </td>
                        <td>{contract.dateCreated}</td>
                        <td
                            className={cx("detail")}
                            onClick={() => navigate(`/contract-management/detail/${contract.contractCode}`)}
                        >
                            <p>Xem chi tiết</p>
                        </td>
                        <td
                            className={cx("detail")}
                            onClick={() => {
                                setContractId(contract.contractCode);
                                setContractReason(contract.reason);
                            }}
                        >
                            {contract.status === "Đã huỷ" && <p>Lý do huỷ</p>}
                        </td>
                    </tr>))}
            </Table>
            <ActionBar visible={true} data={actionbar} />
            <Dialog
                visible={visible}
                className={cx("cancel")}
            >
                <CancleForm
                    id="cancelContract"
                    name="cancelContract"
                    title={`Lý do hủy hợp đồng uỷ quyền ${contractId}`}
                    value={contractReason}
                >
                    <div className={cx("action")}>
                        <Button
                            primary
                            fill
                            value="Đóng"
                            onClick={() => setVisible(false)}
                        />
                    </div>
                </CancleForm>
            </Dialog>
            <Loading loading={loading} />
        </div >
    );
};

export default AuthorizationContractPage;