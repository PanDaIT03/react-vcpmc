// Layout
import { DefaultLayout } from "../layouts/DefaultLayout";
import { HeaderOnly } from "../layouts/HeaderOnly";

import { routes } from "~/config/routes";

// Pages
import AddPage from "~/pages/AuthorizationContractPage/AddPage";
import DetailPage from "~/pages/AuthorizationContractPage/DetailPage";
import EditPage from "~/pages/AuthorizationContractPage/EditPage";
import ContractPage from "~/pages/ContractPage";
import AddEtrustmentContractPage from "~/pages/EntrustmentContract/AddEntrustmentContract";
import EntrustmentContractDetailPage from "~/pages/EntrustmentContract/EntrustmentContractDetail";
import ForControlHistoryPage from "~/pages/ForControlPage";
import PlayListPage from "~/pages/PlayListPage";
import AddPlaylistPage from "~/pages/PlayListPage/AddPlaylistPage";
import AddPlaylistRecordPage from "~/pages/PlayListPage/AddPlaylistRecordPage";
import PlaylistDetailPage from "~/pages/PlayListPage/PlaylistDetailPage";
import PlaylistSchedulePage from "~/pages/PlaylistSchedulePage";
import EditPlaylistSchedulePage from "~/pages/PlaylistSchedulePage/EditPlaylistSchedulePage";
import PlaylistScheduleDetailPage from "~/pages/PlaylistSchedulePage/PlaylistScheduleDetailPage";
import RecordPage from "~/pages/RecordPage";
import EditRecordPage from "~/pages/RecordPage/EditPage";
import RevenueContractReportDetailPage from "~/pages/Revenue/ContractDetailPage";
import RevenueReportDetailPage from "~/pages/Revenue/ReportDetailPage";
import RevenueReportPage from "~/pages/Revenue/ReportPage";
import UnitUsedManagementPage from "~/pages/UnitPage";
import UnitUsedDetailPage from "~/pages/UnitPage/UnitDetailPage";
import AddUserOfUnitPage from "~/pages/UnitPage/UserPage/AddUserPage";
import UserOfUnitDetailPage from "~/pages/UnitPage/UserPage/UserDetailPage";
import ErrorConnectPage from "../pages/ErrorConnectPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForControlHistoryDetailPage from "~/pages/ForControlPage/ForControlDetailPage";
import RevenueDistributionPage from "~/pages/Revenue/RevenueDistributionPage";
import RevenueDistributionDetailPage from "~/pages/Revenue/RevenueDetailPage";
import EditUserPage from "~/pages/User/EditUser";
import UserAuthorizationPage from "~/pages/User/Authorization";
import AddUserPage from "~/pages/User/AddUser";
import AuthorizedEditRolePage from "~/pages/RolePage/EditRole";
import AuthorizedAddRolePage from "~/pages/RolePage/AddRolePage";
import ForControlCirclePage from "~/pages/ContractTypeManagementPage/ForControlPage";
import SupportUserManualPage from "~/pages/SupportPage/UserManualPage";

const publicRoutes = [
    { path: routes.LoginPage, component: LoginPage },
    { path: routes.ErrorConnectPage, component: ErrorConnectPage, layout: HeaderOnly },
    { path: routes.ResetPasswordPage, component: ResetPasswordPage },
    { path: routes.ForgotPasswordPage, component: ForgotPasswordPage },
    // { path: routes.EditPlaylistSchedulePage, component: EditPlaylistSchedulePage, layout: DefaultLayout },
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
    { path: routes.EntrustmentContractDetail, component: EntrustmentContractDetailPage, layout: DefaultLayout },
    { path: routes.AddEntrustmentContract, component: AddEtrustmentContractPage, layout: DefaultLayout },
    { path: routes.RevenueReportPage, component: RevenueReportPage, layout: DefaultLayout },
    { path: routes.RevenueReportDetailPage, component: RevenueReportDetailPage, layout: DefaultLayout },
    { path: routes.RevenueReportContractDetailPage, component: RevenueContractReportDetailPage, layout: DefaultLayout },
    { path: routes.UnitUsedManagementPage, component: UnitUsedManagementPage, layout: DefaultLayout },
    { path: routes.UnitUsedManagementDetailPage, component: UnitUsedDetailPage, layout: DefaultLayout },
    { path: routes.UserOfUnitUsedManagementDetailPage, component: UserOfUnitDetailPage, layout: DefaultLayout },
    { path: routes.AddUserOfUnitUsedManagementPage, component: AddUserOfUnitPage, layout: DefaultLayout },
    { path: routes.ForControlHistoryPage, component: ForControlHistoryPage, layout: DefaultLayout },
    { path: routes.ForControlHistoryDetailPage, component: ForControlHistoryDetailPage, layout: DefaultLayout },
    { path: routes.AuthorizedUser, component: UserAuthorizationPage, layout: DefaultLayout },
    { path: routes.RevenueDistributionPage, component: RevenueDistributionPage, layout: DefaultLayout },
    { path: routes.RevenueDistributionDetailPage, component: RevenueDistributionDetailPage, layout: DefaultLayout },
    { path: routes.AuthorizedEditUser, component: EditUserPage, layout: DefaultLayout },
    { path: routes.AuthorizedAddUser, component: AddUserPage, layout: DefaultLayout },
    { path: routes.AuthorizedEditRole, component: AuthorizedEditRolePage, layout: DefaultLayout },
    { path: routes.AuthorizedAddRole, component: AuthorizedAddRolePage, layout: DefaultLayout },
    { path: routes.ContractTypeForControl, component: ForControlCirclePage, layout: DefaultLayout },
    { path: routes.SupportUserManual, component: SupportUserManualPage, layout: DefaultLayout },
];

export { protectedRoutes, publicRoutes };

