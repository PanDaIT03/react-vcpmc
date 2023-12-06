import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Table } from "~/component/Table";
import { Input } from "~/component/Input";
import { ActionBar } from "~/component/ActionBar";
import { OptionMenu } from "~/component/OptionMenu";
import { IContract, IGlobalConstantsType, IUserDetail } from "~/types";
import { CB_OWNER_ITEMS, VALIDITY_CONTRACT_ITEMS } from "~/constants";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { RootState, useAppDispatch } from "~/state";
import { getContractsAction } from "~/state/thunk/contract";
import { images } from "~/assets";

import styles from "~/sass/AuthorizationContractPage.module.scss";
const cx = classNames.bind(styles);

interface AuthorizationContractProps { };

const initialState = {
    id: 1,
    title: "Tất cả"
};

function AuthorizationContractPage({ }: AuthorizationContractProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [ownership, setOwnerShip] = useState<IGlobalConstantsType>(initialState);
    const [validity, setValidity] = useState<IGlobalConstantsType>(initialState);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<(IContract & IUserDetail)[]>([]);

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
                className="contract"
                loading={loading}
            >
                <tbody>
                    <tr className={cx("contract_title")}>
                        <th className={cx("numerical-order", "title")}>STT</th>
                        <th className={cx("contract-code", "title")}>Số hợp đồng</th>
                        <th className={cx("contract-name", "title")}>Tên hợp đồng</th>
                        <th className={cx("authorized-person", "title")}>Người uỷ quyền</th>
                        <th className={cx("ownership", "title")}>Quyền sở hữu</th>
                        <th className={cx("effective-contract", "title")}>Hiệu lực hợp đồng</th>
                        <th className={cx("date-created", "title")}>Ngày tạo</th>
                        <th className={cx("action-detail", "title")}>&nbsp;</th>
                        <th className={cx("reason", "title")}>&nbsp;</th>
                    </tr>
                    {searchResult.map((contract, index) => (
                        <tr className={cx("contract_item")} key={index}>
                            <td className={cx("numerical-order", "content")}>{index + 1}</td>
                            <td className={cx("contract-code", "content")}>{contract.contractCode}</td>
                            <td className={cx("contract-name", "content")}>{contract.customer}</td>
                            <td className={cx("authorized-person", "content")}>{contract.authorized}</td>
                            <td className={cx("ownership", "content")}>
                                {typeof contract.ownerShips === "string"
                                    ? <p>{contract.ownerShips}</p>
                                    : contract.ownerShips.map((ownership, index) => (
                                        <p key={index}>{ownership}</p>
                                    ))
                                }
                            </td>
                            <td className={cx("effective-contract", "content")}>
                                {VALIDITY_CONTRACT_ITEMS.map(item => (
                                    item.title === contract.status
                                    && <span className={cx("--center-flex")} key={item.id}>
                                        <img src={item.icon} alt="icon" />
                                        <p>{item.title}</p>
                                    </span>
                                ))}
                            </td>
                            <td className={cx("date-created", "content")}>{contract.dateCreated}</td>
                            <td
                                className={cx("action-detail", "content")}
                                onClick={() => navigate(`/contract-management/authorization-contract/${contract.contractCode}`)}
                            >
                                Xem chi tiết
                            </td>
                            {contract.status === "Đã huỷ"
                                && <td className={cx("reason", "content")}>Lý do huỷ</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ActionBar visible={true}>
                <ActionBarItem title="Thêm hợp đồng" icon={images.uPlus} />
            </ActionBar>
        </div>
    );
};

export default AuthorizationContractPage;