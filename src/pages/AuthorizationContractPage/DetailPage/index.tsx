import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "~/components/Button";
import { images } from "~/assets";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Tab, Tabs } from "~/components/Tabs";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { RootState, useAppDispatch } from "~/state";
import { CAPABILITY } from "~/constants";
import { Dialog } from "~/components/Dialog";
import { CancleForm } from "~/components/CancelForm";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { Product } from "./Product";
import { IContract, IGlobalConstantsType, IRecord, IUserDetail } from "~/types";
import { RenewalAuthorization } from "~/components/RenewalAuthorization";
import { Detail } from "./Detail";
import { Loading } from "~/components/Loading";
import { updateRecordsAction } from "~/state/thunk/record";
import { cancelContractAction } from "~/state/thunk/contract";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";

import styles from "~/sass/AuthorizationContractDetail.module.scss";
const cx = classNames.bind(styles);

const initialState = {} as (IContract & IUserDetail);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Quản lý',
        to: routes.ContractPage
    }, {
        title: 'Quản lý hợp đồng',
        to: routes.ContractPage
    }, {
        title: 'Chi tiết',
        to: "#"
    }
];

function DetailPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { contractCode } = params;

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [approve, setApprove] = useState(false);
    const [switchPage, setSwitchPage] = useState(false);
    const [renewalVisible, setRenewalVisible] = useState(false);

    const [cancleArea, setCancleArea] = useState('');

    const [contractDetail, setContractDetail] = useState<(IContract & IUserDetail)>(initialState);
    const contractState = useSelector((state: RootState) => state.contract);
    const { contracts, status, loading } = contractState;

    const [ownerShip, setOwnerShip] = useState<IGlobalConstantsType[]>([]);
    const [recordArray, setRecordArray] = useState<IRecord[]>([] as IRecord[]);

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        visible && textAreaRef.current?.focus();
    }, [visible]);

    useEffect(() => {
        setOwnerShip([]);
    }, [renewalVisible]);

    useEffect(() => {
        if (contracts.length <= 0 || status === "updated")
            navigate("/contract-management");

        if (status === "get successfully")
            setRenewalVisible(false);

        const contract = contracts.find(item => {
            return contractCode === item.contractCode;
        });

        setContractDetail(contract || initialState);
    }, [contractState]);

    const handleClick = () => {
        setRenewalVisible(true);

        if (typeof contractDetail.ownerShips === "string") {
            setOwnerShip(() => CAPABILITY.filter(item => item.title.toLowerCase().includes(contractDetail.ownerShips.toString().toLowerCase())))
        } else {
            let result: IGlobalConstantsType[] = contractDetail.ownerShips.map(item => {
                let itemCAPABILITY = CAPABILITY.find(i => i.title.toLowerCase().includes(item.name.toLowerCase()));
                if (typeof itemCAPABILITY !== 'undefined')
                    return {
                        id: itemCAPABILITY.id,
                        title: itemCAPABILITY.title
                    };
                else return {
                    id: 0,
                    title: ''
                };
            });
            setOwnerShip(result);
        };
    };

    const handleCancleContract = (id: string, reason: string, status: string) => {
        dispatch(cancelContractAction({ id: id, reason: reason, status: status }));
    };

    const handleClickApproval = (status: string) => {
        if (recordArray.length > 0) {
            dispatch(updateRecordsAction({
                records: recordArray,
                status: status,
                contractId: contractDetail.docId || "",
                type: "contracts"
            }));
            setApprove(false);
        };
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title={`Chi tiết hợp đồng uỷ quyền bài hát - ${contractCode}`}
                paging={PAGING_ITEMS}
            >
                <Tabs>
                    <Tab
                        visible={!switchPage}
                        title="Thông tin hợp đồng"
                        onClick={() => setSwitchPage(false)}
                    />
                    <Tab
                        visible={switchPage}
                        title="Tác phầm uỷ quyền"
                        onClick={() => setSwitchPage(true)}
                    />
                </Tabs>
                {!switchPage
                    && <Detail
                        contractDetail={contractDetail}
                        loading={loading}
                    />}
                {switchPage
                    && <Product
                        contractDetail={contractDetail}
                        approve={approve}
                        recordArray={recordArray}
                        setRecordArray={setRecordArray}
                        setApprove={setApprove}
                        handleClickApprove={handleClickApproval}
                    />}
                <ActionBar visible={true}>
                    {!approve
                        ? <>
                            <ActionBarItem
                                title={!switchPage ? "Chỉnh sửa hợp đồng" : "Chỉnh sửa tác phẩm"}
                                icon={images.edit}
                                disable={contractDetail.censored === false}
                                onClick={() => {
                                    switchPage
                                        ? setApprove(true)
                                        : navigate(`/contract-management/detail/edit/${contractDetail.contractCode}`);
                                }}
                            />
                            <ActionBarItem
                                title="Gia hạn hợp đồng"
                                icon={images.clipboardNotes}
                                onClick={handleClick}
                            />
                            <ActionBarItem
                                title="Huỷ hợp đồng"
                                icon={!switchPage ? images.fiX : images.history}
                                onClick={() => setVisible(true)}
                            />
                            {switchPage
                                && <ActionBarItem
                                    title="Thêm bản ghi"
                                    icon={images.uPlus}
                                />}
                        </>
                        : <ActionBarItem
                            title="Từ chối bản ghi"
                            icon={images.fiX}
                            onClick={() => handleClickApproval("Bị từ chối")}
                        />
                    }
                </ActionBar>
                <Dialog
                    visible={visible}
                    className={cx("cancel")}
                >
                    <CancleForm
                        id="cancelContract"
                        name="cancelContract"
                        title="Hủy hợp đồng uỷ quyền"
                        placeholder="Cho chúng tôi biết lý do bạn muốn huỷ hợp đồng uỷ quyền này..."
                        textareaRef={textAreaRef}
                        onChange={(event) => setCancleArea(event.target.value)}
                    >
                        <div className={cx("action")}>
                            <Button
                                primary
                                value="Quay lại"
                                onClick={() => setVisible(false)}
                            />
                            <Button
                                primary
                                value="Huỷ hợp đồng"
                                fill
                                onClick={() => handleCancleContract(contractDetail.docId, cancleArea, "Đã huỷ")}
                            />
                        </div>
                    </CancleForm>
                </Dialog>
                <Dialog
                    visible={renewalVisible}
                    className={cx("renewal")}
                >
                    <RenewalAuthorization
                        title="Gia hạn uỷ quyền tác phẩm"
                        from={contractDetail.expirationDate}
                        ownerShips={ownerShip}
                        contractId={contractDetail.docId}
                        setVisible={setRenewalVisible}
                    />
                </Dialog>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default DetailPage;