import classNames from "classnames/bind";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { Contract } from "~/component/Contract";
import { Input } from "~/component/Input";
import { OptionMenu } from "~/component/OptionMenu";
import { Tab, Tabs } from "~/component/Tabs";
import { CB_APPROVE_ITEMS } from "~/constants";

import styles from "~/sass/Product.module.scss";
const cx = classNames.bind(styles);

export const Product = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { contractCode } = params;

    const [searchValue, setSearchValue] = useState('');

    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickSearch = () => {
        console.log(searchValue);
    };

    return (
        <div className={cx("wrapper")}>
            <Contract
                title={`Hợp đồng uỷ quyền bài hát - ${contractCode}`}
                tabs={true}
            >
                <Tabs>
                    <Tab
                        title="Thông tin hợp đồng"
                        pageRef={firstRef}
                        status={"inactive"}
                        onClick={() => navigate(`/contract-management/authorization-contract/${contractCode}`)}
                    />
                    <Tab
                        title="Tác phầm uỷ quyền"
                        pageRef={secondRef}
                        status={"active"}
                    />
                </Tabs>
                <div className={cx("action")}>
                    <div className={cx("filter")}>
                        <OptionMenu
                            title="Quyền sở hữu"
                            data={CB_APPROVE_ITEMS}
                        // setState={setOwnerShip}
                        />
                    </div>
                    <div className={cx("search")}>
                        <Input
                            id="search"
                            name="search"
                            value={searchValue}
                            placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                            size="custom"
                            iconRight="../../images/search_icon.png"
                            onChange={(event) => handleChange(event)}
                            onIconRightClick={handleClickSearch}
                        />
                    </div>
                </div>

                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Chỉnh sửa hợp đồng"
                        icon="../../images/fi_edit.png"
                    />
                    <ActionBarItem
                        title="Gia hạn hợp đồng"
                        icon="../../images/u_clipboard-notes.png"
                    />
                    <ActionBarItem
                        title="Huỷ hợp đồng"
                        icon="../../images/u_history.png"
                    />
                    <ActionBarItem
                        title="Thêm bản ghi"
                        icon="../../images/u_plus.png"
                    />
                </ActionBar>
            </Contract>
        </div>
    );
};