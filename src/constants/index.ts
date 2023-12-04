import { IGlobalConstantsType } from "~/types";
import { images } from "~/assets";

const LANGUAGE_ITEMS = [
  {
    id: 1,
    title: "Tiếng Việt",
    icon: images.vietnamFlag,
  },
  {
    id: 2,
    title: "English",
    icon: images.ukFlag,
  },
  {
    id: 3,
    title: "中國",
    icon: images.chinaFlag,
  },
];

const SIDEBAR_ITEMS = [
  {
    id: 1,
    icon: images.banGhi,
    title: "Kho bản ghi",
    isActive: false,
  },
  {
    id: 2,
    icon: images.playlist,
    title: "Playlist",
    isActive: false,
  },
  {
    id: 3,
    icon: images.calendarAlt,
    title: "Lập lịch phát",
    isActive: false,
  },
  {
    id: 4,
    icon: images.contract,
    title: "Quản lý",
    isActive: false,
    children: [
      {
        id: 1,
        title: "Quản lý hợp đồng",
        to: "/contract-management",
      },
      {
        id: 2,
        title: "Quản lý thiết bị",
      },
      {
        id: 3,
        title: "Đơn vị uỷ quyền",
      },
      {
        id: 4,
        title: "Đơn vị sử dụng",
      },
    ],
  },
  {
    id: 5,
    icon: images.group,
    title: "Doanh thu",
    isActive: false,
    children: [
      {
        id: 1,
        title: "Báo cáo doanh thu",
      },
      {
        id: 2,
        title: "Lịch sử đối soát",
      },
      {
        id: 3,
        title: "Phân phối doanh thu",
      },
    ],
  },
  {
    id: 6,
    icon: images.setting,
    title: "Cài đặt",
    isActive: false,
    children: [
      {
        id: 1,
        title: "Phân quyền người dùng",
      },
      {
        id: 2,
        title: "Cấu hình",
      },
      {
        id: 3,
        title: "Quản lý hợp đồng",
      },
      {
        id: 4,
        title: "Thông tin tác phẩm",
      },
      {
        id: 5,
        title: "Chu kỳ đối soát",
      },
    ],
  },
  {
    id: 7,
    icon: images.support,
    title: "Hỗ trợ",
    isActive: false,
    children: [
      {
        id: 1,
        title: "Hướng dẫn sử dụng",
      },
      {
        id: 2,
        title: "Tải app",
      },
      {
        id: 3,
        title: "Feedback",
      },
    ],
  },
];

const ACTION_INFO_USER = [
  {
    id: 1,
    icon: images.edit,
    title: "Sửa thông tin",
  },
  {
    id: 2,
    icon: images.lock,
    title: "Đổi mật khẩu",
  },
  {
    id: 3,
    icon: images.logOut,
    title: "Đăng xuất",
  },
];

const formatDate = (date: Date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  let day = `${dd}`,
    month = `${mm}`;

  if (dd < 10) day = `0${dd}`;
  if (mm < 10) month = `0${mm}`;

  return `${day}/${month}/${yyyy}`;
};

const validityContract = [
  {
    id: 1,
    icon: images.ellipseEffect,
    status: "Đang hiệu lực",
  },
  {
    id: 2,
    icon: images.ellipseExpire,
    status: "Hết hiệu lực",
  },
  {
    id: 3,
    icon: images.ellipseCancel,
    status: "Đã huỷ",
  },
];

const CB_OWNER_ITEMS = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Người biểu diễn",
  },
  {
    id: 3,
    title: "Nhà sản xuất",
  },
];

const VALIDITY_CONTRACT_ITEMS = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Mới",
    icon: images.ellipseNew,
  },
  {
    id: 3,
    title: "Còn thời hạn" || "Còn hiệu lực",
    icon: images.ellipseEffect,
  },
  {
    id: 4,
    title: "Hết hạn",
    icon: images.ellipseExpire,
  },
  {
    id: 5,
    title: "Đã huỷ",
    icon: images.ellipseCancel,
  },
];

const CB_APPROVE_ITEMS = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Mới",
    icon: images.ellipseNew,
  },
  {
    id: 3,
    title: "Đã phê duyệt",
    icon: images.ellipseEffect,
  },
  {
    id: 4,
    title: "Bị từ chối",
    icon: images.ellipseCancel,
  },
];

const handleClickDropDown = (
  item: IGlobalConstantsType,
  data: IGlobalConstantsType[]
) => {
  let newDropDown = [...data];

  newDropDown = data.filter((language) => {
    return language.id !== item.id;
  });
  return newDropDown;
};

const getCurrentDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  return mm + "/" + dd + "/" + yyyy;
};

const formatDateDMY = (date: Date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  let day = `${dd}`,
    month = `${mm}`;

  if (dd < 10) day = `0${dd}`;
  if (mm < 10) month = `0${mm}`;

  return `${day}/${month}/${yyyy}`;
};

const formatDateMDY = (date: string) => {
  let dateList = date.split("/");

  return dateList[1] + "/" + dateList[0] + "/" + dateList[2];
};

const formatToLocalStringCurrentDate = () => {
  let date = new Date();

  return `${formatDateDMY(
    date
  )} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const formatTime = (time: number) => {
  let minutes = Math.floor(time / 60);
  let timeForSeconds = time - minutes * 60;
  let seconds = Math.floor(timeForSeconds);
  let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;

  return `${minutes}:${secondsReadable}`;
};

export {
  formatDate,
  formatTime,
  handleClickDropDown,
  validityContract,
  LANGUAGE_ITEMS,
  SIDEBAR_ITEMS,
  ACTION_INFO_USER,
  CB_OWNER_ITEMS,
  VALIDITY_CONTRACT_ITEMS,
  CB_APPROVE_ITEMS,
};
