import moment from "moment";

import { images } from "~/assets";
import { routes } from "~/config/routes";
import { UserManualItem } from "~/pages/SupportPage/UserManualPage";
import { IGlobalConstantsType } from "~/types";
import { Quarterly } from "~/types/EntrustmentContractType";
import { IDownloadItem } from "~/types/SupportType";

const regexIsSlash = /^[a-zA-Z0-9/]+$/;

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

const CB_ROLES = [
  {
    id: 1,
    title: "Lisences",
  },
  {
    id: 2,
    title: "User",
  },
  {
    id: 3,
    title: "System Admin",
  },
  {
    id: 5,
    title: "Super Admin",
  },
];

const CB_NATIONALITY = [
  {
    id: 1,
    title: "Việt Nam",
  },
  {
    id: 2,
    title: "Mỹ",
  },
];

const SIDEBAR_ITEMS = [
  {
    id: 1,
    icon: images.banGhi,
    title: "Kho bản ghi",
    isActive: false,
    to: routes.RecordPage,
  },
  {
    id: 2,
    icon: images.playlist,
    title: "Playlist",
    isActive: false,
    to: routes.PlaylistPage,
  },
  {
    id: 3,
    icon: images.calendarAlt,
    title: "Lập lịch phát",
    isActive: false,
    to: routes.PlaylistSchedulePage,
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
        to: routes.ContractPage,
      },
      {
        id: 2,
        title: "Quản lý thiết bị",
        to: routes.DevicePage,
      },
      {
        id: 3,
        title: "Đơn vị uỷ quyền",
        to: routes.AuthorizedPartnerPage,
      },
      {
        id: 4,
        title: "Đơn vị sử dụng",
        to: routes.UnitUsedManagementPage,
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
        to: routes.RevenueReportPage,
      },
      {
        id: 2,
        title: "Lịch sử đối soát",
        to: routes.ForControlHistoryPage,
      },
      {
        id: 3,
        title: "Phân phối doanh thu",
        to: routes.RevenueDistributionPage,
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
        to: routes.AuthorizedUserPage,
      },
      {
        id: 2,
        title: "Cấu hình",
        to: routes.SettingPage,
      },
      {
        id: 3,
        title: "Quản lý hợp đồng",
        to: routes.ManagementContractTypePage,
      },
      {
        id: 4,
        title: "Thông tin tác phẩm",
        to: routes.CategoryPage,
      },
      {
        id: 5,
        title: "Chu kỳ đối soát",
        to: routes.SettingForControlPage,
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
        to: routes.SupportUserManualPage,
      },
      {
        id: 2,
        title: "Tải app",
        to: routes.DownloadPage,
      },
      {
        id: 3,
        title: "Feedback",
        to: routes.FeedbackPage,
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
    title: "Đã hủy",
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

const CAPABILITY = [
  {
    id: 1,
    title: "Quyền của người biểu diễn",
  },
  {
    id: 2,
    title: "Quyền của nhà sản xuất (bản ghi/video)",
  },
];

const CB_MUSIC_KIND = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Pop",
  },
  {
    id: 3,
    title: "EDM",
  },
  {
    id: 4,
    title: "Rock",
  },
  {
    id: 5,
    title: "Ballad",
  },
];

const CB_FORMAT = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Audio",
  },
  {
    id: 3,
    title: "Video",
  },
];

const CB_VADILITY_MUSIC = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Còn thời hạn",
  },
  {
    id: 3,
    title: "Hết hạn",
  },
];

const CB_APPROVE = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Duyệt bởi người dùng",
  },
  {
    id: 3,
    title: "Duyệt tự động",
  },
];

const CB_PLAYLIST = [
  {
    id: 1,
    title: "Top ca khúc 2023",
  },
  {
    id: 2,
    title: "Top musics chill 2023",
  },
  {
    id: 3,
    title: "Nhạc lofi 2023",
  },
  {
    id: 4,
    title: "Top musics 2023",
  },
];

const CB_ACCOUNT_GROUP = [
  {
    id: 1,
    title: "Tất cả",
  },
  {
    id: 2,
    title: "Công ty TMCP Bách Hóa Xanh",
  },
  {
    id: 3,
    title: "Công ty TNHH XYZ",
  },
  {
    id: 4,
    title: "Công ty TMCP Adora",
  },
];

const THEME_IMAGES = [
  images.theme_1,
  images.theme_2,
  images.theme_3,
  images.theme_4,
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

const getCurrentDate = (format: string) => {
  const isSlash = regexIsSlash.test(format);

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  if (isSlash) {
    if (format === "dd/mm/yyyy") return dd + "/" + mm + "/" + yyyy;
    else if (format === "mm/dd/yyyy") return mm + "/" + dd + "/" + yyyy;
    else return yyyy + "/" + mm + "/" + dd;
  } else {
    if (format === "dd-mm-yyyy") return dd + "-" + mm + "-" + yyyy;
    else if (format === "mm-dd-yyyy") return mm + "-" + dd + "-" + yyyy;
    else return yyyy + "-" + mm + "-" + dd;
  }
};

const getCurrentDateDMY = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  return dd + "/" + mm + "/" + yyyy;
};

const getCurrentDateTimeDMY = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();

  return dd + "/" + mm + "/" + yyyy + ` ${hours}:${minutes}:${seconds}`;
};

const getCurrentDateMDY = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  return mm + "/" + dd + "/" + yyyy;
};

// const formatDateDMY = (date: Date) => {
//   let yyyy = date.getFullYear();
//   let mm = date.getMonth() + 1;
//   let dd = date.getDate();
//   let day = `${dd}`,
//     month = `${mm}`;

//   if (dd < 10) day = `0${dd}`;
//   if (mm < 10) month = `0${mm}`;

//   return `${day}/${month}/${yyyy}`;
// };

const formatDateMDY = (date: string) => {
  if (typeof date === "undefined" || date === "") return;
  let dateList = date.split("/");

  return dateList[1] + "/" + dateList[0] + "/" + dateList[2];
};

const formatToLocalStringCurrentDate = () => {
  let date = new Date();

  return `${formatDateDMY(
    `${date}`
  )} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const formatMoney = (money: number) => {
  const config = {
    style: "currency",
    currency: "VND",
    maximumFractionDigist: 9,
  };

  const formated = new Intl.NumberFormat("vi-VN", config).format(money);

  return formated;
};

const formatDateYMD = (date: string) => {
  let dateList = date.split("/");

  return dateList[2] + "-" + dateList[1] + "-" + dateList[0];
};

const formatDateTimeYMD = (date: string) => {
  let dateList = date.split("/");

  return dateList[2] + "-" + dateList[1] + "-" + dateList[0];
};

const formatTime = (time: number) => {
  let minutes = Math.floor(time / 60);
  let timeForSeconds = time - minutes * 60;
  let seconds = Math.floor(timeForSeconds);
  let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;

  return `${minutes}:${secondsReadable}`;
};

const formatDateDMY = (date: string) => {
  let isSlash = regexIsSlash.test(date);
  let dateList;
  if (isSlash) dateList = date.split("/");
  else dateList = date.split("-");

  return dateList[2] + "/" + dateList[1] + "/" + dateList[0];
};

const theFollowingDays = (date: string, next: number) => {
  if (typeof date === "undefined" || date === "") return;
  let today = moment(date, "DD/MM/YYYY");
  return today.add(next, "days").format("DD/MM/YYYY").toString();
};

const regexOnlyNumer = (value: string) => {
  const re = /^[0-9\b]+$/,
    regex = /^[1-9]?[0-9]{1}$|^100$/;

  if (value === "" || (re.test(value) && regex.test(value))) return true;
  else return false;
};

const getTotalMoment = (array: Array<any>) => {
  let momentTime = moment("00000000", "hh:mm:ss")
    .utcOffset(0)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  array.filter((item) => {
    let timeSplit = item.split(":");
    momentTime.add("minutes", timeSplit[0]).add("seconds", timeSplit[1]);
  });

  return momentTime.toISOString();
};

const formatDateDMYHPTS = (date: string) => {
  let dateList = date.split("-");
  return dateList[2] + "/" + dateList[1] + "/" + dateList[0];
};

const DAYS = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];

const DAYSNUM = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const QUARTERLY: Array<Quarterly> = [
  {
    quarter: "Quý 1",
    time: "01/06 - 30/07",
  },
  {
    quarter: "Quý 2",
    time: "01/08 - 30/09",
  },
  {
    quarter: "Quý 3",
    time: "01/10 - 30/11",
  },
  {
    quarter: "Quý 4",
    time: "01/12 - 31/12",
  },
];

const DOWNLOAD_ITEMS: IDownloadItem[] = [
  {
    image: images.upload,
    title: "Tool Upload",
    format: "image",
  },
  {
    image: images.windows_10,
    title: "Tải App Windows",
    format: "image",
  },
  {
    image: images.android,
    title: "Tải App Android",
    format: "image",
  },
];

const USER_MANUAL_ITEMS: Array<UserManualItem> = [
  {
      title: 'Lorem ipsum dolor sit amet',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Plate
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque du 
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Consectetur adipiscing elit sed do',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Iusmod tempor incididunt ut labo',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Ut enim ad minim veniam',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Quis nostrud exercitation ullamco',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Excepteur sint occaecat cupidatats',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Sunt in culpa qui officiat',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }, {
      title: 'Sed ut perspiciatis unde omnis iste',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Platea
      sit placerat odio lorem. Cum eleifend bibendum ipsum quis scelerisque dui
      nibh odio id. Nam cras nec non posuere etiam diam sed lacus lacus. In eget
      morbi eros, vitae enim nunc, cursus. Nisl eleifend lectus nunc massa aliquam,
      tellus in imperdiet. Malesuada suspendisse gravida tortor neque quis accumsan
      et posuere. Ac turpis urna ipsum pretium nisi aenean. Facilisis scelerisque
      placerat eget lorem eget maecenas.`
  }
];

export * as Yup from "yup";

export {
  ACTION_INFO_USER, CAPABILITY, CB_ACCOUNT_GROUP, CB_APPROVE, CB_APPROVE_ITEMS, CB_FORMAT, CB_MUSIC_KIND, CB_NATIONALITY, CB_OWNER_ITEMS, CB_PLAYLIST, CB_ROLES, CB_VADILITY_MUSIC, DAYS,
  DAYSNUM, DOWNLOAD_ITEMS, LANGUAGE_ITEMS, QUARTERLY, SIDEBAR_ITEMS, THEME_IMAGES, VALIDITY_CONTRACT_ITEMS, USER_MANUAL_ITEMS,
  formatDate, formatDateDMY, formatDateDMYHPTS, formatDateMDY, formatDateYMD, formatMoney, formatTime, formatToLocalStringCurrentDate, getCurrentDate,
  getCurrentDateDMY, getCurrentDateMDY, getCurrentDateTimeDMY, getTotalMoment, handleClickDropDown,
  regexOnlyNumer, theFollowingDays
};

