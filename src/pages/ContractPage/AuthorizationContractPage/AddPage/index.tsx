import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import { routes } from "~/config/routes";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { IContract, IUserDetail } from "~/types";
import { formatDateDMY, getCurrentDateTimeDMY, getCurrentDate } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { ActionContract } from "~/components/ActionContract";
import { addContractAction } from "~/state/thunk/contract";
import { Loading } from "~/components/Loading";
import { AddContractSuccess } from "~/components/AddContractSuccess";
import { AddRecord } from "~/components/AddRecord";

import styles from "~/sass/ActionContract.module.scss";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: routes.ContractPage
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.ContractPage
    }, {
        title: 'Thêm hợp đồng',
        to: "#"
    }
];

type InitType =
    { fullName: string, companyName: string, position: string }
    & Pick<IContract, "contractCode" | "authorizingLegalEntity" | "customer" | "effectiveDate" | "expirationDate">
    & Omit<IUserDetail, "docId" | "firstName" | "lastName">;

function AddPage() {
    const dispatch = useAppDispatch();
    const params = useParams();
    const { contractCode: code } = params;

    const { setActive } = useContext(SidebarContext);
    const [isAddSuccess, setIsAddSuccess] = useState(false);
    const [addRecordVisible, setAddRecordVisible] = useState(false);

    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading, status } = contractState;
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser } = userState;

    const [contractDetail, setContractDetail] = useState<IContract & IUserDetail>({} as IContract & IUserDetail);

    const initialValues: InitType = {
        contractCode: "",
        customer: "",
        companyName: "",
        position: "",
        authorizingLegalEntity: "Cá nhân",
        effectiveDate: getCurrentDate("yyyy-mm-dd"),
        expirationDate: "",
        fullName: "",
        dateOfBirth: "",
        gender: "Nam",
        nationality: "",
        phoneNumber: "",
        idNumber: "",
        dateRange: "",
        issuedBy: "",
        taxCode: "",
        residence: "",
        email: "",
        userName: "",
        password: "",
        bankNumber: "",
        bank: ""
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            contractCode: Yup.string().required(),
            customer: Yup.string().required(),
            authorizingLegalEntity: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            fullName: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            gender: Yup.string().required(),
            nationality: Yup.string().required(),
            idNumber: Yup.string().required(),
            dateRange: Yup.string().required(),
            issuedBy: Yup.string().required(),
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            userName: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            password: Yup.string()
                .required()
                .min(8),
        }),
        onSubmit: values => {
            const { contractCode, authorizingLegalEntity, customer,
                effectiveDate, expirationDate } = values,

                { fullName, dateOfBirth, gender, nationality, phoneNumber, idNumber,
                    dateRange, issuedBy, taxCode, residence, email, userName, password,
                    bankNumber, bank, companyName, position } = values;

            const fNameList = fullName.split(' ');

            const contract: Omit<IContract, "docId"> = {
                authorized: "",
                authorizedPerson: "",
                authorizingLegalEntity: authorizingLegalEntity,
                approvalDate: "",
                censored: false,
                contractCode: contractCode,
                contractTypesId: "3z6uY6aNa7aqt682G3u5",
                createdBy: currentUser.docId,
                customer: customer,
                dateCreated: getCurrentDateTimeDMY(),
                effectiveDate: formatDateDMY(effectiveDate),
                expirationDate: formatDateDMY(expirationDate),
                ownerShips: [],
                reason: "",
                status: "Mới",
                royalties: '',
                CPM: '',
                administrativeFee: '',
                forControlDate: '',
            };

            const user: Omit<IUserDetail, "docId"> = {
                firstName: fNameList[0],
                lastName: fNameList[fNameList.length - 1],
                dateOfBirth: formatDateDMY(dateOfBirth),
                gender: gender,
                nationality: nationality,
                phoneNumber: phoneNumber,
                idNumber: idNumber,
                dateRange: formatDateDMY(dateRange),
                issuedBy: issuedBy,
                taxCode: taxCode,
                residence: residence,
                email: email,
                userName: userName,
                password: password,
                bankNumber: bankNumber,
                bank: bank,
                companyName: companyName,
                position: position
            };

            dispatch(addContractAction({ contract: contract, user: user }));
        }
    });

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (status === "insert success")
            setIsAddSuccess(true);

        const contract = contracts.find(contract => contract.contractCode === code)
        setContractDetail(contract || {} as IContract & IUserDetail);
    }, [contractState]);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Thêm hợp đồng ủy quyền mới"
                paging={PAGING_ITEMS}
            >
                <>
                    <div className={cx(!isAddSuccess ? "active" : "inactive")}>
                        <ActionContract
                            formik={formik}
                            contractDetail={contractDetail}
                            loading={loading}
                            type="add"
                        />
                    </div>
                    <div className={cx("contract-success", isAddSuccess ? "active" : "inactive")}>
                        <AddContractSuccess
                            visible={!addRecordVisible}
                            setState={setAddRecordVisible}
                        />
                    </div>
                    <AddRecord
                        visible={addRecordVisible}
                        setState={setAddRecordVisible}
                    />
                    <Loading loading={loading} />
                </>
            </CommonWrapper >
        </div>
    );
};

export default AddPage;