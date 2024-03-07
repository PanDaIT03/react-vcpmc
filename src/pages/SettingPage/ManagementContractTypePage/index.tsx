import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getEtmContractTypes } from "~/state/thunk/entrustmentContract";
import { IGlobalConstantsType } from "~/types";

import style from '~/sass/ManagementContractType.module.scss';
const cx = classNames.bind(style);

function ManagementConctractPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const { setCurrentPage } = useContext(SidebarContext);
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);

    useEffect(() => {
        setCurrentPage(6);
        setPaging([
            {
                title: 'Cài đặt',
                to: '#',
                active: true
            }, {
                title: 'Quản lý loại hợp đồng',
                to: '#',
                active: true
            }
        ]);
        setActionbar([
            {
                icon: images.editAlt,
                title: "Chỉnh sửa loại hợp đồng",
                onClick: () => navigate(routes.EditContractTypePage)
            }, {
                icon: images.editCalendar,
                title: "Chỉnh sửa cảnh báo hết hạn",
                onClick: () => navigate(routes.EditWarningExpirePage)
            }
        ]);

        dispatch(getEtmContractTypes());
    }, []);

    return (
        <CommonWrapper
            title='Loại hợp đồng'
            paging={paging}
        >
            <div className={cx('config-contract-container')}>
                <Table
                    minWidth="861px"
                    minHeight="168px"
                    thead={['STT', 'Loại hợp đồng', 'Doanh thu VCPCM/hợp đồng (Đơn vị: %)']}
                    className={cx('contract-container__table-type')}
                >
                    {etmContract.types.map((type, index) => (
                        <tr key={index}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{type.name}</p></td>
                            <td><p>{type.revenuePercent}%</p></td>
                        </tr>))}
                </Table>
                <div className={cx('contract-container__expiration')}>
                    <p className={cx('expiration__title')}>Cảnh báo hết hạn khai thác tác phẩm</p>
                    <div className={cx('expiration__time')}>
                        <p>Hợp đồng được cảnh báo trước thời gian hết hạn:</p>
                        <p>{etmContract.expiredWarningDate} ngày</p>
                    </div>
                </div>
                <Loading loading={etmContract.loading} />
                <ActionBar data={actionbar} />
            </div>
        </CommonWrapper>
    );
};

export default ManagementConctractPage;