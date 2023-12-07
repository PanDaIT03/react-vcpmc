import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useState, useCallback } from "react";

import { images } from "~/assets";
import { PagingItemType } from "~/components/Paging";
import { BlockInfo, BlockInput } from "~/components/Block";
// import { ActionDataType } from "~/components/Action";
import { Input } from "~/components/Input";
import { RadioButton } from "~/components/RadioButton";
import { Upload } from "~/components/Upload";
import { OptionMenu } from "~/components/OptionMenu";
import { Contract } from "~/components/Contract";
import { VALIDITY_CONTRACT_ITEMS } from "~/constants";

import styles from '~/sass/ContractEdit.module.scss';
const cx = classNames.bind(styles);

type ContractEditPageProps = {
    title: string;
    edit: boolean;
    data: Array<any>;
    paging: Array<PagingItemType>;
    formikData: any;
    // actionData?: Array<ActionDataType>;
    children?: ReactNode;
};

function ContractEditPage({
    title,
    edit,
    data,
    paging,
    formikData,
    // actionData = [],
    children
}: ContractEditPageProps) {
    const [isPassword, setIsPassword] = useState(true);
    const [visibleComboBox, setVisibleComboBox] = useState(false);
    const { type } = formikData.values;

    const [blockInput1, setBlockInput1] = useState<Array<any>>([]);
    const [blockInput2, setBlockInput2] = useState<Array<any>>([]);
    const [blockInput3, setBlockInput3] = useState<Array<any>>([]);
    const [blockInput4, setBlockInput4] = useState<Array<any>>([]);
    const [blockInput5, setBlockInput5] = useState<Array<any>>([]);
    const [nationality, setNationality] = useState<Array<any>>(formikData.values.nationality || 'Việt Nam');

    const handleClick = useCallback((visible: boolean) => {
        setVisibleComboBox(visible);
    }, []);

    const handleItemClick = useCallback((item: any) => {
        setNationality(item.title);
    }, []);

    useEffect(() => {
        setBlockInput1([
            {
                fieldName: 'Số hợp đồng:',
                input: <Input
                    type='text'
                    name='code'
                    size="custom"
                    value={formikData.values.code}
                    errorMessage={formikData.errors.code}
                    touched={formikData.touched.code}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('code', true)}
                    onBlur={() => formikData.setFieldTouched('code', false)}
                />
            }, {
                fieldName: 'Tên hợp đồng:',
                input: <Input
                    type='text'
                    name='name'
                    size="custom"
                    value={formikData.values.name}
                    errorMessage={formikData.errors.name}
                    touched={formikData.touched.name}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('name', true)}
                    onBlur={() => formikData.setFieldTouched('name', false)}
                />
            }, {
                fieldName: 'Ngày hiệu lực:',
                input: <Input
                    name='effectiveDate'
                    type='date'
                    size="extra-small"
                    value={formikData.values.effectiveDate}
                    errorMessage={formikData.errors.effectiveDate}
                    touched={formikData.touched.effectiveDate}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('effectiveDate', true)}
                    onBlur={() => formikData.setFieldTouched('effectiveDate', false)}
                />
            }, {
                fieldName: 'Ngày hết hạn:',
                input: <Input
                    name='expirationDate'
                    type='date'
                    size="extra-small"
                    value={formikData.values.expirationDate}
                    errorMessage={formikData.errors.expirationDate}
                    touched={formikData.touched.expirationDate}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('expirationDate', true)}
                    onBlur={() => formikData.setFieldTouched('expirationDate', false)}
                />
            }, {
                fieldName: 'Tình trạng:',
                input: <OptionMenu
                    data={[{
                        id: 1,
                        title: formikData.values.status
                    }]}
                    boxSize="extra-large"
                    editable={false}
                    className={cx("status")}
                />
            }
        ]);

        setBlockInput3([
            {
                fieldName: 'Giới tính:',
                isRequired: true,
                input: <div className={cx('gender-group')}>
                    <RadioButton title='Nam' checked={formikData.values.gender !== 'Nữ' ? true : false} onChange={() => formikData.setFieldValue('gender', 'Nam')} />
                    <RadioButton title='Nữ' checked={formikData.values.gender === 'Nữ' ? true : false} onChange={() => formikData.setFieldValue('gender', 'Nữ')} />
                </div>
            }, {
                fieldName: 'CMND/ CCCD:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='idNumber'
                    value={formikData.values.idNumber}
                    errorMessage={formikData.errors.idNumber}
                    touched={formikData.touched.idNumber}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('idNumber', true)}
                    onBlur={() => formikData.setFieldTouched('idNumber', false)}
                />
            }, {
                fieldName: 'Ngày cấp:',
                isRequired: true,
                input: <Input
                    name='dateRange'
                    type='date'
                    value={formikData.values.dateRange}
                    errorMessage={formikData.errors.dateRange}
                    touched={formikData.touched.dateRange}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('dateRange', true)}
                    onBlur={() => formikData.setFieldTouched('dateRange', false)}
                />
            }, {
                fieldName: 'Nơi cấp:',
                isRequired: true,
                input: <Input
                    type='text'
                    name={'issuedBy'}
                    value={formikData.values.issuedBy}
                    errorMessage={formikData.errors.issuedBy}
                    touched={formikData.touched.issuedBy}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('issuedBy', true)}
                    onBlur={() => formikData.setFieldTouched('issuedBy', false)}
                />
            }, {
                fieldName: 'Mã số thuế:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='taxCode'
                    value={formikData.values.taxCode}
                    errorMessage={formikData.errors.taxCode}
                    touched={formikData.touched.taxCode}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('taxCode', true)}
                    onBlur={() => formikData.setFieldTouched('taxCode', false)}
                />
            }, {
                fieldName: 'Nơi cư trú:',
                isRequired: true,
                input: <Input
                    name='residence'
                    type='textarea'
                    value={formikData.values.residence}
                    errorMessage={formikData.errors.residence}
                    touched={formikData.touched.residence}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('residence', true)}
                    onBlur={() => formikData.setFieldTouched('residence', false)}
                />
            }
        ]);
    }, [formikData, formikData.values]);

    useEffect(() => {
        setBlockInput2([
            {
                fieldName: 'Tên đơn vị sử dụng:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='companyName'
                    value={formikData.values.companyName}
                    errorMessage={formikData.errors.companyName}
                    touched={formikData.touched.companyName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('companyName', true)}
                    onBlur={() => formikData.setFieldTouched('companyName', false)}
                />
            }, {
                fieldName: 'Người đại diện:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='fullName'
                    value={formikData.values.fullName}
                    errorMessage={formikData.errors.fullName}
                    touched={formikData.touched.fullName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('fullName', true)}
                    onBlur={() => formikData.setFieldTouched('fullName', false)}
                />
            }, {
                fieldName: 'Chức vụ:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='position'
                    value={formikData.values.position}
                    errorMessage={formikData.errors.position}
                    touched={formikData.touched.position}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('position', true)}
                    onBlur={() => formikData.setFieldTouched('position', false)}
                />
            }, {
                fieldName: 'Ngày sinh:',
                isRequired: true,
                input: <Input
                    name='dateOfBirth'
                    type='date'
                    value={formikData.values.dateOfBirth}
                    errorMessage={formikData.errors.dateOfBirth}
                    touched={formikData.touched.dateOfBirth}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('dateOfBirth', true)}
                    onBlur={() => formikData.setFieldTouched('dateOfBirth', false)}
                />
            },
            // {
            //     fieldName: 'Quốc tịch:',
            //     isRequired: true,
            //     input: <OptionMenu
            //         data={[
            //             { title: 'Việt Nam' },
            //             { title: 'Mỹ' },
            //             { title: 'Anh' }
            //         ]}
            //         active={nationality}
            //         className={cx('nationality-combo-box')}
            //         visible={visibleComboBox}
            //         onItemClick={handleItemClick}
            //         onClick={() => handleClick(!visibleComboBox)}
            //     />
            // },
            {
                fieldName: 'Số điện thoại:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='phoneNumber'
                    value={formikData.values.phoneNumber}
                    errorMessage={formikData.errors.phoneNumber}
                    touched={formikData.touched.phoneNumber}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('phoneNumber', true)}
                    onBlur={() => formikData.setFieldTouched('phoneNumber', false)}
                />
            }, {
                fieldName: 'Email:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='email'
                    value={formikData.values.email}
                    errorMessage={formikData.errors.email}
                    touched={formikData.touched.email}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('email', true)}
                    onBlur={() => formikData.setFieldTouched('email', false)}
                />
            }
        ]);
    }, [formikData, formikData.values, visibleComboBox, nationality]);

    useEffect(() => {
        formikData.setFieldValue('nationality', nationality);
    }, [nationality]);

    useEffect(() => {
        setBlockInput4([
            {
                fieldName: 'Tên đăng nhập:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='userName'
                    value={formikData.values.userName}
                    errorMessage={formikData.errors.userName}
                    touched={formikData.touched.userName}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('userName', true)}
                    onBlur={() => formikData.setFieldTouched('userName', false)}
                />
            }, {
                fieldName: 'Mật khẩu:',
                isRequired: true,
                input: <Input
                    name='password'
                    type={isPassword ? "password" : "text"}
                    iconRight={images.eye}
                    value={formikData.values.password}
                    errorMessage={formikData.errors.password}
                    touched={formikData.touched.password}
                    onIconRightClick={() => setIsPassword(!isPassword)}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('password', true)}
                    onBlur={() => formikData.setFieldTouched('password', false)}
                />
            }, {
                fieldName: 'Số tài khoản:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='bankNumber'
                    value={formikData.values.bankNumber}
                    errorMessage={formikData.errors.bankNumber}
                    touched={formikData.touched.bankNumber}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('bankNumber', true)}
                    onBlur={() => formikData.setFieldTouched('bankNumber', false)}
                />
            }, {
                fieldName: 'Ngân hàng:',
                isRequired: true,
                input: <Input
                    type='text'
                    name='bank'
                    value={formikData.values.bank}
                    errorMessage={formikData.errors.bank}
                    touched={formikData.touched.bank}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('bank', true)}
                    onBlur={() => formikData.setFieldTouched('bank', false)}
                />
            }
        ]);
    }, [formikData, formikData.values, isPassword]);

    useEffect(() => {
        setBlockInput5([
            {
                fieldName: 'Giá trị hợp đồng(VNĐ)',
                input: <Input
                    type='text'
                    name='value'
                    readOnly={type === 'Trọn gói' ? false : true}
                    value={type === 'Trọn gói' ? formikData.values.value : ''}
                    errorMessage={formikData.errors.value}
                    touched={formikData.touched.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formikData.setFieldValue('value', e.target.value);
                        formikData.setFieldValue('distributionValue', e.target.value);
                    }}
                    onFocus={() => formikData.setFieldTouched('value', true)}
                    onBlur={() => formikData.setFieldTouched('value', false)}
                />
            }, {
                fieldName: 'Giá trị phân phối(VNĐ)/ngày',
                input: <Input
                    type='text'
                    name='distributionValue'
                    readOnly={true}
                    value={type === 'Trọn gói' ? formikData.values.value : ''}
                    errorMessage={formikData.errors.distributionValue}
                    touched={formikData.touched.distributionValue}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('distributionValue', true)}
                    onBlur={() => formikData.setFieldTouched('distributionValue', false)}
                />
            }
        ]);
    }, [formikData, formikData.values, type]);

    useEffect(() => {
        if (type === 'Trọn gói') {
            formikData.setFieldValue('playValue', 0);
            formikData.setFieldValue('distributionValue', '');
            formikData.setFieldValue('value', '');
            return;
        }

        formikData.setFieldValue('playValue', '');
        formikData.setFieldValue('distributionValue', 0);
        formikData.setFieldValue('value', 0);
    }, [formikData.values.type]);

    return (
        <Contract
            title={title}
            paging={paging}
        // actionData={!edit ? actionData : []}
        >
            <form className={cx('content-container')} onSubmit={formikData.handleSubmit}>
                {edit
                    ? <div className={cx('content-edit')}>
                        <div className={cx('content-edit__box')}>
                            <BlockInput data={blockInput1} />
                            <BlockInput data={[{
                                fieldName: 'Đính kèm tệp:',
                                isRequired: true,
                                input: <Upload />
                            }]} />
                            <div className={cx('content__type')}>
                                <p>Loại hợp đồng:</p>
                                <div className={cx('content__type__all')}>
                                    <BlockInput data={[{
                                        input: <RadioButton
                                            title='Trọn gói'
                                            checked={type === 'Trọn gói' ? true : false}
                                            onChange={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockInput data={blockInput5} />
                                    </div>
                                </div>
                                <div className={cx('content__type__all')}>
                                    <BlockInput data={[{
                                        input: <RadioButton
                                            title='Lượt phát'
                                            checked={type !== 'Trọn gói' ? true : false}
                                            onChange={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockInput data={[{
                                            fieldName: 'Giá trị lượt phát(VNĐ)/ngày',
                                            input: <Input
                                                type='text'
                                                name='playValue'
                                                readOnly={type === 'Trọn gói' ? true : false}
                                                value={type === 'Trọn gói' ? '' : formikData.values.playValue}
                                                errorMessage={formikData.errors.playValue}
                                                touched={formikData.touched.playValue}
                                                onChange={formikData.handleChange}
                                                onFocus={() => formikData.setFieldTouched('playValue', true)}
                                                onBlur={() => formikData.setFieldTouched('playValue', false)}
                                            />
                                        }]} />
                                    </div>
                                </div>
                            </div>
                            <BlockInput data={blockInput2} />
                            <BlockInput data={blockInput3} />
                            <BlockInput data={blockInput4} />
                        </div>
                        {children && children}
                    </div>
                    : <BlockInfo data={data} />
                }
            </form>
        </Contract>
    );
};

export default memo(ContractEditPage);