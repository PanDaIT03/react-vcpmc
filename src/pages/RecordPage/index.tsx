import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { AudioDialog } from "~/components/AudioDialog";
import Button from "~/components/Button";
import { CancleForm } from "~/components/CancelForm";
import { Checkbox } from "~/components/Checkbox";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Dialog } from "~/components/Dialog";
import { Filter } from "~/components/Filter";
import { GridView } from "~/components/GridView";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { IOptionMenu } from "~/components/OptionMenu";
import { SwitchViewButton } from "~/components/SwitchViewButtons";
import { Table } from "~/components/Table";
import {
    CB_APPROVE,
    CB_FORMAT,
    CB_MUSIC_KIND,
    CB_VADILITY_MUSIC,
    formatDateMDY,
    getCurrentDate,
} from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getRecordsAction, updateRecordsAction } from "~/state/thunk/record";
import { IGlobalConstantsType, IRecord } from "~/types";

import styles from "~/sass/Record.module.scss";
const cx = classNames.bind(styles);

const initialState = {
    id: 0,
    title: ""
};

function RecordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setCurrentPage } = useContext(SidebarContext);
    const [isGridView, setIsGridView] = useState(true);
    const [audioVisible, setAudioVisible] = useState(false);
    const [cancelVisible, setCancelVisible] = useState(false);

    const [approveOption, setApproveOption] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);

    const [cancel, setCancel] = useState('');
    const [audioSource, setAudioSource] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [filter, setFilter] = useState<IOptionMenu[]>([]);
    const [approveArr, setApproveArr] = useState<IRecord[]>([]);
    const [searchResult, setSearchResult] = useState<IRecord[]>([]);
    const [editRecords, setEditRecords] = useState<IRecord[]>([]);

    const [format, setFormat] = useState<IGlobalConstantsType>(initialState);
    const [approve, setApprove] = useState<IGlobalConstantsType>(initialState);
    const [musicKind, setMusicKind] = useState<IGlobalConstantsType>(initialState);
    const [vadilityMusic, setVadilityMusic] = useState<IGlobalConstantsType>(initialState);

    const recordState = useSelector((state: RootState) => state.record);
    const { records, loading } = recordState;
    const userState = useSelector((state: RootState) => state.user);
    const { currentUser } = userState;

    const search = {
        tag: <Input
            id="search"
            name="search"
            value={searchValue}
            placeholder="Tên bản ghi, ca sĩ,..."
            size="custom"
            iconRight={images.search}
            onChange={(event) => handleChange(event)}
        />
    };

    useEffect(() => {
        setCurrentPage(1);
        dispatch(getRecordsAction(""));
    }, []);

    useEffect(() => {
        setSearchResult(records);
    }, [records]);

    useEffect(() => {
        if (!audioVisible) setAudioSource("");
    }, [audioVisible]);

    useEffect(() => {
        const musicKindValue = musicKind.title || "";
        const search = searchValue.toLowerCase().trim();

        const result = records.filter(record => {
            let itemResult;

            if (musicKindValue === "Tất cả")
                itemResult = record;
            else if (record.category?.includes(musicKindValue)) {
                if (musicKindValue === "Pop")
                    itemResult = record;
                else if (musicKindValue === "EDM")
                    itemResult = record;
                else if (musicKindValue === "Ballad")
                    itemResult = record;
            };

            return itemResult;
        });

        setSearchResult(result.filter(item =>
            item.nameRecord.toLowerCase().includes(search) ||
            item.singer.toLowerCase().includes(search) ||
            item.ISRCCode.toLowerCase().includes(search) ||
            item.author.toLowerCase().includes(search) ||
            item.category?.toLowerCase().includes(search) ||
            item.format.toLowerCase().includes(search)
        ));
    }, [musicKind, searchValue]);

    useEffect(() => {
        isCheckedAll ? setApproveArr(records) : setApproveArr([]);
    }, [isCheckedAll]);

    useEffect(() => {
        const fiterData: IOptionMenu[] = [
            {
                title: "Thể loại",
                data: CB_MUSIC_KIND,
                boxSize: "small",
                setState: setMusicKind,
            }, {
                title: "Định dạng",
                data: CB_FORMAT,
                boxSize: "small",
                setState: setFormat
            },
            !approveOption ? {
                title: "Thời hạn sử dụng",
                data: CB_VADILITY_MUSIC,
                setState: setVadilityMusic
            } : {} as IOptionMenu,
            !approveOption ? {
                title: "Trạng thái",
                data: CB_APPROVE,
                boxSize: "small-pl",
                setState: setApprove
            } : {} as IOptionMenu
        ];

        setFilter(fiterData);
        setEditRecords(records.filter(record => record.status === "Chưa phê duyệt"));
    }, [approveOption]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickApproveArr = (record: IRecord, isChecked: boolean) => {
        !isChecked
            ? setApproveArr([...approveArr, { ...record }])
            : setApproveArr(() => approveArr.filter(item => item.docId !== record.docId))
    };

    const handleClickApprove = (status: string) => {
        dispatch(updateRecordsAction({
            records: approveArr,
            status: status,
            approvalBy: currentUser.docId,
            contractId: "",
            type: "records",
            approvalDate: getCurrentDate("mm/dd/yyyy")
        })).then(() => {
            setApproveOption(false);
            setIsCheckedAll(false);
            setApproveArr([]);
        });
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper title="Kho bản ghi">
                <div className={cx("actions")}>
                    <div className={cx("actions__filter")}>
                        <Filter
                            data={filter}
                            search={search}
                            searchPosition="top"
                            spaceBetween={approveOption ? "default" : "auto"}
                            width={approveOption ? "max-content" : "max-width-100pc"}
                        />
                        {(approveOption && isGridView)
                            && <Checkbox
                                label="Chọn tất cả"
                                className={cx("check-all")}
                                checked={isCheckedAll}
                                onClick={() => setIsCheckedAll(!isCheckedAll)} />}
                    </div>
                    <SwitchViewButton state={isGridView} setState={setIsGridView} />
                </div>
                {!isGridView
                    ? <Table
                        isApprove={approveOption}
                        isCheckedAll={isCheckedAll}
                        className={cx("record")}
                        thead={["STT", "Tên bản ghi", "Mã ISRC", "Thời lượng", "Ca sĩ", "Tác giả",
                            "Thể loại", "Định dạng", "Thời hạn sử dụng", '', '']}
                        setIsCheckedAll={setIsCheckedAll}
                    >
                        {(approveOption ? editRecords : searchResult).map((record, index) => {
                            let expiryDateRecord = new Date(formatDateMDY(record.expirationDate) || "");
                            let currentDate = new Date(getCurrentDate("mm/dd/yyyy"));
                            let isExpiry = expiryDateRecord < currentDate;

                            let isItemExisted = approveArr.filter(item => item.docId === record.docId);
                            let isChecked = isItemExisted.length > 0;

                            return (
                                <tr
                                    key={index}
                                    onClick={() => handleClickApproveArr(record, isChecked)}
                                >
                                    {approveOption
                                        && <td>
                                            <Checkbox checked={isChecked} />
                                        </td>}
                                    <td>{index + 1}</td>
                                    <td>{record.nameRecord}</td>
                                    <td>{record.ISRCCode}</td>
                                    <td>{record.time}</td>
                                    <td>{record.singer}</td>
                                    <td>{record.author}</td>
                                    <td>{record.category}</td>
                                    <td>{record.format}</td>
                                    <td>{
                                        <>
                                            {!isExpiry
                                                ? <div className={cx("status")}>
                                                    <img src={images.ellipseEffect} alt="icon" />
                                                    <p>Còn thời hạn</p>
                                                </div>
                                                : <div className={cx("status")}>
                                                    <img src={images.ellipseExpire} alt="icon" />
                                                    <p>Đã hết hạn</p>
                                                </div>}
                                            <p className={cx("date")}>{record.expirationDate}</p>
                                        </>
                                    }</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => navigate(`/record/edit/${record.docId}`)}
                                    >
                                        Cập nhật</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => {
                                            setAudioVisible(true);
                                            setAudioSource(record.audioLink);
                                        }}
                                    >Nghe</td>
                                </tr>
                            );
                        })}
                    </Table>
                    : <>
                        <GridView
                            data={approveOption ? editRecords : searchResult}
                            isApprove={approveOption}
                            setAudioSource={setAudioSource}
                            approveArray={approveArr}
                            setState={setAudioVisible}
                            handleClick={handleClickApproveArr}
                        />
                        <div className={cx("action-bottom")}>
                            <div className={cx("show", "--center-flex")}>
                                <div className={cx("title")}>Hiển thị</div>
                                <input name="pageNumber" value="13" onChange={handleChange} />
                                <div className={cx("sub-title")}>hàng trong mỗi trang</div>
                            </div>
                            <div className={cx("pagination")}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                                <div className={cx("page-num", "--center-flex")}>
                                    <div className={cx("active", "--center-flex")}>1</div>
                                    <div>2</div>
                                    <div>...</div>
                                    <div>10</div>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                    </>
                }
                <ActionBar visible={true}>
                    {!approveOption
                        ? <ActionBarItem
                            title="Quản lý phê duyệt"
                            icon={images.edit}
                            onClick={() => setApproveOption(true)}
                        />
                        : <>
                            <ActionBarItem
                                title="Phê duyệt"
                                icon={images.checkGreen}
                                onClick={() => handleClickApprove("Đã phê duyệt")}
                            />
                            <ActionBarItem
                                title="Từ chối"
                                icon={images.fiX}
                                onClick={() => setCancelVisible(true)}
                            />
                        </>}
                </ActionBar>
                <Dialog
                    primary
                    visible={audioVisible}
                    content="audio"
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setAudioVisible}
                    />
                </Dialog>
                <Dialog
                    primary
                    visible={cancelVisible}
                    className={cx("cancel")}
                    alignCenter="all"
                >
                    <CancleForm
                        id="cancel"
                        name="cancel"
                        title="Lý do từ chối phê duyệt"
                        onChange={(e) => setCancel(e.target.value)}
                    >
                        <div className={cx("cancel-action")}>
                            <Button
                                primary
                                value="Huỷ"
                                onClick={() => setCancelVisible(false)}
                            />
                            <Button
                                fill
                                primary
                                value="Từ chối"
                                onClick={() => handleClickApprove("Bị từ chối")}
                            />
                        </div>
                    </CancleForm>
                </Dialog>
            </CommonWrapper >
            <Loading loading={loading} />
        </div >
    );
};

export default RecordPage;