import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import Button from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Dialog } from "~/components/Dialog";
import { Filter } from "~/components/Filter";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { IOptionMenu } from "~/components/OptionMenu";
import { Table } from "~/components/Table";
import { CB_ACCOUNT_GROUP } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { changeStatusDevice, deleteDevices, getDeviceList } from "~/state/thunk/device";
import { IGlobalConstantsType } from "~/types";
import { IDevice } from "~/types/DeviceType";

import style from '~/sass/Device.module.scss';
const cx = classNames.bind(style);

const CB_SHOW_COLUNMS: IGlobalConstantsType[] = [{
    id: 1,
    title: 'Ẩn hiện cột'
}];

const initialState: IGlobalConstantsType = {
    id: 1,
    title: 'Tất cả'
};

function DevicePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { devices, loading } = useSelector((state: RootState) => state.device);

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [activeConfirmDialog, setActiveConfirmDialog] = useState<boolean>(false);

    const [searchValue, setSearchValue] = useState('');
    const [statusDevice, setStatusDevice] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState('8');
    const [power, setPower] = useState<IGlobalConstantsType>({
        id: 1,
        title: "Kích hoạt thiết bị",
        isActive: true
    });
    const [lock, setLock] = useState<IGlobalConstantsType>({
        id: 1,
        title: "Mở thiết bị",
        isActive: true
    });

    const [filter, setFilter] = useState<IOptionMenu[]>([]);
    const [headerColumn, setHeaderColumn] = useState<string[]>([]);
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [search, setSearch] = useState<Pick<IGlobalConstantsType, "tag">>({});
    const [searchResult, setSearchResult] = useState<IDevice[]>([] as IDevice[]);
    const [currentItems, setCurrentItems] = useState<IDevice[]>([] as IDevice[]);
    const [itemsChosen, setItemsChosen] = useState<IDevice[]>([] as IDevice[]);
    const [accountGroup, setAccountGroup] = useState<IGlobalConstantsType>(initialState);

    const deviceFormik = useFormik({
        initialValues: {
            ids: [] as Array<Pick<IDevice, 'docId'>>
        },
        onSubmit: () => {
            setActiveConfirmDialog(false);
            dispatch(deleteDevices(itemsChosen.map(itemChosen => ({ docId: itemChosen.docId }))));
        }
    });

    useEffect(() => {
        setCurrentPage(4);
        setFilter([
            {
                title: "Công ty",
                boxSize: "large-pl",
                data: CB_ACCOUNT_GROUP,
                setState: setAccountGroup
            }, {
                title: "Cột",
                data: CB_SHOW_COLUNMS
            }
        ]);
        setActionbar([
            {
                icon: images.uPlus,
                title: "Thêm thiết bị"
            }, {
                icon: images.power,
                title: power.title,
                disable: !power.isActive
            }, {
                icon: images.lock,
                title: lock.title,
                disable: !lock.isActive
            }, {
                icon: images.trash,
                title: "Xoá thiết bị",
                onClick: () => { itemsChosen.length > 0 && setActiveConfirmDialog(true) }
            }
        ]);
        setSearchResult(devices);
        setHeaderColumn(['STT', 'Tên thiết bị', 'Trạng thái', 'Địa điểm', 'Hạn hợp đồng', 'MAC Addresss', 'Memory']);

        !devices.length && dispatch(getDeviceList());
    }, []);

    useEffect(() => {
        setSearch({
            tag: <Input
                id="search"
                name="search"
                size="custom"
                value={searchValue}
                iconRight={images.search}
                placeholder="Tên thiết bị, địa điểm, Mac Address..."
                onChange={(event) => setSearchValue(event.target.value)}
            />
        });
    }, [searchValue]);

    useEffect(() => {
        isCheckedAll ? setItemsChosen(devices) : setItemsChosen([]);
    }, [isCheckedAll]);

    useEffect(() => {
        setSearchResult(devices);
    }, [devices, headerColumn]);

    useEffect(() => {
        itemsChosen.length === devices.length && setIsCheckedAll(true);
    }, [itemsChosen]);

    useEffect(() => {
        let value = searchValue.trim().toLowerCase();
        let result = devices;
        const groupAccount = accountGroup.title;

        if (value === '')
            setSearchResult(devices);

        if (groupAccount === 'Tất cả')
            result = result;
        else result = result.filter(item => item.unitsUsed === groupAccount);

        setSearchResult(result.filter(item =>
            item.SKUID.toLowerCase().includes(value) ||
            item.operatingLocation.toLowerCase().includes(value) ||
            item.macAddress.toLowerCase().includes(value) ||
            item.name.toLowerCase().includes(value)
        ));
    }, [searchValue, accountGroup]);

    useEffect(() => {
        handleChangeStatusDevice(statusDevice);
    }, [statusDevice]);

    useEffect(() => {
        const isActivated = itemsChosen.filter(item => item.status === "activated").length > 0;
        const isDeActivated = itemsChosen.filter(item => item.status === "deactivated").length > 0;

        const isLocked = itemsChosen.filter(item => item.status === "blocked").length > 0;
        const isUnLocked = itemsChosen.filter(item => item.status !== "blocked").length > 0;

        if (isActivated && isDeActivated) setPower({ ...power, isActive: false });
        else if (isActivated) setPower({ ...power, title: "Ngừng kích hoạt thiết bị", isActive: true });
        else if (isDeActivated) setPower({ ...power, title: "Kích hoạt thiết bị", isActive: true });

        if (isLocked && isUnLocked) setLock({ ...lock, isActive: false });
        else if (isLocked) setLock({ ...lock, title: "Mở thiết bị", isActive: true });
        else if (isUnLocked) setLock({ ...lock, title: "Khoá thiết bị", isActive: true });
    }, [itemsChosen]);

    useEffect(() => {
        const search = searchValue.toLowerCase().trim();

        setSearchResult(devices.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search) ||
            item.operatingLocation.toLowerCase().includes(search) ||
            item.macAddress.toLowerCase().includes(search) ||
            item.expirationDate.toLowerCase().includes(search) ||
            item.memory.toLowerCase().includes(search)
        ));
    }, [searchValue]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleItemCheck = (checked: boolean, item: IDevice) => {
        checked
            ? setItemsChosen(itemsChosen.filter(itemChosen => itemChosen.docId !== item.docId))
            : setItemsChosen([...itemsChosen, item]);
    };

    const changeStatus = (item: string) => {
        setStatusDevice(item);
    };

    const handleChangeStatusDevice = useCallback((status: string) => {
        let statusDevice = '';

        if (status === 'Ngừng kích hoạt thiết bị') statusDevice = 'deactivated';
        else if (status === 'Kích hoạt thiết bị') statusDevice = 'activated';
        else if (status === 'Khoá thiết bị') statusDevice = 'blocked';
        else statusDevice = 'activated';

        dispatch(changeStatusDevice({
            data: itemsChosen.map(item => ({
                docId: item.docId,
                status: statusDevice
            }))
        }));

        setItemsChosen([]);
    }, [itemsChosen]);

    const handleNavigate = (id: string) => {
        navigate(`/device-management/detail/${id}`);
        setActive(false);
    };

    return (
        <CommonWrapper
            title='Danh sách thiết bị'
            className={cx('device-management-container')}
        >
            <Filter data={filter} search={search} />
            <Table
                paginate={{
                    dataForPaginate: searchResult,
                    setCurrentItems: handleSetCurrentItems
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleChange}
                isApprove={true}
                thead={headerColumn}
                isCheckedAll={isCheckedAll}
                className={cx("device-table")}
                setIsCheckedAll={setIsCheckedAll}
            >
                {currentItems.map((item, index) => {
                    let status = '';
                    let checked = itemsChosen.indexOf(item) > -1;

                    if (item.status === 'activated')
                        status = 'Đang kích hoạt | Đang hoạt động';
                    else if (item.status === 'deactivated')
                        status = 'Ngừng kích hoạt';
                    else status = 'Đang bị khoá';

                    return (
                        <tr
                            key={index}
                            style={{ height: '47px', cursor: 'pointer' }}
                            onClick={() => handleItemCheck(checked, item)}
                        >
                            <td><Checkbox checked={checked} onClick={() => handleItemCheck(checked, item)} /></td>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.name}</p></td>
                            <td><p className={cx(item.status)}>{status}</p></td>
                            <td><p>{item.operatingLocation}</p></td>
                            <td><p>{item.expirationDate}</p></td>
                            <td><p>{item.macAddress}</p></td>
                            <td><p>{item.memory}</p></td>
                            <td><p className={cx('action')} onClick={() => handleNavigate(item.docId)}
                            >Chi tiết</p></td>
                        </tr>
                    );
                })}
            </Table>
            <ActionBar data={actionbar} />
            <Dialog
                visible={activeConfirmDialog}
                className={cx("remove-device")}
            >
                <h3 className={cx("title")}>Xóa thiết bị</h3>
                <p className={cx("description")}>Bạn có chắc chắn muốn xoá các thiết bị này? Hành động này không thể hoàn tác.</p>
                <div className={cx('device-detail__edit__actions')}>
                    <Button primary value="Hủy" onClick={() => setActiveConfirmDialog(false)} />
                    <Button primary fill value="Xóa" buttonType="submit" />
                </div>
            </Dialog>
            <Loading loading={loading} />
        </CommonWrapper>
    );
};

export default DevicePage;