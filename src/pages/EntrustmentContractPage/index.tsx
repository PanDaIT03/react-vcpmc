import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Input } from "~/component/Input";
import { Table } from "~/component/Table";
import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { RootState, useAppDispatch } from "~/state";
import { getContractsAction } from "~/state/thunk/contract";

import styles from "~/sass/EntrustmentContract.module.scss";
const cx = classNames.bind(styles);

function EntrustmentContractPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState('');
    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading } = contractState;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchValue(value);
    };

    const handleClickSearch = () => {
        console.log(searchValue);
    };

    useEffect(() => {
        dispatch(getContractsAction());
    }, []);

    return (
        <div className={cx("wrapper")}>
            {/* <Contract
                title="Danh sách hợp đồng khai thác"
            >
                <div className={cx("search")}>
                    <Input
                        id="search"
                        name="search"
                        value={searchValue}
                        placeholder="Tên hợp đồng, tác giả,..."
                        size="custom"
                        iconRight="./images/search_icon.png"
                        onChange={(event) => handleChange(event)}
                        onIconRightClick={handleClickSearch}
                    />
                </div>
                <Table
                    className="contract"
                    loading={loading}
                >
                    <tbody>
                        <tr className={cx("contract_title")}>
                            <th className={cx("numerical-order", "title")}>STT</th>
                            <th className={cx("contract-code", "title")}>Số hợp đồng</th>
                            <th className={cx("customer", "title")}>Khách hàng</th>
                            <th className={cx("date-created", "title")}>Ngày tạo</th>
                            <th className={cx("effective-date", "title")}>Ngày hiệu lực</th>
                            <th className={cx("expiration-date", "title")}>Ngày hết hạn</th>
                            <th className={cx("validity-contract", "title")}>Hiệu lực hợp đồng</th>
                            <th className={cx("action-detail", "title")}>&nbsp;</th>
                            <th className={cx("action-copy", "title")}>&nbsp;</th>
                        </tr>
                        {contracts.map((contract, index) => (
                            <tr
                                className={cx("contract_item")}
                                key={index}
                                onClick={() => navigate(`/contract-management/detail/${contract.contractCode}`)}
                            >
                                <td className={cx("numerical-order", "content")}>{index + 1}</td>
                                <td className={cx("contract-code", "content")}>{contract.contractCode}</td>
                                <td className={cx("customer", "content")}>{contract.customer}</td>
                                <td className={cx("date-created", "content")}>{contract.dateCreated}</td>
                                <td className={cx("effective-date", "content")}>{contract.effectiveDate}</td>
                                <td className={cx("expiration-date", "content")}>{contract.expirationDate}</td>
                                <td className={cx("validity-contract", "content")}>
                                    {contract.censored ? (
                                        validityContract.map((item, index) => {
                                            if (contract.status === item.status)
                                                return (
                                                    <span key={index} className={cx("--center-flex")}>
                                                        <img src={item.icon} />
                                                        <p>{item.status}</p>
                                                    </span>
                                                )
                                        })
                                    ) : (
                                        <>
                                            <img src="./images/ellipse_new.png" />
                                            <p>Mới</p>
                                        </>
                                    )}
                                </td>
                                <td className={cx("action-detail", "content")}>Xem chi tiết</td>
                                <td className={cx("action-copy", "content")}>Sao chép hợp đồng</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <ActionBar visible={true}>
                    <ActionBarItem
                        icon="./images/u_plus.png"
                        title="Thêm hợp đồng"
                    />
                </ActionBar>
            </Contract> */}
        </div>
    );
};

export default EntrustmentContractPage;