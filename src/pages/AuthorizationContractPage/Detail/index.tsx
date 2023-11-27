import classNames from "classnames/bind";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "~/state";
import { Contract } from "~/component/Contract";
import { IContract, IContractDetail, IGlobalConstantsType } from "~/types";
import { BlockDetail } from "~/component/BlockDetail";

import styles from "~/sass/Detail.module.scss";
const cx = classNames.bind(styles);

export const Detail = () => {
    const params = useParams();
    const { contractCode } = params;

    const [contractDetail, setContractDetail] = useState<(IContract & IContractDetail)>();
    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts } = contractState;

    useEffect(() => {
        const contract = contracts.find(item => {
            return contractCode === item.contractCode;
        });

        setContractDetail(contract);
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
            value: contractDetail?.effectiveDate
        },
        {
            id: 4,
            title: "Ngày hết hạn",
            value: contractDetail?.expirationDate
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
            value: "AAAAA"
        },
    ];

    return (
        <div className={cx("wrapper")}>
            <Contract
                title={`Chi tiết hợp đồng uỷ quyền bài hát - ${contractCode}`}
                tabs={true}
            >
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
                            data={copyRight}
                        />

                        {/* <div className={cx("col", "cus")}>
                            <div className={cx("title-primary")}>
                                <div className={cx("text")}>Thông tin pháp nhân uỷ quyền</div>
                            </div>
                            <div className={cx("col_content")}>
                                <div className={cx("col_left")}>
                                    <div className={cx("title")}>Tên đơn vị sử dụng:</div>
                                    <div className={cx("title")}>Người đại diện:</div>
                                    <div className={cx("title")}>Chức vụ:</div>
                                    <div className={cx("title")}>Ngày sinh:</div>
                                    <div className={cx("title")}>Quốc tịch:</div>
                                    <div className={cx("title")}>Số điện thoại:</div>
                                    <div className={cx("title")}>Email:</div>
                                </div>
                                <div className={cx("col_right")}>
                                    <div className={cx("value")}>Công ty TNHH MTV Âu Lạc</div>
                                    <div className={cx("value")}>Nguyễn văn A</div>
                                    <div className={cx("value")}>Giám đốc</div>
                                    <div className={cx("value")}>01/05/1984</div>
                                    <div className={cx("value")}>Việt Nam</div>
                                    <div className={cx("value")}>123456789012</div>
                                    <div className={cx("value")}>nguyenvana@gmail.com</div>
                                </div>
                            </div>
                        </div> */}
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Giới tính:</div>
                                <div className={cx("title")}>CMND/CCCD:</div>
                                <div className={cx("title")}>Ngày cấp:</div>
                                <div className={cx("title")}>Nơi cấp:</div>
                                <div className={cx("title")}>Mã số thuế:</div>
                                <div className={cx("title")}>Nơi cư trú:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>Nam</div>
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>02/06/2005</div>
                                <div className={cx("value")}>TP. Hồ Chí Minh</div>
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>69/53, Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh</div>
                            </div>
                        </div>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Tên đăng nhập:</div>
                                <div className={cx("title")}>Mật khẩu:</div>
                                <div className={cx("title")}>Số tài khoản:</div>
                                <div className={cx("title")}>Ngân hàng:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>vuonganhtu123</div>
                                <input
                                    className={cx("value", "password")}
                                    value="1234567"
                                    type="password"
                                    readOnly={true}
                                />
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>ACB - Ngân hàng TMCP Á Châu</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Contract>
        </div>
    );
};