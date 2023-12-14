import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { images } from "~/assets";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { OptionMenu } from "~/components/OptionMenu";
import { Table } from "~/components/Table";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { RootState, useAppDispatch } from "~/state";
import { Loading } from "~/components/Loading";
import { getRecordsAction } from "~/state/thunk/record";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { AudioDialog } from "~/components/AudioDialog";
import { Dialog } from "~/components/Dialog";
import { IGlobalConstantsType, IRecord } from "~/types";
import { GridView } from "~/components/GridView";
import { Checkbox } from "~/components/Checkbox";
import { updateRecordsAction } from "~/state/thunk/record";
import {
    CB_FORMAT,
    CB_MUSIC_KIND,
    CB_APPROVE,
    CB_VADILITY_MUSIC,
    formatDateMDY,
    getCurrentDate,
} from "~/constants";

import styles from "~/sass/Record.module.scss";
const cx = classNames.bind(styles);

const initialState = {
    id: 0,
    title: ""
};

function RecordPage() {
    const dispatch = useAppDispatch();

    const { setCurrentPage } = useContext(SidebarContext);
    const [isGridView, setIsGridView] = useState(true);
    const [audioVisible, setAudioVisible] = useState(false);

    const [approveOption, setApproveOption] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);

    const [audioSource, setAudioSource] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [approveArr, setApproveArr] = useState<IRecord[]>([]);
    const [searchResult, setSearchResult] = useState<IRecord[]>([]);

    const [format, setFormat] = useState<IGlobalConstantsType>(initialState);
    const [approve, setApprove] = useState<IGlobalConstantsType>(initialState);
    const [musicKind, setMusicKind] = useState<IGlobalConstantsType>(initialState);
    const [vadilityMusic, setVadilityMusic] = useState<IGlobalConstantsType>(initialState);

    const recordState = useSelector((state: RootState) => state.record);
    const { records, loading } = recordState;

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
        const musicKindValue = musicKind.title;
        const search = searchValue.toLowerCase().trim();

        const isValid = typeof musicKindValue !== "undefined";

        if (isValid) {
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
        };
    }, [musicKind, audioVisible, audioSource, searchValue]);

    useEffect(() => {
        isCheckedAll ? setApproveArr(records) : setApproveArr([]);
    }, [isCheckedAll]);

    useEffect(() => {
        console.log(approveArr);
    }, [approveArr]);

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
            contractId: "",
            type: "records"
        })).then(() => {
            setApproveOption(false);
            setIsCheckedAll(false);
            setApproveArr([]);
        });
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper title="Kho bản ghi">
                <div className={cx("action")}>
                    <div className={cx("search")}>
                        <Input
                            id="search"
                            name="search"
                            value={searchValue}
                            placeholder="Tên bản ghi, ca sĩ,..."
                            size="custom"
                            iconRight={images.search}
                            onChange={(event) => handleChange(event)}
                        />
                    </div>
                    <div className={cx("actions-top")}>
                        <div className={cx("filter", approveOption && "approve")}>
                            <OptionMenu
                                title="Thể loại"
                                data={CB_MUSIC_KIND}
                                boxSize="small"
                                setState={setMusicKind}
                            />
                            <OptionMenu
                                title="Định dạng"
                                data={CB_FORMAT}
                                boxSize="small"
                                setState={setFormat}
                            />
                            {!approveOption
                                && <>
                                    <OptionMenu
                                        title="Thời hạn sử dụng"
                                        data={CB_VADILITY_MUSIC}
                                        setState={setVadilityMusic}
                                    />
                                    <OptionMenu
                                        title="Trạng thái"
                                        data={CB_APPROVE}
                                        boxSize="small-pl"
                                        setState={setApprove}
                                    />
                                </>}
                            {(approveOption && isGridView)
                                && <div
                                    className={cx("checked-all")}
                                    onClick={() => setIsCheckedAll(!isCheckedAll)}
                                >
                                    <Checkbox checked={isCheckedAll} />
                                    <p>Chọn tất cả</p>
                                </div>}
                        </div>
                        <div className={cx("view")}>
                            <div className={cx("list")} onClick={() => setIsGridView(false)}>
                                <img
                                    src={images.list}
                                    className={cx(!isGridView ? "active" : "inactive")}
                                    alt="list"
                                />
                            </div>
                            <div className={cx("grid")} onClick={() => setIsGridView(true)}>
                                <img
                                    src={images.grid}
                                    className={cx(isGridView ? "active" : "inactive")}
                                    alt="grid"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !isGridView
                        ? <Table
                            loading={false}
                            isApprove={approveOption}
                            isCheckedAll={isCheckedAll}
                            thead={["STT", "Tên bản ghi", "Mã ISRC", "Thời lượng", "Ca sĩ", "Tác giả",
                                "Thể loại", "Định dạng", "Thời hạn sử dụng", '', '']}
                            className={cx("record")}
                            setIsCheckedAll={setIsCheckedAll}
                        >
                            {searchResult.map((record, index) => {
                                let expiryDateRecord = new Date(formatDateMDY(record.expirationDate));
                                let currentDate = new Date(getCurrentDate());
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
                                        <td className={cx("edit")}>Cập nhật</td>
                                        <td
                                            className={cx("edit")}
                                            onClick={() => {
                                                setAudioSource(record.audioLink);
                                                setAudioVisible(true);
                                            }}
                                        >Nghe</td>
                                    </tr>
                                );
                            })}
                        </Table>
                        : <div>
                            <GridView
                                records={searchResult}
                                isApprove={approveOption}
                                setAudioSource={setAudioSource}
                                approveArray={approveArr}
                                setState={setAudioVisible}
                                handleClickApprove={handleClickApproveArr}
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
                        </div>
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
                                onClick={() => handleClickApprove("Bị từ chối")}
                            />
                        </>}
                </ActionBar>
                <Dialog
                    primary
                    visible={audioVisible}
                    className={cx("audio")}
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setAudioVisible}
                    />
                </Dialog>
            </CommonWrapper >
            <Loading loading={loading} />
        </div >
    );
};

export default RecordPage;