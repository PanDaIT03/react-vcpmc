import { IGlobalConstantsType } from "~/types";

const LANGUAGE_ITEMS = [
    {
        id: 1,
        title: "Tiếng Việt",
        icon: "../../images/vietnam_flag.png"
    },
    {
        id: 2,
        title: "English",
        icon: "../../images/uk_flag.png"
    },
    {
        id: 3,
        title: "中國",
        icon: "../../images/china_flag.png"
    }
];

const SIDEBAR_ITEMS = [
    {
        id: 1,
        iconName: "../../images/ban_ghi_icon.png",
        title: "Kho bản ghi",
        isActive: false
    },
    {
        id: 2,
        iconName: "../../images/playlist_icon.png",
        title: "Playlist",
        isActive: false
    },
    {
        id: 3,
        iconName: "../../images/u_calendar-alt.png",
        title: "Lập lịch phát",
        isActive: false
    },
    {
        id: 4,
        iconName: "../../images/hop_dong_icon.png",
        title: "Quản lý",
        isActive: false,
        children: [
            {
                id: 1,
                title: "Quản lý hợp đồng",
                to: "/contract-management"
            },
            {
                id: 2,
                title: "Quản lý thiết bị"
            },
            {
                id: 3,
                title: "Đơn vị uỷ quyền"
            },
            {
                id: 4,
                title: "Đơn vị sử dụng"
            }
        ]
    },
    {
        id: 5,
        iconName: "../../images/group_icon.png",
        title: "Doanh thu",
        isActive: false,
        children: [
            {
                id: 1,
                title: "Báo cáo doanh thu"
            },
            {
                id: 2,
                title: "Lịch sử đối soát"
            },
            {
                id: 3,
                title: "Phân phối doanh thu"
            }
        ]
    },
    {
        id: 6,
        iconName: "../../images/setting_icon.png",
        title: "Cài đặt",
        isActive: false,
        children: [
            {
                id: 1,
                title: "Phân quyền người dùng"
            },
            {
                id: 2,
                title: "Cấu hình"
            },
            {
                id: 3,
                title: "Quản lý hợp đồng"
            },
            {
                id: 4,
                title: "Thông tin tác phẩm"
            },
            {
                id: 5,
                title: "Chu kỳ đối soát"
            }
        ]
    },
    {
        id: 7,
        iconName: "../../images/support_icon.png",
        title: "Hỗ trợ",
        isActive: false,
        children: [
            {
                id: 1,
                title: "Hướng dẫn sử dụng"
            },
            {
                id: 2,
                title: "Tải app"
            },
            {
                id: 3,
                title: "Feedback"
            }
        ]
    },
];

const ACTION_INFO_USER = [
    {
        id: 1,
        icon: "./images/fi_edit.png",
        title: "Sửa thông tin",
    },
    {
        id: 2,
        icon: "./images/fi_lock.png",
        title: "Đổi mật khẩu",
    },
    {
        id: 3,
        icon: "./images/fi_log-out.png",
        title: "Đăng xuất",
    }
];

const formatDate = (date: Date) => {
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let day = `${dd}`, month = `${mm}`;

    if (dd < 10)
        day = `0${dd}`;
    if (mm < 10)
        month = `0${mm}`;

    return `${day}/${month}/${yyyy}`;
};

const validityContract = [
    {
        id: 1,
        icon: "./images/ellipse_effect.png",
        status: "Đang hiệu lực"
    },
    {
        id: 2,
        icon: "./images/ellipse_expire.png",
        status: "Hết hiệu lực"
    },
    {
        id: 3,
        icon: "./images/ellipse_cancel.png",
        status: "Đã huỷ"
    },
];

const CB_OWNER_ITEMS = [
    {
        id: 1,
        title: "Tất cả"
    },
    {
        id: 2,
        title: "Người biểu diễn"
    },
    {
        id: 3,
        title: "Nhà sản xuất"
    }
];

const VALIDITY_CONTRACT_ITEMS = [
    {
        id: 1,
        title: "Tất cả"
    },
    {
        id: 2,
        title: "Mới"
    },
    {
        id: 3,
        title: "Còn thời hạn"
    },
    {
        id: 4,
        title: "Hết hạn"
    },
    {
        id: 5,
        title: "Huỷ"
    }
];

const handleClickDropDown = (item: IGlobalConstantsType, data: IGlobalConstantsType[]) => {
    let newDropDown = [...data];

    newDropDown = data.filter(language => {
        return language.id !== item.id;
    });
    return newDropDown;
};

export {
    formatDate, handleClickDropDown, validityContract,
    LANGUAGE_ITEMS, SIDEBAR_ITEMS, ACTION_INFO_USER, CB_OWNER_ITEMS, VALIDITY_CONTRACT_ITEMS
};