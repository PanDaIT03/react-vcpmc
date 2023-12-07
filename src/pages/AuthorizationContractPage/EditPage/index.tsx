import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import Button from "~/components/Button";
// import { User } from "~/api/userAPI";
// import { EtmContract } from "~/api/etmContractAPI";
// import { Yup, formatDateDMY } from "~/constants";
// import { saveEntrustmentContract } from "~/thunk/etmContractThunk";
import { Loading } from "~/components/Loading";
// import { formatToLocalStringCurrentDate } from "~/context";
import { IUser, IUserDetail } from "~/types";
import { Contract } from "~/components/Contract";
import ContractEditPage from "~/pages/ContractEditPage";
import { RootState, useAppDispatch } from "~/state";

import style from '~/sass/Edit.module.scss';
import { useParams } from "react-router-dom";
const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: routes.ContractPage
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.ContractPage
    }, {
        title: 'Chi tiết',
        to: routes.DetailPage
    }, {
        title: 'Chỉnh sửa thông tin',
        to: "#"
    }
];

interface IContract {
    contractId: string
    contractCode: string
    customer: string
    effectiveDate: string
    expirationDate: string
    status: string
};

interface InitType {
    contractCode: string
    customer: string
    effectiveDate: string
    expirationDate: string
    status: string
    fullName: string
    dateOfBirth: string
    gender: string
    nationality: string
    phoneNumber: string
    idNumber: string
    dateRange: string
    issuedBy: string
    taxCode: string
    residence: string
    bank: string
    bankNumber: string
    email: string
    userName: string
    password: string
};

const initialValues: InitType = {} as InitType;

function EditPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    // const { contractCode } = params;

    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, loading } = contractState;
    const user = useSelector((state: RootState) => state.user);

    const [contractDetail, setContractDetail] = useState<(IContract & IUserDetail)[]>([]);

    useEffect(() => {
        // const contract = contracts.filter(contract => contract.contractCode === contractCode)
        // setContractDetail(contract);
    }, [contracts]);

    const contractFormik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            contractCode: Yup.string().required(),
            customer: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            status: Yup.string().required(),
            fullName: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            gender: Yup.string().required(),
            nationality: Yup.string().required(),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            idNumber: Yup.string().required(),
            dateRange: Yup.string().required(),
            issuedBy: Yup.string().required(),
            taxCode: Yup.string().required(),
            residence: Yup.string().required(),
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            userName: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            password: Yup.string().required(),
            bankNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            bank: Yup.string().required(),
        }),
        onSubmit: values => {
            const { contractCode, customer, effectiveDate, expirationDate, status } = values,

                { fullName, dateOfBirth, gender, nationality, phoneNumber, idNumber, dateRange,
                    issuedBy, taxCode, residence, email, userName, password, bankNumber, bank } = values;
            const fNameList = fullName.split(' ');

            const contract: IContract = {
                contractId: '',
                contractCode: contractCode,
                customer: customer,
                effectiveDate: effectiveDate,
                expirationDate: expirationDate,
                status: status
            };

            const user: IUserDetail = {
                docId: '',
                firstName: fNameList[fNameList.length - 1],
                lastName: fNameList[0],
                dateOfBirth: dateOfBirth,
                gender: gender,
                nationality: nationality,
                phoneNumber: phoneNumber,
                idNumber: idNumber,
                dateRange: dateRange,
                issuedBy: issuedBy,
                taxCode: taxCode,
                residence: residence,
                email: email,
                userName: userName,
                password: password,
                bankNumber: bankNumber,
                bank: bank,
            };

            // dispatch(saveEntrustmentContract({
            //     contract,
            //     user,
            //     navigate: () => navigate(routes.ContractPage)
            // }));
        }
    });

    const { contractCode, customer, effectiveDate, expirationDate, status,
        fullName, dateOfBirth, gender, nationality, phoneNumber, idNumber, dateRange,
        issuedBy, taxCode, residence, email, userName, password, bankNumber, bank } = contractFormik.values;

    return (
        <div className={cx('entrustment-contract-container')}>
            <ContractEditPage
                title='Thêm hợp đồng khai thác mới'
                edit={true}
                formikData={contractFormik}
                paging={PAGING_ITEMS}
                data={
                    [
                        {
                            id: 1,
                            children: [
                                {
                                    title: 'Tên hợp đồng:',
                                    content: customer
                                }, {
                                    title: 'Số hợp đồng:',
                                    content: contractCode
                                }, {
                                    title: 'Ngày hiệu lực:',
                                    content: effectiveDate
                                }, {
                                    title: 'Ngày hết hạn:',
                                    content: expirationDate
                                }, {
                                    title: 'Tình trạng:',
                                    content: status
                                }
                            ]
                        }, {
                            id: 2,
                            children: [
                                {
                                    title: 'Tên hợp đồng:',
                                    content: customer
                                }, {
                                    title: 'Số hợp đồng:',
                                    content: contractCode
                                }, {
                                    title: 'Ngày hiệu lực:',
                                    content: effectiveDate
                                }, {
                                    title: 'Ngày hết hạn:',
                                    content: expirationDate
                                }, {
                                    title: 'Tình trạng:',
                                    content: status
                                }
                            ]
                        }
                    ]}
            >
                <Button
                    value="Hủy"
                    primary
                    buttonType="button"
                    onClick={() => navigate(routes.DetailPage)}
                />
                <Button value="Lưu" primary buttonType="submit" />
            </ContractEditPage>
            <Loading loading={loading} />
        </div>
    );
};

export default EditPage;