import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import Button from "~/component/Button";
import { RootState } from "~/state";
import { Contract } from "~/component/Contract";
import { IContract, IGlobalConstantsType, IUserDetail } from "~/types";
import { BlockDetail } from "~/component/BlockDetail";
import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { CancleForm } from "~/component/CancelForm";
import { Tab, Tabs } from "~/component/Tabs";

import styles from "~/sass/Detail.module.scss";
const cx = classNames.bind(styles);

const initialState = {} as (IContract & IUserDetail);

export const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { contractCode } = params;

    const [visible, setVisible] = useState(false);
    const [cancleArea, setCancleArea] = useState('');

    const [contractDetail, setContractDetail] = useState<(IContract & IUserDetail)>(initialState);
    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts } = contractState;

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const contract = contracts.find(item => {
            return contractCode === item.contractCode;
        });

        setContractDetail(contract || initialState);
    }, [contractState]);

    const basicInfo: IGlobalConstantsType[] = [
        {
            id: 1,
            title: "Số hợp đồng",
            value: contractDetail?.contractCode
        },
        {
            id: 2,
            title: "Tên hợp đồng",
            value: contractDetail?.customer
        },
        {
            id: 3,
            title: "Ngày hiệu lực",
            value: contractDetail?.effectiveDate || "Chưa có"
        },
        {
            id: 4,
            title: "Ngày hết hạn",
            value: contractDetail?.expirationDate || "Chưa có"
        },
        {
            id: 5,
            title: "Tình trạng",
            value: contractDetail?.status
        }
    ];

    const fileAttach: IGlobalConstantsType[] = [
        {
            id: 1,
            title: "Đính kèm tệp",
            value: [
                {
                    id: 1,
                    icon: "../../images/icon_file_word.png",
                    title: "hetthuongcannho.doc"
                },
                {
                    id: 2,
                    icon: "../../images/icon_file.png",
                    title: "hetthuongcannho.doc"
                },
            ]
        },
    ];

    const copyRight: IGlobalConstantsType[] = [
        {
            id: 1,
            title: "Quyền tác giả",
            value: "0%"
        },
        {
            id: 2,
            title: "Quyền liên quan",
            value: ""
        },
        {
            id: 3,
            title: "Quyền của người biểu diễn",
            value: "50%",
            isActive: true
        },
        {
            id: 4,
            title: "Quyền của nhà sản xuất: (Bản ghi/video)",
            value: "50%",
            isActive: true
        },
    ];

    const authorInfomation = [
        {
            id: 1,
            title: "Pháp nhân uỷ quyền",
            value: contractDetail?.authorizingLegalEntity
        },
        {
            id: 2,
            title: "Tên người uỷ quyền",
            value: contractDetail?.firstName + " " + contractDetail?.lastName
        },
        {
            id: 3,
            title: "Ngày sinh",
            value: contractDetail?.dateOfBirth
        },
        {
            id: 4,
            title: "Giới tính",
            value: contractDetail?.gender
        },
        {
            id: 5,
            title: "Quốc tịch",
            value: contractDetail?.nationality
        },
        {
            id: 6,
            title: "Điện thoại",
            value: contractDetail?.phoneNumber
        }
    ];

    const residenceInfo = [
        {
            id: 1,
            title: "Số CMND/ CCCD",
            value: contractDetail?.idNumber
        },
        {
            id: 2,
            title: "Ngày cấp",
            value: contractDetail?.dateRange
        },
        {
            id: 3,
            title: "Nơi cấp",
            value: contractDetail?.issuedBy
        },
        {
            id: 4,
            title: "Mã số thuế",
            value: contractDetail?.taxCode
        },
        {
            id: 5,
            title: "Nơi cư trú",
            value: contractDetail?.residence
        },
    ];

    const userName = [
        {
            id: 1,
            title: "Email",
            value: contractDetail?.email
        },
        {
            id: 2,
            title: "Tài khoản đăng nhập",
            value: contractDetail?.userName
        },
        {
            id: 3,
            title: "Mật khẩu",
            value: contractDetail?.password
        },
        {
            id: 4,
            title: "Số tài khoản",
            value: contractDetail?.bankNumber
        },
        {
            id: 5,
            title: "Ngân hàng",
            value: contractDetail?.bank
        },
    ];

    useEffect(() => {
        if (contracts.length <= 0)
            navigate("/contract-management");
    }, [contracts]);

    const handleChangeCancleContract = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCancleArea(event.target.value);
    };

    const handleCancleContract = () => {
        console.log(cancleArea);
    };

    return (
        <div className={cx("wrapper")}>
            <Contract
                title={`Chi tiết hợp đồng uỷ quyền bài hát - ${contractCode}`}
                tabs={true}
            >
                <Tabs>
                    <Tab
                        title="Thông tin hợp đồng"
                        pageRef={firstRef}
                        status={"active"}
                    />
                    <Tab
                        title="Tác phầm uỷ quyền"
                        pageRef={secondRef}
                        status={"inactive"}
                        onClick={() => navigate(`/contract-management/authorization-product/${contractCode}`)}
                    />
                </Tabs>
                <div className={cx("content")}>
                    <div className={cx("col-top")}>
                        <BlockDetail data={basicInfo} />
                        <BlockDetail data={fileAttach} />
                        <BlockDetail
                            title="Mức nhuận bút"
                            className={cx("author")}
                            data={copyRight}
                            icon="../../images/u_info-circle.png"
                        />
                    </div>
                    <div className={cx("col-bottom")}>
                        <BlockDetail
                            title="Thông tin pháp nhân uỷ quyền"
                            className={cx("author")}
                            data={authorInfomation}
                        />
                        <BlockDetail data={residenceInfo} />
                        <BlockDetail data={userName} className={cx("user")} />
                    </div>
                </div>
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Chỉnh sửa hợp đồng"
                        icon="../../images/fi_edit.png"
                        disable={contractDetail.censored === false}
                    />
                    <ActionBarItem
                        title="Gia hạn hợp đồng"
                        icon="../../images/u_clipboard-notes.png"
                    />
                    <ActionBarItem
                        title="Huỷ hợp đồng"
                        icon="../../images/fi_x.png"
                        onClick={() => {
                            setVisible(true);
                            textAreaRef.current?.focus();
                        }}
                    />
                </ActionBar>
                <CancleForm
                    name="cancelContract"
                    title="Hủy hợp đồng uỷ quyền"
                    placeholder="Cho chúng tôi biết lý do bạn muốn huỷ hợp đồng uỷ quyền này..."
                    status={visible ? "active" : "inactive"}
                    textareaRef={textAreaRef}
                    onChange={(event) => handleChangeCancleContract(event)}
                >
                    <div className={cx("action")}>
                        <Button
                            primary
                            value="Quay lại"
                            onClick={() => setVisible(false)}
                        />
                        <Button
                            primary
                            value="Huỷ hợp đồng"
                            fill
                            onClick={handleCancleContract}
                        />
                    </div>
                </CancleForm>
            </Contract>
        </div>
    );
};