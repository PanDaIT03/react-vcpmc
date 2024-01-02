import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "~/state";

function ContractTypeManagementPage() {
    // const navigate = useNavigate();
    // const dispatch = useAppDispatch();

    // const etmContract = useSelector((state: RootState) => state.etmContract);

    // const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    // const [actionData, setActionData] = useState<any[]>([] as any[]);

    // useEffect(() => {
    //     setPaging([
    //         {
    //             title: 'Cài đặt',
    //             to: '#',
    //             active: true
    //         }, {
    //             title: 'Quản lý loại hợp đồng',
    //             to: '#',
    //             active: true
    //         }
    //     ]);

    //     setActionData([
    //         {
    //             icon: <Icon icon={editAltIcon} />,
    //             title: 'Chỉnh sửa loại hợp đồng',
    //             onClick: () => navigate(routes.ConfigEditTypeContract)
    //         }, {
    //             icon: <Icon icon={editCalendarIcon} />,
    //             title: 'Chỉnh sửa cảnh báo hết hạn',
    //             onClick: () => navigate(routes.ConfigEditContract)
    //         }
    //     ]);

    //     dispatch(getEtmContractTypes());
    // }, []);

    // return (
    //     <CommonPage
    //         title='Loại hợp đồng'
    //         pagingData={paging}
    //         actionData={actionData}
    //     >
    //         <div className={cx('config-contract-container')}>
    //             <Table
    //                 loading={etmContract.loading}
    //                 thead={['STT', 'Loại hợp đồng', 'Doanh thu VCPCM/hợp đồng (Đơn vị: %)']}
    //                 className={cx('contract-container__table-type')}
    //             >
    //                 {etmContract.types.map((type, index) => (
    //                     <tr key={type.id}>
    //                         <td><p>{index + 1}</p></td>
    //                         <td><p>{type.name}</p></td>
    //                         <td><p>{type.revenuePercent}%</p></td>
    //                     </tr>
    //                 ))}
    //             </Table>
    //             <div className={cx('contract-container__expiration')}>
    //                 <p className={cx('expiration__title')}>Cảnh báo hết hạn khai thác tác phẩm</p>
    //                 <div className={cx('expiration__time')}>
    //                     <p>Hợp đồng được cảnh báo trước thời gian hết hạn:</p>
    //                     <p>{etmContract.expiredWarningDate} ngày</p>
    //                 </div>
    //             </div>
    //         </div>
    //     </CommonPage>
    // );
};

export default ContractTypeManagementPage;