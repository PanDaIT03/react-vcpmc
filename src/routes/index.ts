// Layout
import { DefaultLayout } from "../layout/DefaultLayout";
import { HeaderOnly } from "../layout/HeaderOnly";

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

const publicRoutes = [
    { path: routes.LoginPage, component: LoginPage },
    { path: routes.ErrorConnectPage, component: ErrorConnectPage, layout: HeaderOnly },
    { path: routes.ResetPasswordPage, component: ResetPasswordPage },
    { path: routes.ForgotPasswordPage, component: ForgotPasswordPage },
    { path: routes.EditPage, component: EditPage, layout: DefaultLayout },
];

const protectedRoutes = [
    { path: routes.ProfilePage, component: ProfilePage, layout: DefaultLayout },
    { path: routes.ContractPage, component: ContractPage, layout: DefaultLayout },
    { path: routes.DetailPage, component: DetailPage, layout: DefaultLayout },
];

export { publicRoutes, protectedRoutes };