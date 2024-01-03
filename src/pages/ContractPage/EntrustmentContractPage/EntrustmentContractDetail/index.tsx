import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import * as Yup from 'yup';

import { getUserById } from "~/api/user";
import { images } from "~/assets";
import { Button } from "~/components/Button";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { cancelEntrustmentContract, getETMContractById, saveEntrustmentContract } from "~/state/thunk/entrustmentContract";
import { User } from "~/types";
import { EtmContract } from "~/types/EntrustmentContractType";
import { CommonPageContractEdit } from "../Components/CommonPage";

import style from '~/sass/EntrustmentContractDetail.module.scss';
const cx = classNames.bind(style);

const PAGING_ITEMS: Array<PagingItemType> = [
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
        active: true
    }
];

function EntrustmentContractDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const role = useSelector((state: RootState) => state.role);

    const [actionData, setActionData] = useState<Array<any>>([]);
    const [edit, setEdit] = useState<boolean>(false);

    const contractFormik = useFormik({
        initialValues: {
            docId: '',
            code: '',
            contractCode: '',
            createdBy: '',
            createdDate: '',
            distributionValue: '',
            effectiveDate: '',
            expirationDate: '',
            name: '',
            status: '',
            type: '',
            value: '',
            companyName: '',
            position: '',
            usersId: '',
            avatar: '',
            bank: '',
            bankNumber: '',
            dateOfBirth: '',
            dateRange: '',
            email: '',
            firstName: '',
            gender: '',
            idNumber: '',
            issuedBy: '',
            lastName: '',
            nationality: '',
            password: '',
            phoneNumber: '',
            residence: '',
            rolesId: '',
            taxCode: '',
            userName: '',
            fullName: '',
            playValue: ''
        },
        validationSchema: Yup.object({
            code: Yup.string().required(),
            createdDate: Yup.string().required(),
            distributionValue: Yup.string().required(),
            effectiveDate: Yup.string().required(),
            expirationDate: Yup.string().required(),
            name: Yup.string().required(),
            status: Yup.string().required(),
            type: Yup.string().required(),
            value: Yup.string().required(),
            companyName: Yup.string().required(),
            position: Yup.string().required(),
            usersId: Yup.string().required(),
            bank: Yup.string().required(),
            bankNumber: Yup.string().required(),
            dateOfBirth: Yup.string().required(),
            dateRange: Yup.string().required(),
            email: Yup.string().required(),
            firstName: Yup.string().required(),
            gender: Yup.string().required(),
            idNumber: Yup.string().required(),
            issuedBy: Yup.string().required(),
            lastName: Yup.string().required(),
            nationality: Yup.string().required(),
            password: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            residence: Yup.string().required(),
            rolesId: Yup.string().required(),
            taxCode: Yup.string().required(),
            userName: Yup.string().required(),
            fullName: Yup.string().required()
        }),
        onSubmit: values => {
            const { code, distributionValue, effectiveDate, expirationDate, docId, name, playValue,
                status, type, value, companyName, position, createdBy, createdDate, usersId } = values;

            const { avatar, bank, bankNumber, dateOfBirth, dateRange, email, gender,
                idNumber, issuedBy, nationality, password, phoneNumber, residence,
                rolesId, taxCode, userName, fullName } = values;

            const fullNameList = fullName.split(' ');

            const formatToDMY = (date: string) => {
                const dateArray = date.split('-');

                return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
            }

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
                rolesId: rolesId,
                taxCode: taxCode,
                userName: userName,
                docId: usersId
            }

            const contract: EtmContract = {
                docId: docId,
                code: code,
                createdBy: createdBy,
                createdDate: createdDate,
                companyName: companyName,
                distributionValue: distributionValue,
                effectiveDate: formatToDMY(effectiveDate),
                expirationDate: formatToDMY(expirationDate),
                name: name,
                status: status,
                type: type,
                value: value,
                position: position,
                usersId: usersId,
                playValue: playValue
            }

            dispatch(saveEntrustmentContract({
                contract, user, navigate: () => navigate(routes.ContractPage)
            }));
        }
    });

    const { code, distributionValue, effectiveDate, expirationDate, playValue,
        name, status, type, value, companyName, position } = contractFormik.values;

    useEffect(() => {
        if (id === '') return;

        dispatch(getETMContractById(id || ''));
    }, [id]);

    const formatYMDToMDY = (date: string) => {
        let dateArray = date.split('/');

        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    }

    useEffect(() => {
        if (Object.keys(etmContract.etmContract).length <= 0) return;

        const getUser = async () => {
            const { usersId } = etmContract.etmContract;
            const user = await getUserById(usersId);

            if (typeof user !== 'undefined')
                contractFormik.setValues({
                    ...user,
                    ...etmContract.etmContract,
                    fullName: `${user.firstName} ${user.lastName}`,
                    playValue: etmContract.etmContract.playValue,
                    dateOfBirth: formatYMDToMDY(user.dateOfBirth),
                    expirationDate: formatYMDToMDY(etmContract.etmContract.expirationDate),
                    effectiveDate: formatYMDToMDY(etmContract.etmContract.effectiveDate),
                    dateRange: formatYMDToMDY(user.dateRange),
                    contractCode: etmContract.etmContract.code,
                    value: etmContract.etmContract.value,
                    distributionValue: etmContract.etmContract.distributionValue
                });
        }

        getUser();
    }, [etmContract.etmContract]);

    const handleCancelContract = async () => {
        await dispatch(cancelEntrustmentContract({
            docId: contractFormik.values.docId,
            status: 'Đã hủy'
        }));
        navigate(routes.ContractPage);
    }

    useEffect(() => {
        let statusCancel = false;

        if (status === 'Hết hiệu lực')
            statusCancel = true;
        if (status === 'Đã hủy')
            statusCancel = true;

        setActionData([
            {
                icon: images.edit,
                title: 'Chỉnh sửa',
                onClick: () => setEdit(true),
                disable: (status === 'Mới' || status === 'Đang hiệu lực') ? false : true
            }, {
                icon: images.fiX,
                title: 'Huỷ hợp đồng',
                onClick: () => handleCancelContract(),
                disable: statusCancel
            }
        ]);
    }, [status]);

    return (
        <div className={cx('entrustment-detail-container')}>
            <CommonPageContractEdit
                pagingData={PAGING_ITEMS}
                title={`Hợp đồng khai thác - ${contractFormik.values.contractCode}`}
                edit={edit}
                formikData={contractFormik}
                actionData={actionData}
                data={
                    [{
                        id: 1,
                        children: [
                            {
                                id: 1,
                                title: 'Tên hợp đồng:',
                                tag: <div>{name}</div>
                            }, {
                                id: 2,
                                title: 'Số hợp đồng:',
                                tag: <div>{code}</div>
                            }, {
                                id: 3,
                                title: 'Ngày hiệu lực:',
                                tag: <div>{effectiveDate}</div>
                            }, {
                                id: 4,
                                title: 'Ngày hết hạn:',
                                tag: <div>{expirationDate}</div>
                            }
                        ]
                    }, {
                        id: 2,
                        children: [{
                            id: 1,
                            title: 'Đính kèm tệp:',
                            tag: <div>Hợp đồng kinh doanh</div>
                        }]
                    }, {
                        id: 3,
                        children: [{
                            id: 1,
                            title: 'Loại hợp đồng:',
                            tag: <div>{type}</div>
                        }, {
                            id: 2,
                            title: type === 'Trọn gói' ? 'Giá trị hợp đồng (VNĐ):' : 'Giá trị lượt phát (VNĐ)/lượt',
                            tag: <div>{type === 'Trọn gói' ? value : playValue}</div>
                        }, {
                            id: 3,
                            title: type === 'Trọn gói' ? 'Giá trị phân phối (VNĐ/ngày):' : '',
                            tag: type === 'Trọn gói' && <div>{type === 'Trọn gói' ? distributionValue : ''}</div>
                        }, {
                            id: 4,
                            title: 'Tình trạng:',
                            tag: <div>{status}</div>
                        }]
                    }, {
                        id: 4,
                        children: [{
                            id: 1,
                            title: 'Tên đơn vị sử dụng:',
                            tag: <div>{companyName}</div>
                        }, {
                            id: 2,
                            title: 'Người đại diện:',
                            tag: <div>{contractFormik.values.fullName}</div>
                        }, {
                            id: 3,
                            title: 'Chức vụ:',
                            tag: <div>{position}</div>
                        }, {
                            id: 4,
                            title: 'Ngày sinh:',
                            tag: <div>{contractFormik.values.dateOfBirth}</div>
                        }, {
                            id: 5,
                            title: 'Quốc tịch:',
                            tag: <div>{contractFormik.values.nationality}</div>
                        }, {
                            id: 6,
                            title: 'Số điện thoại:',
                            tag: <div>{contractFormik.values.phoneNumber}</div>
                        }, {
                            id: 7,
                            title: 'Email:',
                            tag: <div>{contractFormik.values.email}</div>
                        }]
                    }, {
                        id: 5,
                        children: [{
                            id: 1,
                            title: 'Giới tính:',
                            tag: <div>{contractFormik.values.gender}</div>
                        }, {
                            id: 2,
                            title: 'CMND/ CCCD:',
                            tag: <div>{contractFormik.values.idNumber}</div>
                        }, {
                            id: 3,
                            title: 'Ngày cấp:',
                            tag: <div>{contractFormik.values.dateRange}</div>
                        }, {
                            id: 4,
                            title: 'Nơi cấp:',
                            tag: <div>{contractFormik.values.issuedBy}</div>
                        }, {
                            id: 5,
                            title: 'Mã số thuế:',
                            tag: <div>{contractFormik.values.taxCode}</div>
                        }, {
                            id: 6,
                            title: 'Nơi cư trú:',
                            tag: <div>{contractFormik.values.residence}</div>
                        }]
                    }, {
                        id: 6,
                        children: [{
                            id: 1,
                            title: 'Tên đăng nhập:',
                            tag: <div>{contractFormik.values.userName}</div>
                        }, {
                            id: 2,
                            title: 'Mật khẩu:',
                            tag: <div>{contractFormik.values.password}</div>
                        }, {
                            id: 3,
                            title: 'Số tài khoản:',
                            tag: <div>{contractFormik.values.bankNumber}</div>
                        }, {
                            id: 4,
                            title: 'Ngân hàng:',
                            tag: <div>{contractFormik.values.bank}</div>
                        }
                        ]
                    }]
                }
            >
                <div className={cx('form__action')}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => setEdit(false)}
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
        </div >
    );
};

export default EntrustmentContractDetailPage;