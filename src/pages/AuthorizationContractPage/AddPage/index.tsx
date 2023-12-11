import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import { routes } from "~/config/routes";
import { Contract } from "~/components/Contract";
import { PagingItemType } from "~/components/Paging";
import { IContract, IUserDetail } from "~/types";
import { formatDateDMY } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { RootState, useAppDispatch } from "~/state";
import { ActionContract } from "~/components/ActionContract";
import { addContractAction } from "~/state/thunk/contract";

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

type InitType = { fullName: string } & Pick<IContract, "contractCode" | "customer" | "authorizingLegalEntity" | "effectiveDate" |
    "expirationDate" | "status"> & Omit<IUserDetail, "docId" | "firstName" | "lastName">;

const initialValues: InitType = {} as InitType;

function AddPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { contractCode: code } = params;

    const { setActive } = useContext(SidebarContext);

    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading } = contractState;
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser } = userState;

    const [contractDetail, setContractDetail] = useState<IContract & IUserDetail>({} as IContract & IUserDetail);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            // contractCode: Yup.string().required(),
            // customer: Yup.string().required(),
            // effectiveDate: Yup.string().required(),
            // expirationDate: Yup.string().required(),
            // status: Yup.string().required(),
            // fullName: Yup.string().required(),
            // dateOfBirth: Yup.string().required(),
            // gender: Yup.string().required(),
            // nationality: Yup.string().required(),
            // phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            // idNumber: Yup.string().required(),
            // dateRange: Yup.string().required(),
            // issuedBy: Yup.string().required(),
            // taxCode: Yup.string().required(),
            // residence: Yup.string().required(),
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            // userName: Yup.string()
            //     .required("Không được để trống")
            //     .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            // password: Yup.string().required(),
            // bankNumber: Yup.string().required().matches(/^[0-9]*$/),
            // bank: Yup.string().required(),
        }),
        onSubmit: values => {
            const { contractCode, customer, authorizingLegalEntity, effectiveDate, expirationDate, status } = values,

                { fullName, dateOfBirth, gender, nationality, phoneNumber, idNumber, dateRange,
                    issuedBy, taxCode, residence, email, userName, password, bankNumber, bank } = values;

            const fNameList = fullName.split(' ');

            const contract: IContract = {
                docId: "",
                authorized: "KEYO",
                authorizedPerson: "",
                authorizingLegalEntity: "",
                censored: false,
                contractCode: contractCode,
                contractTypesId: "",
                createdBy: currentUser.docId,
                customer: customer,
                dateCreated: "",
                effectiveDate: effectiveDate,
                expirationDate: expirationDate,
                ownerShips: "",
                reason: "",
                status: "Mới"
            }

            const user: IUserDetail = {
                docId: "",
                firstName: fNameList[0],
                lastName: fNameList[fNameList.length - 1],
                dateOfBirth: formatDateDMY(dateOfBirth) || "",
                gender: gender,
                nationality: nationality,
                phoneNumber: phoneNumber,
                idNumber: idNumber,
                dateRange: formatDateDMY(dateRange) || "",
                issuedBy: issuedBy,
                taxCode: taxCode,
                residence: residence,
                email: email,
                userName: userName,
                password: password,
                bankNumber: bankNumber,
                bank: bank,
            };

            console.log("contract", contract);
            console.log("user", user);

            dispatch(addContractAction({ contract: contract, user: user }));
        }
    });

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (contracts.length <= 0)
            navigate(routes.ContractPage);

        const contract = contracts.find(contract => contract.contractCode === code)
        setContractDetail(contract || {} as IContract & IUserDetail);
    }, [contracts]);


    return (
        <div className={cx("wrapper")}>
            <Contract
                title="Thêm hợp đồng ủy quyền mới"
                paging={PAGING_ITEMS}
            >
                <ActionContract
                    formik={formik}
                    contractDetail={contractDetail}
                    loading={loading}
                    type="add"
                />
            </Contract>
        </div>
    );
};

export default AddPage;