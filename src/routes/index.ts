// Layout
import { DefaultLayout } from "../layout/DefaultLayout";
import { HeaderOnly } from "../layout/HeaderOnly";

// Pages
import LoginPage from "../pages/LoginPage";
import ErrorConnectPage from "../pages/ErrorConnectPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
// import EntrustmentContractPage from "~/pages/EntrustmentContractPage";
import BasicInfomationPage from "../pages/BasicInfomationPage";
import ContractPage from "~/pages/ContractPage";
import { Detail as AuthorizationDetail } from "~/pages/AuthorizationContractPage/Detail";

const publicRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/error', component: ErrorConnectPage, layout: HeaderOnly },
    { path: '/reset-password', component: ResetPasswordPage },
    { path: '/forgot-password', component: ForgotPasswordPage },
    // { path: '/contract-management', component: ContractPage, layout: DefaultLayout },
    { path: '/contract-management/authorization-contract/:contractCode', component: AuthorizationDetail, layout: DefaultLayout },
];

const protectedRoutes = [
    { path: '/basic-info', component: BasicInfomationPage, layout: DefaultLayout },
    { path: '/contract-management', component: ContractPage, layout: DefaultLayout },
    // { path: '/contract-management/detail/:contractCode', component: DetailPage, layout: DefaultLayout }
];

export { publicRoutes, protectedRoutes };