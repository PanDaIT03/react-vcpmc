import classNames from "classnames/bind";
import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";
import { CB_NATIONALITY, VALIDITY_CONTRACT_ITEMS, formatDateYMD } from "~/constants";
import { Input } from "../Input";
import { OptionMenu } from "../OptionMenu";
import { images } from "~/assets";
import { ContractEdit } from "../ContractEdit";
import { BlockDetail } from "../BlockDetail";
import { Loading } from "../Loading";
import { IContract, IGlobalConstantsType, IUserDetail } from "~/types";

import style from '~/sass/ActionContract.module.scss';
const cx = classNames.bind(style);

interface ActionContractProps {
    formik: any
    contractDetail?: IContract & IUserDetail
    loading: boolean
    type?: "edit" | "detail" | "add"
    className?: string
};

const initState = {
    id: 0,
    title: ""
};

export const ActionContract = memo(({
    formik,
    contractDetail,
    loading,
    type = "detail",
    className,
}: ActionContractProps) => {
    if (!className) className = "";
    const isEdit = type !== "detail"

    const classes = cx('wrapper', {
        [className]: className
    });

    const navigate = useNavigate();

    const [national, setNational] = useState<IGlobalConstantsType>(initState);
    const [isPassword, setIsPassword] = useState(true);

    const [block1, setBlock1] = useState<IGlobalConstantsType[]>([]);
    const [fileAttach, setFileAttach] = useState<IGlobalConstantsType[]>([]);
    const [copyRight, setCopyRight] = useState<IGlobalConstantsType[]>([]);
    const [block4, setBlock4] = useState<IGlobalConstantsType[]>([]);
    const [block5, setBlock5] = useState<IGlobalConstantsType[]>([]);
    const [block6, setBlock6] = useState<IGlobalConstantsType[]>([]);

    const {
        values,
        touched,
        errors,
        setFieldTouched,
        handleChange,
        handleSubmit,
        setValues,
        setFieldValue } = formik;

    const { contractCode, customer, authorizingLegalEntity, effectiveDate, expirationDate,
        status, fullName, dateOfBirth, gender, phoneNumber, idNumber, dateRange,
        issuedBy, taxCode, residence, email, userName, password, bankNumber, bank } = values;

    useEffect(() => {
        if (type === "edit" && contractDetail && Object.keys(contractDetail).length > 0) {
            setValues({
                contractCode: contractDetail.contractCode || "",
                customer: contractDetail.customer || "",
                authorizingLegalEntity: contractDetail.authorizingLegalEntity || "Cá nhân",
                effectiveDate: formatDateYMD(contractDetail.effectiveDate) || "",
                expirationDate: formatDateYMD(contractDetail.expirationDate) || "",
                status: contractDetail.status || "",
                fullName: contractDetail.firstName + " " + contractDetail.lastName || "",
                dateOfBirth: formatDateYMD(contractDetail.dateOfBirth) || "",
                gender: contractDetail.gender || "",
                nationality: contractDetail.nationality || "",
                phoneNumber: contractDetail.phoneNumber || "",
                idNumber: contractDetail.idNumber || "",
                dateRange: formatDateYMD(contractDetail.dateRange) || "",
                issuedBy: contractDetail.issuedBy || "",
                taxCode: contractDetail.taxCode || "",
                residence: contractDetail.residence || "",
                bank: contractDetail.bank || "",
                bankNumber: contractDetail.bankNumber || "",
                email: contractDetail.email || "",
                userName: contractDetail.userName || "",
                password: contractDetail.password || ""
            });
        };
    }, [contractDetail]);

    useEffect(() => {
        setBlock1([
            {
                id: 1,
                title: 'Số hợp đồng',
                tag: isEdit
                    ? <Input
                        id="contractCode"
                        type='text'
                        name='contractCode'
                        size="small-pl"
                        value={contractCode}
                        errorMessage={errors.contractCode}
                        touched={touched.contractCode}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('contractCode', true)}
                        onBlur={() => setFieldTouched('contractCode', false)}
                    />
                    : <div>{contractDetail?.contractCode}</div>
            }, {
                id: 2,
                title: 'Tên hợp đồng',
                tag: isEdit
                    ? <Input
                        id="customer"
                        type='text'
                        name='customer'
                        size="small-pl"
                        value={customer}
                        errorMessage={errors.customer}
                        touched={touched.customer}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('customer', true)}
                        onBlur={() => setFieldTouched('customer', false)}
                    />
                    : <div>{contractDetail?.customer}</div>
            }, {
                id: 3,
                title: 'Ngày hiệu lực',
                tag: isEdit
                    ? <Input
                        id="effectiveDate"
                        type='date'
                        name='effectiveDate'
                        size="extra-small"
                        value={effectiveDate}
                        errorMessage={errors.effectiveDate}
                        touched={touched.effectiveDate}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('effectiveDate', true)}
                        onBlur={() => setFieldTouched('effectiveDate', false)}
                    />
                    : <div>{contractDetail?.effectiveDate}</div>
            }, {
                id: 4,
                title: 'Ngày hết hạn',
                tag: isEdit
                    ? <Input
                        id="expirationDate"
                        type='date'
                        name='expirationDate'
                        size="extra-small"
                        value={expirationDate}
                        errorMessage={errors.expirationDate}
                        touched={touched.expirationDate}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('expirationDate', true)}
                        onBlur={() => setFieldTouched('expirationDate', false)}
                    />
                    : <div>{contractDetail?.expirationDate}</div>
            }, {
                id: 5,
                title: 'Tình trạng',
                tag: isEdit
                    ? <OptionMenu
                        data={[
                            {
                                id: 1,
                                title: status,
                            }
                        ]}
                        editable={false}
                        border={false}
                        boxSize="extra-large"
                    />
                    : <>
                        {VALIDITY_CONTRACT_ITEMS.map(item => {
                            const isItem = item.title === contractDetail?.status

                            return (
                                <React.Fragment key={item.id}>
                                    {isItem
                                        && <div className={cx("contract-validity")}>
                                            <img src={`${item.icon}`} alt="icon" />
                                            <div>{item.title}</div>
                                        </div>}
                                </React.Fragment>
                            );
                        })}
                    </>
            }
        ]);

        setFileAttach([
            {
                id: 1,
                title: "Đính kèm tệp",
                value: [
                    {
                        id: 1,
                        icon: images.iconFileWord,
                        title: "hetthuongcannho.doc"
                    },
                    {
                        id: 2,
                        icon: images.iconFile,
                        title: "hetthuongcannho.doc"
                    }
                ]
            }
        ]);

        setCopyRight([
            {
                id: 1,
                title: "Quyền tác giả",
                tag: <div>0%</div>
            }, {
                id: 2,
                title: "Quyền liên quan",
                tag: <div></div>
            }, {
                id: 3,
                title: "Quyền của người biểu diễn",
                tag: <div>50%</div>,
                isActive: true
            }, {
                id: 4,
                title: "Quyền của nhà sản xuất: (Bản ghi/video)",
                tag: <div>50%</div>,
                isActive: true
            }
        ]);

        setBlock4([
            {
                id: 1,
                title: 'Pháp nhân ủy quyền',
                tag: isEdit
                    ? "radio"
                    : <div>{contractDetail?.authorizingLegalEntity}</div>,
                radioTitle: "Cá nhân, Tổ chức",
                isChecked: authorizingLegalEntity === "Cá nhân",
                setState: () => setFieldValue("authorizingLegalEntity", authorizingLegalEntity === "Cá nhân" ? "Tổ chúc" : "Cá nhân")
            }, {
                id: 2,
                title: 'Tên người uỷ quyền',
                tag: isEdit
                    ? <Input
                        id="fullName"
                        type='text'
                        name='fullName'
                        size="small-pl"
                        value={fullName}
                        errorMessage={errors.fullName}
                        touched={touched.fullName}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('fullName', true)}
                        onBlur={() => setFieldTouched('fullName', false)}
                    />
                    : <div>{contractDetail?.firstName + " " + contractDetail?.lastName}</div>
            }, {
                id: 3,
                title: 'Ngày sinh',
                tag: isEdit
                    ? <Input
                        id="dateOfBirth"
                        type='date'
                        name='dateOfBirth'
                        size="extra-small"
                        value={dateOfBirth}
                        errorMessage={errors.dateOfBirth}
                        touched={touched.dateOfBirth}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('dateOfBirth', true)}
                        onBlur={() => setFieldTouched('dateOfBirth', false)}
                    />
                    : <div>{contractDetail?.dateOfBirth}</div>
            }, {
                id: 4,
                title: 'Giới tính',
                tag: isEdit
                    ? "radio"
                    : <div>{contractDetail?.gender}</div>,
                radioTitle: "Nam, Nữ",
                isChecked: gender ? gender.toLowerCase() === "nam" : false,
                setState: () => setFieldValue("gender", gender && gender.toLowerCase() === "nam" ? "Nữ" : "Nam")
            }, {
                id: 5,
                title: 'Quốc tịch',
                tag: isEdit
                    ? <OptionMenu
                        data={CB_NATIONALITY}
                        border={false}
                        boxSize="large"
                        setState={setNational}
                    />
                    : <div>{contractDetail?.nationality}</div>
            }, {
                id: 6,
                title: 'Số điện thoại',
                tag: isEdit
                    ? <Input
                        id="phoneNumber"
                        type='text'
                        name='phoneNumber'
                        size="small-pl"
                        value={phoneNumber}
                        errorMessage={errors.phoneNumber}
                        touched={touched.phoneNumber}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('phoneNumber', true)}
                        onBlur={() => setFieldTouched('phoneNumber', false)}
                    />
                    : <div>{contractDetail?.phoneNumber}</div>
            }
        ]);

        setBlock5([
            {
                id: 1,
                title: 'CMND/ CCCD',
                tag: isEdit
                    ? <Input
                        id="idNumber"
                        type='text'
                        name='idNumber'
                        size="extra-small"
                        value={idNumber}
                        errorMessage={errors.idNumber}
                        touched={touched.idNumber}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('idNumber', true)}
                        onBlur={() => setFieldTouched('idNumber', false)}
                    />
                    : <div>{contractDetail?.idNumber}</div>
            }, {
                id: 2,
                title: 'Ngày cấp',
                tag: isEdit
                    ? <Input
                        id="dateRange"
                        type='date'
                        name='dateRange'
                        size="extra-small"
                        value={dateRange}
                        errorMessage={errors.dateRange}
                        touched={touched.dateRange}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('dateRange', true)}
                        onBlur={() => setFieldTouched('dateRange', false)}
                    />
                    : <div>{contractDetail?.dateRange}</div>
            }, {
                id: 3,
                title: 'Nơi cấp:',
                tag: isEdit
                    ? <Input
                        id="issuedBy"
                        type='text'
                        name='issuedBy'
                        size="small-pl"
                        value={issuedBy}
                        errorMessage={errors.issuedBy}
                        touched={touched.issuedBy}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('issuedBy', true)}
                        onBlur={() => setFieldTouched('issuedBy', false)}
                    />
                    : <div>{contractDetail?.issuedBy}</div>
            }, {
                id: 4,
                title: 'Mã số thuế',
                tag: isEdit
                    ? <Input
                        id="me"
                        type='text'
                        name='taxCode'
                        size="small-pl"
                        className={cx("tax")}
                        value={taxCode}
                        errorMessage={errors.taxCode}
                        touched={touched.taxCode}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('taxCode', true)}
                        onBlur={() => setFieldTouched('taxCode', false)}
                    />
                    : <div>{contractDetail?.taxCode}</div>
            }, {
                id: 5,
                title: 'Nơi cư trú',
                tag: isEdit
                    ? <div className={cx("residence")}>
                        <Input
                            id="mall"
                            as="textarea"
                            type='text'
                            name='residence'
                            size="small"
                            value={residence}
                            errorMessage={errors.residence}
                            touched={touched.residence}
                            onChange={handleChange}
                            onFocus={() => setFieldTouched('residence', true)}
                            onBlur={() => setFieldTouched('residence', false)}
                        />
                    </div>
                    : <div>{contractDetail?.residence}</div>
            }
        ]);

        setBlock6([
            {
                id: 1,
                title: 'Email',
                tag: isEdit
                    ? <Input
                        id="email"
                        type='text'
                        name='email'
                        size="small"
                        value={email}
                        errorMessage={errors.email}
                        touched={touched.email}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('email', true)}
                        onBlur={() => setFieldTouched('email', false)}
                    />
                    : <div>{contractDetail?.email}</div>
            }, {
                id: 2,
                title: 'Tên đăng nhập',
                tag: isEdit
                    ? <Input
                        id="userName"
                        type='text'
                        name='userName'
                        size="small"
                        value={userName}
                        errorMessage={errors.userName}
                        touched={touched.userName}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('userName', true)}
                        onBlur={() => setFieldTouched('userName', false)}
                    />
                    : <div>{contractDetail?.userName}</div>
            }, {
                id: 3,
                title: 'Mật khẩu',
                tag: isEdit
                    ? <Input
                        id="password"
                        type={isPassword ? 'password' : 'text'}
                        name='password'
                        size="small"
                        value={password}
                        iconRight={images.eye}
                        errorMessage={errors.password}
                        touched={touched.password}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('password', true)}
                        onBlur={() => setFieldTouched('password', false)}
                        onIconRightClick={() => setIsPassword(!isPassword)}
                    />
                    : <div>{contractDetail?.password}</div>
            }, {
                id: 4,
                title: 'Số tài khoản',
                tag: isEdit
                    ? <Input
                        id="bankNumber"
                        type='text'
                        name='bankNumber'
                        size="small"
                        value={bankNumber}
                        errorMessage={errors.bankNumber}
                        touched={touched.bankNumber}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('bankNumber', true)}
                        onBlur={() => setFieldTouched('bankNumber', false)}
                    />
                    : <div>{contractDetail?.bankNumber}</div>
            }, {
                id: 5,
                title: 'Ngân hàng',
                tag: isEdit
                    ? <Input
                        id="bank"
                        type='text'
                        name='bank'
                        size="small"
                        value={bank}
                        errorMessage={errors.bank}
                        touched={touched.bank}
                        onChange={handleChange}
                        onFocus={() => setFieldTouched('bank', true)}
                        onBlur={() => setFieldTouched('bank', false)}
                    />
                    : <div>{contractDetail?.bank}</div>
            }
        ]);
    }, [values, errors, touched, isPassword, contractDetail]);

    useEffect(() => {
        setFieldValue("nationality", national.title);
    }, [national]);

    return (
        <div className={classes}>
            <ContractEdit
                titleBottom="Thông tin pháp nhân uỷ quyền"
                topData={[
                    {
                        value: <BlockDetail
                            data={block1}
                            editable
                            maxWidth="custom"
                        />
                    }, {
                        value: <BlockDetail data={fileAttach} upload={type !== "detail"} />
                    }, {
                        value: <BlockDetail
                            title="Mức nhuận bút"
                            className={cx("author")}
                            data={copyRight}
                            icon={images.infoCircle}
                        />
                    }
                ]}
                bottomData={[
                    {
                        value: <BlockDetail
                            className={cx("author")}
                            data={block4}
                            editable
                            maxWidth="mw-medium"
                        />
                    }, {
                        value: <BlockDetail
                            data={block5}
                            editable
                            maxWidth="mw-medium"
                        />
                    }, {
                        value: <BlockDetail
                            data={block6}
                            editable
                            maxWidth="mw-medium"
                        />
                    }
                ]}
            />
            {isEdit
                && <div className={cx("actions")}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => navigate(`/contract-management/detail/${contractDetail?.contractCode}`)}
                    />
                    <Button
                        primary
                        size="large"
                        fill
                        value="Lưu"
                        buttonType="submit"
                        onClick={() => handleSubmit()}
                    />
                </div>}
            <Loading loading={loading} />
        </div>
    );
});