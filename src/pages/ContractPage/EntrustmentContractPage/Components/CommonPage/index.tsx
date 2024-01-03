import classNames from "classnames/bind";
import { ReactNode, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { BlockDetail } from "~/components/BlockDetail";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { Upload } from "~/components/Upload";
import { IGlobalConstantsType } from "~/types";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";

import style from '~/sass/EntrustmentContractCommonPage.module.scss';
const cx = classNames.bind(style);

interface CommonPageContractEditProps {
    title: string;
    edit: boolean;
    data: Array<any>;
    pagingData: Array<PagingItemType>;
    formikData: any;
    actionData?: Array<any>;
    children?: ReactNode;
};

export const CommonPageContractEdit = memo(({ title, edit, data, pagingData, formikData, actionData = [], children }: CommonPageContractEditProps) => {
    const navigate = useNavigate();

    const [passwordType, setPasswordType] = useState<boolean>(true);
    const [blockInput1, setBlockDetail1] = useState<Array<any>>([]);
    const [blockInput2, setBlockDetail2] = useState<Array<any>>([]);
    const [blockInput3, setBlockDetail3] = useState<Array<any>>([]);
    const [blockInput4, setBlockDetail4] = useState<Array<any>>([]);
    const [blockInput5, setBlockDetail5] = useState<Array<any>>([]);
    const [nationality, setNationality] = useState<string>(formikData.values.nationality || 'Việt Nam');
    const [visibleComboBox, setVisibleComboBox] = useState<boolean>(false);
    const [country, setCountry] = useState<IGlobalConstantsType>({ id: 1, title: 'Việt Nam' });

    const { type } = formikData.values;

    useEffect(() => {
        setBlockDetail1([
            {
                id: 1,
                title: 'Tên hợp đồng:',
                isRequired: true,
                tag: <Input
                    type='text'
                    name='name'
                    value={formikData.values.name}
                    errorMessage={formikData.errors.name}
                    touched={formikData.touched.name}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('name', true)}
                    onBlur={() => formikData.setFieldTouched('name', false)}
                />
            }, {
                id: 2,
                title: 'Số hợp đồng:',
                isRequired: true,
                tag: <Input
                    type='text'
                    name='code'
                    value={formikData.values.code}
                    errorMessage={formikData.errors.code}
                    touched={formikData.touched.code}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('code', true)}
                    onBlur={() => formikData.setFieldTouched('code', false)}
                />
            }, {
                title: 'Ngày hiệu lực:',
                isRequired: true,
                tag: <Input
                    name='effectiveDate'
                    type='date'
                    value={formikData.values.effectiveDate}
                    errorMessage={formikData.errors.effectiveDate}
                    touched={formikData.touched.effectiveDate}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('effectiveDate', true)}
                    onBlur={() => formikData.setFieldTouched('effectiveDate', false)}
                />
            }, {
                title: 'Ngày hết hạn:',
                isRequired: true,
                tag: <Input
                    name='expirationDate'
                    type='date'
                    value={formikData.values.expirationDate}
                    errorMessage={formikData.errors.expirationDate}
                    touched={formikData.touched.expirationDate}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('expirationDate', true)}
                    onBlur={() => formikData.setFieldTouched('expirationDate', false)}
                />
            }
        ]);

        setBlockDetail3([
            {
                title: 'Giới tính:',
                isRequired: true,
                tag: <div className={cx('gender-group')}>
                    <RadioButton title='Nam' checked={formikData.values.gender !== 'Nữ' ? true : false} onClick={() => formikData.setFieldValue('gender', 'Nam')} />
                    <RadioButton title='Nữ' checked={formikData.values.gender === 'Nữ' ? true : false} onClick={() => formikData.setFieldValue('gender', 'Nữ')} />
                </div>
            }, {
                title: 'CMND/ CCCD:',
                isRequired: true,
                tag: <Input
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
                title: 'Ngày cấp:',
                isRequired: true,
                tag: <Input
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
                title: 'Nơi cấp:',
                isRequired: true,
                tag: <Input
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
                title: 'Mã số thuế:',
                isRequired: true,
                tag: <Input
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
                title: 'Nơi cư trú:',
                isRequired: true,
                tag: <Input
                    name='residence'
                    as='textarea'
                    rows={4}
                    cols={32}
                    value={formikData.values.residence}
                    errorMessage={formikData.errors.residence}
                    touched={formikData.touched.residence}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('residence', true)}
                    onBlur={() => formikData.setFieldTouched('residence', false)}
                    style={{ width: 'auto', height: 'auto', resize: 'none' }}
                />
            }
        ]);
    }, [formikData.values, formikData.errors, formikData.touched]);

    useEffect(() => {
        setBlockDetail2([
            {
                title: 'Tên đơn vị sử dụng:',
                isRequired: true,
                tag: <Input
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
                title: 'Người đại diện:',
                isRequired: true,
                tag: <Input
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
                title: 'Chức vụ:',
                isRequired: true,
                tag: <Input
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
                title: 'Ngày sinh:',
                isRequired: true,
                tag: <Input
                    name='dateOfBirth'
                    type='date'
                    value={formikData.values.dateOfBirth}
                    errorMessage={formikData.errors.dateOfBirth}
                    touched={formikData.touched.dateOfBirth}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('dateOfBirth', true)}
                    onBlur={() => formikData.setFieldTouched('dateOfBirth', false)}
                />
            }, {
                title: 'Quốc tịch:',
                isRequired: true,
                tag: <OptionMenu
                    data={[
                        { id: 1, title: 'Việt Nam' },
                        { id: 2, title: 'Mỹ' },
                        { id: 3, title: 'Anh' }
                    ]}
                    editable={true}
                    border={false}
                    boxSize="extra-large"
                    setState={setCountry}
                    state={country}
                    className={cx('country')}
                />
            }, {
                title: 'Số điện thoại:',
                isRequired: true,
                tag: <Input
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
                title: 'Email:',
                isRequired: true,
                tag: <Input
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
    }, [formikData.values, formikData.errors, formikData.touched, visibleComboBox, nationality]);

    useEffect(() => {
        formikData.setFieldValue('nationality', nationality);
    }, [nationality]);

    useEffect(() => {
        setBlockDetail4([
            {
                title: 'Tên đăng nhập:',
                isRequired: true,
                tag: <Input
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
                title: 'Mật khẩu:',
                isRequired: true,
                tag: <Input
                    name='password'
                    type={passwordType ? 'password' : 'text'}
                    iconRight={images.eye}
                    onIconRightClick={() => setPasswordType(passwordType ? false : true)}
                    value={formikData.values.password}
                    errorMessage={formikData.errors.password}
                    touched={formikData.touched.password}
                    onChange={formikData.handleChange}
                    onFocus={() => formikData.setFieldTouched('password', true)}
                    onBlur={() => formikData.setFieldTouched('password', false)}
                    className={cx("block-detail__password")}
                />
            }, {
                title: 'Số tài khoản:',
                isRequired: true,
                tag: <Input
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
                title: 'Ngân hàng:',
                isRequired: true,
                tag: <Input
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
    }, [formikData.values, formikData.errors, formikData.touched, passwordType]);

    useEffect(() => {
        setBlockDetail5([
            {
                title: 'Giá trị hợp đồng(VNĐ)',
                tag: <Input
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
                title: 'Giá trị phân phối(VNĐ)/ngày',
                tag: <Input
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
    }, [formikData.values, formikData.errors, formikData.touched, type]);

    useEffect(() => {
        if (!edit) return;

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
        <CommonWrapper
            title={title}
            paging={pagingData}
        >
            <form className={cx('content-container')} onSubmit={formikData.handleSubmit}>
                {edit
                    ? <div className={cx('content-edit')}>
                        <div className={cx('content-edit__box')}>
                            <BlockDetail editable={true} data={blockInput1} />
                            <BlockDetail editable={true} data={[{
                                id: 1,
                                title: 'Đính kèm tệp:',
                                isRequired: true,
                                tag: <Upload />
                            }]} />
                            <div className={cx('content__type')}>
                                <p>Loại hợp đồng:</p>
                                <div className={cx('content__type__all')}>
                                    <BlockDetail editable={true} data={[{
                                        id: 1,
                                        tag: <RadioButton
                                            title='Trọn gói'
                                            checked={type === 'Trọn gói' ? true : false}
                                            onClick={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockDetail editable={true} data={blockInput5} />
                                    </div>
                                </div>
                                <div className={cx('content__type__all')}>
                                    <BlockDetail editable={true} data={[{
                                        id: 1,
                                        tag: <RadioButton
                                            title='Lượt phát'
                                            checked={type !== 'Trọn gói' ? true : false}
                                            onClick={() => formikData.setFieldValue('type', type === 'Trọn gói' ? 'Lượt phát' : 'Trọn gói')}
                                            // className={cx('type__all__radio-button')}
                                        />
                                    }]} />
                                    <div className={cx('all__value-input')}>
                                        <BlockDetail editable={true} data={[{
                                            id: 1,
                                            title: 'Giá trị lượt phát(VNĐ)/ngày',
                                            tag: <Input
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
                            <BlockDetail editable={true} data={blockInput2} />
                            <BlockDetail editable={true} data={blockInput3} />
                            <BlockDetail editable={true} data={blockInput4} />
                        </div>
                        {children && children}
                    </div>
                    : <div className={cx('content-information')}>
                        {data.map(item => <BlockDetail key={item.id} data={item.children} />)}
                    </div>
                }
            </form>
            {!edit && <ActionBar visible={true}>
                {actionData.map(action => <ActionBarItem {...action} />)}
            </ActionBar>}
        </CommonWrapper>
    );
});