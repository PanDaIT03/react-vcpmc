import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { EtmContract } from "~/api/entrustmentContract";
import { Button } from "~/components/Button";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { Yup, formatToLocalStringCurrentDate } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { RootState, useAppDispatch } from "~/state";
import { saveEntrustmentContract } from "~/state/thunk/entrustmentContractThunk";
import { User } from "~/types";
import { CommonPageContractEdit } from "../Components/CommonPage";

import style from '~/sass/AddEntrustmentContract.module.scss';
const cx = classNames.bind(style);

function AddEtrustmentContractPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useContext(SidebarContext);

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const user = useSelector((state: RootState) => state.user);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    const contractFormik = useFormik({
        initialValues: {
            docId: '',
            code: '',
            createdBy: '',
            createdDate: '',
            distributionValue: '',
            effectiveDate: '',
            expirationDate: '',
            name: '',
            status: 'Mới',
            type: 'Trọn gói',
            value: '',
            companyName: '',
            position: '',
            usersId: user.currentUser.docId,
            avatar: '',
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            gender: 'Nam',
            idNumber: '',
            issuedBy: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            rolesId: '',
            taxCode: '',
            userName: '',
            fullName: '',
            playValue: '',
        },
        validationSchema: Yup.object({
            code: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            name: Yup.string().required(),
            type: Yup.string().required(),
            companyName: Yup.string().required(),
            position: Yup.string().required(),
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            gender: Yup.string().required(),
            idNumber: Yup.number().required(),
            issuedBy: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
            residence: Yup.string().required(),
            taxCode: Yup.number().required(),
            usersId: Yup.string().required(),
            userName: Yup.string()
                .required("Không được để trống")
                .matches(/^\S+@\S+\.\S+$/, "Vui lòng nhập địa chỉ đúng định dạng"),
            distributionValue: Yup.number().required(),
            value: Yup.number().required(),
            playValue: Yup.number().required(),
        }),
        onSubmit: values => {
            const { code, distributionValue, effectiveDate, expirationDate, name,
                playValue, fullName, type, value, companyName, position } = values;

            const { avatar, bank, bankNumber, dateOfBirth, dateRange, email, gender, idNumber, usersId,
                issuedBy, nationality, password, phoneNumber, residence, taxCode, userName } = values;

            const formatToDMY = (date: string) => {
                const dateArray = date.split('-');

                return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
            }

            const fullNameList = fullName.split(' ');

            const user: Omit<User, 'role'> = {
                avatar: avatar,
                bank: bank,
                bankNumber: bankNumber,
                companyName: companyName,
                dateOfBirth: formatToDMY(dateOfBirth),
                dateRange: formatToDMY(dateRange),
                email: email,
                firstName: fullNameList[fullNameList.length - 1],
                gender: gender,
                idNumber: idNumber,
                issuedBy: issuedBy,
                lastName: fullNameList[0],
                nationality: nationality,
                password: password,
                phoneNumber: phoneNumber,
                residence: residence,
                rolesId: 'JhKyWdxCPbLtOSAboKZD',
                taxCode: taxCode,
                userName: userName,
                docId: ''
            }

            const contract = {
                docId: '',
                code: code,
                createdBy: usersId,
                createdDate: formatToLocalStringCurrentDate(),
                companyName: companyName,
                distributionValue: distributionValue,
                effectiveDate: formatToDMY(effectiveDate),
                expirationDate: formatToDMY(expirationDate),
                name: name,
                status: 'Mới',
                type: type,
                value: value,
                position: position,
                usersId: '',
                playValue: playValue,
            }

            dispatch(saveEntrustmentContract({
                contract,
                user,
                navigate: () => navigate(routes.ContractPage)
            }));
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Quản lý',
                to: routes.ContractPage,
                active: true
            }, {
                title: 'Quản lý hợp đồng',
                to: routes.ContractPage,
                active: true
            }, {
                title: 'Chi tiết',
                to: "#",
                active: false
            }
        ]);
    }, []);
    
    return (
        <div className={cx('entrustment-contract-container')}>
            <CommonPageContractEdit
                pagingData={paging}
                title='Thêm hợp đồng khai thác mới'
                edit={true}
                formikData={contractFormik}
                data={[]}
            >
                <div className={cx('form__action')}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => {
                            navigate(routes.ContractPage);
                            setActive(true);
                        }}
                    />
                    <Button
                        primary
                        fill
                        size="large"
                        value="Lưu"
                        onClick={() => contractFormik.handleSubmit()}
                    />
                </div>
            </CommonPageContractEdit>
            <Loading loading={etmContract.loading} />
        </div>
    );
};

export default AddEtrustmentContractPage;