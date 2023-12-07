import classNames from "classnames/bind";
import { useEffect, useState } from "react";

import { IContract, IGlobalConstantsType, IUserDetail } from "~/types";
import { BlockDetail } from "~/components/BlockDetail";
import { images } from "~/assets";

import styles from "~/sass/Detail.module.scss";
const cx = classNames.bind(styles);

interface DetailProps {
    contractDetail: IContract & IUserDetail
};

export const Detail = ({ contractDetail }: DetailProps) => {
    const [basicInfo, setBasicInfo] = useState<IGlobalConstantsType[]>([]);
    const [fileAttach, setFileAttach] = useState<IGlobalConstantsType[]>([]);
    const [copyRight, setCopyRight] = useState<IGlobalConstantsType[]>([]);
    const [authorInfomation, setAuthorInfomation] = useState<IGlobalConstantsType[]>([]);
    const [residenceInfo, setResidenceInfo] = useState<IGlobalConstantsType[]>([]);
    const [userName, setUserName] = useState<IGlobalConstantsType[]>([]);

    useEffect(() => {
        setBasicInfo([
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
        ]);

        setFileAttach([
            {
                id: 1,
                title: "Đính kèm tệp",
                value: [
                    {
                        id: 1,
                        icon: images.iconFileWord,
                        title: "hetthuongcannho.doc"
                    },
                    {
                        id: 2,
                        icon: images.iconFile,
                        title: "hetthuongcannho.doc"
                    }
                ]
            }
        ]);

        setCopyRight([
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
            }
        ]);

        setAuthorInfomation([
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
        ]);

        setResidenceInfo([
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
        ]);

        setUserName([
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
        ]);
    }, [contractDetail]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("content")}>
                <div className={cx("col-top")}>
                    <BlockDetail data={basicInfo} />
                    <BlockDetail data={fileAttach} />
                    <BlockDetail
                        title="Mức nhuận bút"
                        className={cx("author")}
                        data={copyRight}
                        icon={images.infoCircle}
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
        </div>
    );
};