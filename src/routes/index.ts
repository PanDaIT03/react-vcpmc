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
import DetailPage from "~/pages/AuthorizationContractPage/DetailPage";
import EditPage from "~/pages/AuthorizationContractPage/EditPage";
import AddPage from "~/pages/AuthorizationContractPage/AddPage";
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

const publicRoutes = [
    { path: routes.LoginPage, component: LoginPage },
    { path: routes.ErrorConnectPage, component: ErrorConnectPage, layout: HeaderOnly },
    { path: routes.ResetPasswordPage, component: ResetPasswordPage },
    { path: routes.ForgotPasswordPage, component: ForgotPasswordPage },
    // { path: routes.EditPlaylistSchedulePage, component: EditPlaylistSchedulePage, layout: DefaultLayout },
    // { path: routes.FeedbackPage, component: FeedbackPage, layout: DefaultLayout },
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
];

export { publicRoutes, protectedRoutes };