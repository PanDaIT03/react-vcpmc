// Layout
import { DefaultLayout } from "../layouts/DefaultLayout";
import { HeaderOnly } from "../layouts/HeaderOnly";

import { routes } from "~/config/routes";

// Pages
import LoginPage from "../pages/LoginPage";
import ErrorConnectPage from "../pages/ErrorConnectPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import ContractPage from "~/pages/ContractPage";
import DetailPage from "~/pages/ContractPage/AuthorizationContractPage/DetailPage";
import EditPage from "~/pages/ContractPage/AuthorizationContractPage/EditPage";
import AddPage from "~/pages/ContractPage/AuthorizationContractPage/AddPage";
import RecordPage from "~/pages/RecordPage";
import EditRecordPage from "~/pages/RecordPage/EditPage";
import PlayListPage from "~/pages/PlayListPage";
import PlaylistDetailPage from "~/pages/PlayListPage/PlaylistDetailPage";
import AddPlaylistPage from "~/pages/PlayListPage/AddPlaylistPage";
import AddPlaylistRecordPage from "~/pages/PlayListPage/AddPlaylistRecordPage";
import PlaylistSchedulePage from "~/pages/PlaylistSchedulePage";
import PlaylistScheduleDetailPage from "~/pages/PlaylistSchedulePage/PlaylistScheduleDetailPage";
import EditPlaylistSchedulePage from "~/pages/PlaylistSchedulePage/EditPlaylistSchedulePage";
import AuthorizedPartnerPage from "~/pages/AuthorizedPartnerPage";
import EditAuthorizedPartnerPage from "~/pages/AuthorizedPartnerPage/EditAuthorizedPartnerPage";
import DevicePage from "~/pages/DevicePage";
import DeviceDetailPage from "~/pages/DevicePage/DeviceDetailPage";
import SettingPage from "~/pages/SettingPage";
import CategoryPage from "~/pages/CategoryPage";
import EditCategoryPage from "~/pages/CategoryPage/EditCategoryPage";
import DownloadPage from "~/pages/SupportPage/DownloadPage";
import FeedbackPage from "~/pages/SupportPage/Feedback";
import AddEtrustmentContractPage from "~/pages/ContractPage/EntrustmentContractPage/AddEntrustmentContract";
import UnitUsedManagementPage from "~/pages/UnitPage";
import UnitUsedDetailPage from "~/pages/UnitPage/UnitDetailPage";
import UserOfUnitDetailPage from "~/pages/UnitPage/UserPage/UserDetailPage";
import AddUserOfUnitPage from "~/pages/UnitPage/UserPage/AddUserPage";
import EntrustmentContractDetailPage from "~/pages/ContractPage/EntrustmentContractPage/EntrustmentContractDetail";
import RevenueReportPage from "~/pages/Revenue";
import RevenueReportDetailPage from "~/pages/Revenue/ReportDetailPage";
import RevenueContractReportDetailPage from "~/pages/Revenue/ContractDetailPage";
import ForControlHistoryPage from "~/pages/ForControlPage";
import ForControlHistoryDetailPage from "~/pages/ForControlPage/ForControlDetailPage";
import RevenueDistributionDetailPage from "~/pages/Revenue/RevenueDetailPage";
import RevenueDistributionPage from "~/pages/Revenue/RevenueDistributionPage";
import UserAuthorizationPage from "~/pages/User/Authorization";
import EditUserPage from "~/pages/User/EditUser";
import AddUserPage from "~/pages/User/AddUser";
import AuthorizedEditRolePage from "~/pages/RolePage/EditRole";
import AuthorizedAddRolePage from "~/pages/RolePage/AddRolePage";
import SupportUserManualPage from "~/pages/SupportPage/UserManualPage";
import ForControlCirclePage from "~/pages/SettingPage/ForControlPage";
import ManagementContractTypePage from "~/pages/SettingPage/ManagementContractTypePage";
import EditWarningExpirePage from "~/pages/SettingPage/ManagementContractTypePage/EditWarningExpirePage";
import EditContractTypePage from "~/pages/SettingPage/ManagementContractTypePage/EditContractTypePage";

const publicRoutes = [
    { path: routes.LoginPage, component: LoginPage },
    { path: routes.ErrorConnectPage, component: ErrorConnectPage, layout: HeaderOnly },
    { path: routes.ResetPasswordPage, component: ResetPasswordPage },
    { path: routes.ForgotPasswordPage, component: ForgotPasswordPage },
];

const protectedRoutes = [
    { path: routes.ProfilePage, component: ProfilePage, layout: DefaultLayout },
    { path: routes.ContractPage, component: ContractPage, layout: DefaultLayout },
    { path: routes.EditPage, component: EditPage, layout: DefaultLayout },
    { path: routes.DetailPage, component: DetailPage, layout: DefaultLayout },
    { path: routes.RecordPage, component: RecordPage, layout: DefaultLayout },
    { path: routes.AddPage, component: AddPage, layout: DefaultLayout },
    { path: routes.EditRecordPage, component: EditRecordPage, layout: DefaultLayout },
    { path: routes.PlaylistPage, component: PlayListPage, layout: DefaultLayout },
    { path: routes.PlaylistDetailPage, component: PlaylistDetailPage, layout: DefaultLayout },
    { path: routes.AddPlaylistPage, component: AddPlaylistPage, layout: DefaultLayout },
    { path: routes.AddPlaylistRecordPage, component: AddPlaylistRecordPage, layout: DefaultLayout },
    { path: routes.PlaylistSchedulePage, component: PlaylistSchedulePage, layout: DefaultLayout },
    { path: routes.PlaylistScheduleDetailPage, component: PlaylistScheduleDetailPage, layout: DefaultLayout },
    { path: routes.EditPlaylistSchedulePage, component: EditPlaylistSchedulePage, layout: DefaultLayout },
    { path: routes.AuthorizedPartnerPage, component: AuthorizedPartnerPage, layout: DefaultLayout },
    { path: routes.EditAuthorizedPartnerPage, component: EditAuthorizedPartnerPage, layout: DefaultLayout },
    { path: routes.DevicePage, component: DevicePage, layout: DefaultLayout },
    { path: routes.DeviceDetailPage, component: DeviceDetailPage, layout: DefaultLayout },
    { path: routes.SettingPage, component: SettingPage, layout: DefaultLayout },
    { path: routes.CategoryPage, component: CategoryPage, layout: DefaultLayout },
    { path: routes.EditCategoryPage, component: EditCategoryPage, layout: DefaultLayout },
    { path: routes.DownloadPage, component: DownloadPage, layout: DefaultLayout },
    { path: routes.FeedbackPage, component: FeedbackPage, layout: DefaultLayout },
    { path: routes.EntrustmentContractDetail, component: EntrustmentContractDetailPage, layout: DefaultLayout },
    { path: routes.AddEntrustmentContractPage, component: AddEtrustmentContractPage, layout: DefaultLayout },
    { path: routes.UnitUsedManagementPage, component: UnitUsedManagementPage, layout: DefaultLayout },
    { path: routes.UnitUsedManagementDetailPage, component: UnitUsedDetailPage, layout: DefaultLayout },
    { path: routes.UserOfUnitUsedManagementDetailPage, component: UserOfUnitDetailPage, layout: DefaultLayout },
    { path: routes.AddUserOfUnitUsedManagementPage, component: AddUserOfUnitPage, layout: DefaultLayout },
    { path: routes.RevenueReportPage, component: RevenueReportPage, layout: DefaultLayout },
    { path: routes.RevenueReportDetailPage, component: RevenueReportDetailPage, layout: DefaultLayout },
    { path: routes.RevenueReportContractDetailPage, component: RevenueContractReportDetailPage, layout: DefaultLayout },
    { path: routes.ForControlHistoryPage, component: ForControlHistoryPage, layout: DefaultLayout },
    { path: routes.ForControlHistoryDetailPage, component: ForControlHistoryDetailPage, layout: DefaultLayout },
    { path: routes.RevenueDistributionPage, component: RevenueDistributionPage, layout: DefaultLayout },
    { path: routes.RevenueDistributionDetailPage, component: RevenueDistributionDetailPage, layout: DefaultLayout },
    { path: routes.AuthorizedUserPage, component: UserAuthorizationPage, layout: DefaultLayout },
    { path: routes.AuthorizedEditUserPage, component: EditUserPage, layout: DefaultLayout },
    { path: routes.AuthorizedAddUserPage, component: AddUserPage, layout: DefaultLayout },
    { path: routes.AuthorizedEditRolePage, component: AuthorizedEditRolePage, layout: DefaultLayout },
    { path: routes.AuthorizedAddRolePage, component: AuthorizedAddRolePage, layout: DefaultLayout },
    { path: routes.SupportUserManualPage, component: SupportUserManualPage, layout: DefaultLayout },
    { path: routes.SettingForControlPage, component: ForControlCirclePage, layout: DefaultLayout },
    { path: routes.EditWarningExpirePage, component: EditWarningExpirePage, layout: DefaultLayout },
    { path: routes.ManagementContractTypePage, component: ManagementContractTypePage, layout: DefaultLayout },
    { path: routes.EditContractTypePage, component: EditContractTypePage, layout: DefaultLayout },
];

export { publicRoutes, protectedRoutes };