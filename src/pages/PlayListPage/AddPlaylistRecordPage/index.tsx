import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { CB_FORMAT, CB_PLAYLIST, getTotalMoment } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { RootState, useAppDispatch } from "~/state";
import { IGlobalConstantsType, IRecord } from "~/types";
import { Input } from "~/components/Input";
import { Table } from "~/components/Table";
import { images } from "~/assets";
import { IPLaylist } from "~/types/Playlist";
import { Dialog } from "~/components/Dialog";
import { AudioDialog } from "~/components/AudioDialog";
import Button from "~/components/Button";
import { addPlaylistRecordsAction } from "~/state/thunk/record";

import styles from "~/sass/AddPlaylistRecord.module.scss";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistPage
    }, {
        title: 'Thêm playlist mới',
        to: routes.AddPlaylistPage
    }, {
        title: 'Thêm bản ghi vào playlist',
        to: "#"
    }
];

const initialState = {
    id: 0,
    title: ''
};

const initialPlaylist: Omit<IPLaylist, "playlistsRecordsId"> = {
    docId: "",
    categoriesId: [],
    records: [],
    createdBy: "",
    createdDate: "",
    description: "",
    imageURL: "",
    mode: "",
    title: "",
    categories: [],
};

function AddPlaylistRecordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fromPage = localStorage.getItem('fromPage');

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [audioSource, setAudioSource] = useState("");

    const [formatOption, setFormatOption] = useState<IGlobalConstantsType>(initialState);
    const [playlistOption, setPlaylistOption] = useState<IGlobalConstantsType>(CB_PLAYLIST[0]);
    const [searchValue, setSearchValue] = useState('');

    const { playList, loading } = useSelector((state: RootState) => state.playlist);
    const { newRecords } = useSelector((state: RootState) => state.record);

    const [records, setRecords] = useState<IRecord[]>([]);
    const [newPlaylistRecords, setNewPlaylistRecords] = useState<IRecord[]>([]);

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (playList.length <= 0)
            navigate(routes.PlaylistPage);
    }, [playList]);

    useEffect(() => {
        setNewPlaylistRecords(newRecords || []);
    }, [newRecords]);

    useEffect(() => {
        if (!visible) setAudioSource('');
    }, [visible]);

    useEffect(() => {
        let playlistOptionValue = playlistOption.title?.trim();

        let playlistMatch = playList.find(item => item.title === playlistOptionValue) || initialPlaylist;
        setRecords(playlistMatch.records);
    }, [playlistOption]);

    const handleAddRecords = (item: IRecord) => {
        let isExisted = newPlaylistRecords.filter(newRecord => item.title === newRecord.title).length > 0;
        if (!isExisted) setNewPlaylistRecords(prev => [...prev, item]);
    };

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Thêm bản ghi"
                paging={PAGING_ITEMS}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <h2 className={cx("title")}>Kho bản ghi</h2>
                        <div className={cx("filter")}>
                            <OptionMenu
                                title="Thể loại"
                                data={CB_FORMAT}
                                setState={setFormatOption}
                            />
                            <OptionMenu
                                title="Playlist mẫu"
                                boxSize="small-pl"
                                data={CB_PLAYLIST}
                                setState={setPlaylistOption}
                            />
                        </div>
                        <div className={cx("search")}>
                            <Input
                                id="search"
                                type='text'
                                name='search'
                                size="custom"
                                placeholder="Tên bản ghi, ca sĩ..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <Table
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả"]}
                            className={cx("playlist-records")}
                        >
                            {records.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{record.title}</td>
                                    <td>{record.singer}</td>
                                    <td>{record.author}</td>
                                    <td
                                        className={cx("action")}
                                        onClick={() => {
                                            setVisible(true);
                                            setAudioSource(record.audioLink);
                                        }}
                                    >Nghe</td>
                                    <td
                                        className={cx("action")}
                                        onClick={() => handleAddRecords(record)}
                                    >Thêm</td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                    <div className={cx("container-right")}>
                        <h2 className={cx("title")}>Danh sách bản ghi được thêm vào Playlist</h2>
                        <div className={cx("total")}>
                            <div className={cx("total-record")}>
                                <div className={cx("title")}>Tổng số:</div>
                                <div className={cx("content")}>{newPlaylistRecords.length} bản ghi</div>
                            </div>
                            <div className={cx("total-time")}>
                                <div className={cx("title")}>Tổng thời lượng:</div>
                                <div className={cx("content")}>
                                    {newPlaylistRecords.length > 0
                                        ? totalPlaylistTime(newPlaylistRecords)
                                        : <p>--:--:--</p>}
                                </div>
                            </div>
                        </div>
                        <div className={cx("search")}>
                            <Input
                                id="search"
                                type='text'
                                name='search'
                                size="custom"
                                placeholder="Tên bản ghi, ca sĩ..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <Table
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả"]}
                            className={cx("playlist-records")}
                        >
                            {newPlaylistRecords.length <= 0
                                ? <tr>
                                    <td
                                        className={cx("reminder")}
                                        colSpan={4}
                                    >
                                        <div className={cx("content")}>
                                            <p>Vui lòng chọn bản ghi để thêm vào Playlist</p>
                                            <img src={images.force} alt="force" />
                                        </div>
                                    </td>
                                </tr>
                                : newPlaylistRecords.map((record, index) => (
                                    <tr key={record.docId}>
                                        <td>{index + 1}</td>
                                        <td>{record.title}</td>
                                        <td>{record.singer}</td>
                                        <td>{record.author}</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => {
                                                setVisible(true);
                                                setAudioSource(record.audioLink);
                                            }}
                                        >Nghe</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => setNewPlaylistRecords(newPlaylistRecords.filter(item => item.title !== record.title))}
                                        >Gỡ</td>
                                    </tr>
                                ))}
                        </Table>
                    </div>
                </div>
                <Dialog
                    primary
                    visible={visible}
                    content="audio"
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setVisible}
                    />
                </Dialog>
                <div className={cx("button-actions")}>
                    <Button
                        primary
                        size="large"
                        value="Huỷ"
                        onClick={() => navigate(routes.AddPlaylistPage)}
                    />
                    <Button
                        primary
                        size="large"
                        fill
                        value="Lưu"
                        buttonType="submit"
                        onClick={() =>
                            dispatch(addPlaylistRecordsAction(newPlaylistRecords))
                                .then(() => navigate(fromPage ?? routes.PlaylistPage))
                        }
                    />
                </div>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default AddPlaylistRecordPage;