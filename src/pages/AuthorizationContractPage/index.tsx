import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Button from "~/components/Button";
import { Table } from "~/components/Table";
import { Input } from "~/components/Input";
import { ActionBar } from "~/components/ActionBar";
import { OptionMenu } from "~/components/OptionMenu";
import { IContract, IGlobalConstantsType, IUserDetail } from "~/types";
import { CB_OWNER_ITEMS, VALIDITY_CONTRACT_ITEMS } from "~/constants";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { RootState, useAppDispatch } from "~/state";
import { getContractsAction } from "~/state/thunk/contract";
import { images } from "~/assets";
import { Dialog } from "~/components/Dialog";
import { CancleForm } from "~/components/CancelForm";
import { routes } from "~/config/routes";

import styles from "~/sass/AuthorizationContract.module.scss";
const cx = classNames.bind(styles);

const initialState = {
    id: 1,
    title: "Tất cả"
};

function AuthorizationContractPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [visible, setVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [ownership, setOwnerShip] = useState<IGlobalConstantsType>(initialState);
    const [validity, setValidity] = useState<IGlobalConstantsType>(initialState);
    const [searchResult, setSearchResult] = useState<(IContract & IUserDetail)[]>([]);

    const [contractId, setContractId] = useState('');
    const [contractReason, setContractReason] = useState('');
    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading } = contractState;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickSearch = () => { };

    useEffect(() => {
        dispatch(getContractsAction());
    }, []);

    useEffect(() => {
        setSearchResult(contracts);
    }, [contractState]);

    useEffect(() => {
        contractId !== '' && setVisible(true);
    }, [contractId]);

    useEffect(() => {
        const ownershipValue = ownership.title;
        const validityValue = validity.title;
        const search = searchValue.toLowerCase().trim();

        if (ownershipValue && validityValue) {
            const result = contracts.filter(contract => {
                let itemResult;

                if (ownershipValue === "Tất cả")
                    itemResult = contract;
                else if (contract.ownerShips.includes(ownershipValue)) {
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
            });

            setSearchResult(result.filter(item =>
                item.contractCode.toLowerCase().includes(search) ||
                item.customer.toLowerCase().includes(search) ||
                item.authorized.toLowerCase().includes(search) ||
                item.status.toLowerCase().includes(search) ||
                item.dateCreated.toLowerCase().includes(search)
                // || (typeof item.ownerShips === "string"
                //     ? item.ownerShips.toLowerCase().includes(search)
                //     : item.ownerShips.filter(ownership => ownership.toLowerCase().includes(search))
                // )
            ));
        };
    }, [ownership, validity, searchValue]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("action")}>
                <div className={cx("filter")}>
                    <OptionMenu
                        title="Quyền sở hữu"
                        data={CB_OWNER_ITEMS}
                        setState={setOwnerShip}
                    />
                    <OptionMenu
                        title="Hiệu lực hợp đồng"
                        data={VALIDITY_CONTRACT_ITEMS}
                        setState={setValidity}
                    />
                </div>
                <div className={cx("search")}>
                    <Input
                        id="search"
                        name="search"
                        value={searchValue}
                        placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                        size="custom"
                        iconRight={images.search}
                        onChange={(event) => handleChange(event)}
                        onIconRightClick={handleClickSearch}
                    />
                </div>
            </div>
            <Table
                className={cx("contract")}
                loading={loading}
                thead={["STT", "Số hợp đồng", "Tên hợp đồng", "Người uỷ quyền",
                    "Quyền sở hữu", "Hiệu lực hợp đồng", "Ngày tạo", '', '']}
            >
                {searchResult.map((contract, index) => (
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
                            {typeof contract.ownerShips === "string"
                                ? <p>{contract.ownerShips}</p>
                                : contract.ownerShips.map((ownership, index) => (
                                    <p key={index}>{ownership}</p>
                                ))
                            }
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
                                </span>
                            ))}
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
                    </tr>
                ))}
            </Table>
            <ActionBar visible={true}>
                <ActionBarItem
                    title="Thêm hợp đồng"
                    icon={images.uPlus}
                    onClick={() => navigate(routes.AddPage)}
                />
            </ActionBar>
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
        </div >
    );
};

export default AuthorizationContractPage;