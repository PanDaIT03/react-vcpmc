import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { Toast } from "~/components/Toast";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { changePasswordDevice, getDeviceList, restoreMemory, updateDevice } from "~/state/thunk/device";
import { IDevice } from "~/types/DeviceType";
import { InputProps } from "~/types/InputType";
import { Dialog } from "~/components/Dialog";

import style from '~/sass/DeviceDetail.module.scss';
import { IGlobalConstantsType } from "~/types";
const cx = classNames.bind(style);

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Danh sách thiết bị',
        to: routes.DevicePage,
        active: true
    }, {
        title: 'Chi tiết thiết bị',
        to: `#`,
        active: false
    }
];

function DeviceDetailPage() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const device = useSelector((state: RootState) => state.device);

    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [deviceInputs, setDeviceInputs] = useState<InputProps[]>([] as InputProps[]);
    const [devicePasswordInputs, setDevicePasswordInputs] = useState<InputProps[]>([] as InputProps[]);

    const { setActive } = useContext(SidebarContext);
    const [isCPassword, setIsCPassword] = useState(true);
    const [isNewPassword, setIsNewPassword] = useState(true);
    const [isCurrentPassword, setIsCurrentPassword] = useState(true);
    const [toastActive, setToastActive] = useState<boolean>(false);
    const [activeDialog, setActiveDialog] = useState<boolean>(false);
    const [activeDialogPassword, setActiveDialogPassword] = useState(false);

    const [title, setTitle] = useState<string>('');
    const [currentAction, setCurrentAction] = useState<string>('');

    const deviceFormik = useFormik({
        initialValues: {
            docId: '',
            SKUID: '',
            expirationDate: '',
            macAddress: '',
            memory: '',
            name: '',
            operatingLocation: '',
            status: '',
            unitsUsed: '',
            userName: '',
            imageURL: '',
            note: '',
            format: '',
            statusDevice: '',
            password: '',
            lastestVersion: [] as string[],
        } as IDevice & {
            statusDevice: string
        },
        validationSchema: Yup.object({
            SKUID: Yup.string().required(),
            macAddress: Yup.string().required(),
            name: Yup.string().required(),
            operatingLocation: Yup.string().required(),
            userName: Yup.string().required()
        }),
        onSubmit: async (values) => {
            await dispatch(updateDevice({
                data: {
                    docId: values.docId,
                    SKUID: values.SKUID,
                    macAddress: values.macAddress,
                    name: values.name,
                    operatingLocation: values.operatingLocation,
                    userName: values.userName,
                    status: values.status
                },
                navigate: () => navigate(routes.DetailPage)
            }));

            handleActiveToast();
            deviceFormik.setErrors(deviceFormik.initialErrors);
            deviceFormik.setTouched(deviceFormik.initialTouched);
        }
    });

    const devicePasswordFormik = useFormik({
        initialValues: {
            docId: '',
            password: '',
        } as IDevice & {
            confirmPassword: string,
            newPassword: string,
            currentPassword: string
        },
        validationSchema: Yup.object({
            confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp'),
            newPassword: Yup.string().required(),
            currentPassword: Yup.string().required().oneOf([deviceFormik.values.password], 'Mật khẩu hiện tại không đúng'),
        }),
        onSubmit: async (values) => {
            await dispatch(changePasswordDevice({
                docId: values.docId,
                password: values.newPassword
            }));

            setActiveDialogPassword(false);

            handleActiveToast();
            deviceFormik.setErrors(deviceFormik.initialErrors);
            deviceFormik.setTouched(deviceFormik.initialTouched);
        }
    });

    useEffect(() => {
        setActive(false);
        setActionbar([
            {
                title: "Chỉnh sửa",
                icon: images.edit,
                onClick: () => {
                    setActiveDialog(true)
                    setCurrentAction('Chỉnh sửa')
                }
            }, {
                title: "Khôi phục mật khẩu",
                icon: images.lock,
                onClick: () => {
                    setActiveDialogPassword(true)
                    setCurrentAction('Khôi phục mật khẩu')
                }
            }, {
                title: "Khôi phục bộ nhớ",
                icon: images.refresh,
                onClick: () => dispatch(restoreMemory({ docId: id || '', memory: `0.00GB/${deviceFormik.values.memory.split('/')[1]}` }))
            }
        ]);

        dispatch(getDeviceList());
    }, []);

    useEffect(() => {
        const deviceDetail = device.devices.find(device => device.docId === id) || {} as IDevice;
        let status: 'Hoạt động' | 'Bị khóa' | 'Ngừng hoạt động' = 'Hoạt động';

        if (deviceDetail.status === 'blocked') status = 'Bị khóa';
        else if (deviceDetail.status === 'activated') status = 'Hoạt động';
        else if (deviceDetail.status === 'deactivated') status = 'Ngừng hoạt động';

        deviceFormik.setValues({
            ...deviceDetail,
            statusDevice: status
        });
        devicePasswordFormik.setFieldValue('id', deviceDetail.docId);
        setTitle(deviceDetail.name);
    }, [device.devices]);

    useEffect(() => {
        setDeviceInputs([
            {
                title: 'Tên thiết bị',
                name: 'name',
                errorMessage: deviceFormik.errors.name,
                value: deviceFormik.values.name,
                touched: deviceFormik.touched.name,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('name', true),
                onBlur: () => deviceFormik.setFieldTouched('name', false),
            }, {
                title: 'SKU/ID',
                name: 'SKUID',
                errorMessage: deviceFormik.errors.SKUID,
                value: deviceFormik.values.SKUID,
                touched: deviceFormik.touched.SKUID,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('SKUID', true),
                onBlur: () => deviceFormik.setFieldTouched('SKUID', false),
            }, {
                title: 'Địa chỉ Mac',
                name: 'macAddress',
                errorMessage: deviceFormik.errors.macAddress,
                value: deviceFormik.values.macAddress,
                touched: deviceFormik.touched.macAddress,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('macAddress', true),
                onBlur: () => deviceFormik.setFieldTouched('macAddress', false),
            }, {
                title: 'Tên đăng nhập',
                name: 'userName',
                errorMessage: deviceFormik.errors.userName,
                value: deviceFormik.values.userName,
                touched: deviceFormik.touched.userName,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('userName', true),
                onBlur: () => deviceFormik.setFieldTouched('userName', false),
            }, {
                title: 'Vị trí',
                name: 'operatingLocation',
                errorMessage: deviceFormik.errors.operatingLocation,
                value: deviceFormik.values.operatingLocation,
                touched: deviceFormik.touched.operatingLocation,
                onChange: deviceFormik.handleChange,
                onFocus: () => deviceFormik.setFieldTouched('operatingLocation', true),
                onBlur: () => deviceFormik.setFieldTouched('operatingLocation', false),
            }
        ]);
    }, [deviceFormik.values, deviceFormik.errors, deviceFormik.touched]);

    useEffect(() => {
        setDevicePasswordInputs([
            {
                title: 'Mật khẩu hiện tại',
                name: 'currentPassword',
                value: devicePasswordFormik.values.currentPassword,
                errorMessage: devicePasswordFormik.errors.currentPassword,
                touched: devicePasswordFormik.touched.currentPassword,
                type: isCurrentPassword ? 'password' : 'text',
                iconRight: images.eye,
                onIconRightClick: () => setIsCurrentPassword(!isCurrentPassword),
                onChange: devicePasswordFormik.handleChange,
                onFocus: () => devicePasswordFormik.setFieldTouched('currentPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('currentPassword', false),
            }, {
                title: 'Mật khẩu mới',
                name: 'newPassword',
                value: devicePasswordFormik.values.newPassword,
                errorMessage: devicePasswordFormik.errors.newPassword,
                touched: devicePasswordFormik.touched.newPassword,
                type: isNewPassword ? 'password' : 'text',
                onChange: devicePasswordFormik.handleChange,
                iconRight: images.eye,
                onIconRightClick: () => setIsNewPassword(!isNewPassword),
                onFocus: () => devicePasswordFormik.setFieldTouched('newPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('newPassword', false),
            }, {
                title: 'Nhập lại mật khẩu mới',
                name: 'confirmPassword',
                value: devicePasswordFormik.values.confirmPassword,
                errorMessage: devicePasswordFormik.errors.confirmPassword,
                touched: devicePasswordFormik.touched.confirmPassword,
                type: isCPassword ? 'password' : 'text',
                onChange: devicePasswordFormik.handleChange,
                iconRight: images.eye,
                onIconRightClick: () => setIsCPassword(!isCPassword),
                onFocus: () => devicePasswordFormik.setFieldTouched('confirmPassword', true),
                onBlur: () => devicePasswordFormik.setFieldTouched('confirmPassword', false),
            }
        ]);
    }, [devicePasswordFormik.values, devicePasswordFormik.errors, devicePasswordFormik.touched, devicePasswordFormik.validateOnChange, isCurrentPassword, isNewPassword, isCPassword]);

    const handleChangeStatus = useCallback(() => {
        deviceFormik.setFieldValue('status', deviceFormik.values.status === 'activated' ? 'deactivated' : 'activated');
    }, [deviceFormik.values.status]);

    const handleActiveToast = () => {
        setToastActive(true);
        setTimeout(() => {
            setToastActive(false);
        }, 1000);
    };

    return (
        <CommonWrapper
            paging={PAGING_ITEMS}
            title={`Thông tin thiết bị - ${title}`}
        >
            <div className={cx('device-detail-container')}>
                <div className={cx('device-detail__info-left')}>
                    <p className={cx('info-title')}>Thông tin thiết bị</p>
                    <img src={deviceFormik.values.imageURL} alt='devicePhoto' />
                    <p className={cx('info-left__status', deviceFormik.values.status)}>{deviceFormik.values.statusDevice}</p>
                    <div className={cx('info-left__note')}>
                        <p>Ghi chú:</p>
                        <p>{deviceFormik.values.note}</p>
                    </div>
                </div>
                <div className={cx("content")}>
                    <div className={cx('device-detail__info-middle')}>
                        <p className={cx('info-title')}>{deviceFormik.values.name}</p>
                        <div className={cx('info-content')}>
                            <div className={cx('info-content__left')}>
                                <p>SKU/ID:</p>
                                <p>Địa chỉ Mac:</p>
                                <p>Tên đăng nhập:</p>
                                <p>Định dạng:</p>
                                <p>Vị trí:</p>
                                <p>Thời hạn bảo hành:</p>
                                <p>Trạng thái thiết bị:</p>
                            </div>
                            <div className={cx('content-right')}>
                                <p>{deviceFormik.values.SKUID}</p>
                                <p>{deviceFormik.values.macAddress}</p>
                                <p>{deviceFormik.values.userName}</p>
                                <p>{deviceFormik.values.format}</p>
                                <p>{deviceFormik.values.operatingLocation}</p>
                                <p>{deviceFormik.values.SKUID}</p>
                                <p>{deviceFormik.values.status}</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('device-detail__info-right')}>
                        <div className={cx('info-right__version')}>
                            <p className={cx('info-title')}>Thông tin phiên bản</p>
                            <div className={cx('version__content')}>
                                <div className={cx('version__content__left')}>
                                    <p>Phiên bản cũ nhất:</p>
                                </div>
                                <div className={cx('content-right')}>
                                    {deviceFormik.values.lastestVersion && deviceFormik.values.lastestVersion.map((version) => <p key={version}>{version}</p>)}
                                </div>
                            </div>
                        </div>
                        <div className={cx('info-right__memory')}>
                            <p className={cx('info-title')}>Dung lượng bộ nhớ</p>
                            <div className={cx('memory__content')}>
                                <div className={cx('memory__content__left')}>
                                    <p>Dung lượng</p>
                                    <p>Còn trống</p>
                                </div>
                                <div className={cx('content-right')}>
                                    <p>{deviceFormik.values.memory !== '' && typeof deviceFormik.values.memory !== 'undefined'
                                        && deviceFormik.values.memory.split('/')[1]}</p>
                                    <p>{deviceFormik.values.memory !== '' && typeof deviceFormik.values.memory !== 'undefined'
                                        && (parseFloat(deviceFormik.values.memory.split('/')[1]) - parseFloat(deviceFormik.values.memory.split('/')[0].split('.')[0]))}GB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                visible={activeDialog}
                className={cx("edit-dialog")}
            >
                <Form
                    title='Chỉnh sửa thông tin thiết bị'
                    className={cx('device__form-edit__device')}
                    handleFormSubmit={deviceFormik.handleSubmit}
                >
                    <div className={cx('device-detail__edit__inputs')}>
                        {deviceInputs.map((input, index) => <Input key={index} type='text' {...input} isRequire={true} />)}
                        <div className={cx('device-detail__edit__inputs__status')}>
                            <p>Trạng thái thiết bị:</p>
                            <div className={cx('inputs__status__checkbox')}>
                                <RadioButton checked={deviceFormik.values.status === 'activated'} onClick={handleChangeStatus} title="Đã kích hoạt" />
                                <RadioButton checked={deviceFormik.values.status !== 'activated'} onClick={handleChangeStatus} title="Ngưng kích hoạt" />
                            </div>
                        </div>
                    </div>
                    <div className={cx('device-detail__edit__actions')}>
                        <Button
                            primary
                            value="Hủy"
                            onClick={() => setActiveDialog(false)} />
                        <Button primary fill value="Lưu" buttonType="submit" />
                    </div>
                </Form>
            </Dialog>
            <Dialog
                visible={activeDialogPassword}
                className={cx("edit-dialog")}
            >
                <Form
                    title='Chỉnh sửa mật khẩu thiết bị'
                    className={cx('device__form-edit__password')}
                    handleFormSubmit={devicePasswordFormik.handleSubmit}
                >
                    <div className={cx('device-detail__edit__inputs')}>
                        {devicePasswordInputs.map((input, index) => <Input key={index} type='text' {...input} isRequire={true} />)}
                    </div>
                    <div className={cx('device-detail__edit__actions')}>
                        <Button primary value="Hủy" onClick={() => setActiveDialogPassword(false)} />
                        <Button primary fill value="Lưu" buttonType="submit" />
                    </div>
                </Form>
            </Dialog>
            <ActionBar data={actionbar} />
            <Loading loading={device.loading} />
            <Toast message="Đổi mật khẩu thành công!" visible={toastActive} />
        </CommonWrapper>
    );
};

export default DeviceDetailPage;