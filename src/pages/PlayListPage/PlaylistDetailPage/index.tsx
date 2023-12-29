import classNames from "classnames/bind";
import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "~/components/Button";
import { images } from "~/assets";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { IPLaylist } from "~/types/Playlist";
import { IRecord } from "~/types";
import { Table } from "~/components/Table";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { Dialog } from "~/components/Dialog";
import { AudioDialog } from "~/components/AudioDialog";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { ActionBar } from "~/components/ActionBar";
import { PlaylistInfo } from "~/components/Playlist/PlaylistInfo";
import { EditPlaylist } from "~/components/Playlist/EditPlaylist";
import { deletePlaylistAction, getPlayListAction, removePlaylistRecordAction, updatePlaylistAction, updatePlaylistsRecordsAction } from "~/state/thunk/playlist";
import { resetNewRecordsAction } from "~/state/thunk/record";

import styles from "~/sass/PlaylistDetail.module.scss";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistPage
    }, {
        title: 'Chi tiết playlist',
        to: "#"
    }
];

const initialState: IPLaylist = {
    docId: "",
    playlistsRecordsId: "",
    categoriesId: [],
    records: [],
    createdBy: "",
    createdDate: "",
    description: "",
    imageURL: "",
    mode: "",
    title: "",
    categories: []
};

const initialValues = {
    imageURL: "",
    title: "",
    description: ""
};

function PlaylistDetailPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams();
    const { playlistId } = params;

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [audioSource, setAudioSource] = useState("");

    const { playList, loading, status } = useSelector((state: RootState) => state.playlist);
    const { newRecords } = useSelector((state: RootState) => state.record);

    const [playlistDetails, setPlaylistDetails] = useState<IPLaylist>(initialState);

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (newRecords.length > 0)
            setIsEdit(true);
    }, [newRecords]);

    useEffect(() => {
        if (status === "update successfully")
            setIsEdit(false);

        if (playList.length <= 0)
            navigate(routes.PlaylistPage);

        const playlist = playList.find(item => item.docId === playlistId);
        if (typeof playlist === "undefined") return;

        const combineRecords: IRecord[] = [...playlist.records, ...newRecords];
        const standardizationRecords: IRecord[] = combineRecords.filter(
            (combineRecord, index) =>
                combineRecords.findIndex(item => item.docId === combineRecord.docId) === index
        );

        setPlaylistDetails({
            ...playlist,
            records: standardizationRecords
        });
    }, [playList, status]);

    useEffect(() => {
        if (!visible) setAudioSource('');
    }, [visible]);

    const debounceRemove = useCallback((value: IPLaylist) => {
        const remove = setTimeout(() =>
            dispatch(removePlaylistRecordAction(value)),
            500
        );
        return () => clearTimeout(remove);
    }, []);

    const handleClickRemove = (item: IRecord) => {
        const index = playlistDetails.records.findIndex(record => record.docId === item.docId);

        const newPlaylistDetail = { ...playlistDetails };
        newPlaylistDetail.records = newPlaylistDetail.records.filter(record =>
            record.docId !== newPlaylistDetail.records[index].docId);

        setPlaylistDetails(newPlaylistDetail);
        debounceRemove(newPlaylistDetail);
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup.string().required()
        }),
        onSubmit: value => {
            const data = {
                docId: playlistDetails.docId,
                ...value
            };
            dispatch(updatePlaylistAction(data));
            dispatch(updatePlaylistsRecordsAction({
                playlistsId: data.docId,
                "records": newRecords
            })).then(() => {
                dispatch(getPlayListAction());
                dispatch(resetNewRecordsAction());
            });
        }
    });

    const handleClickAddRecord = () => {
        localStorage.setItem('fromPage', `/playlist/detail/${playlistId}`);
        navigate(routes.AddPlaylistRecordPage);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                paging={PAGING_ITEMS}
                title={`PlayList ${playlistDetails.title}`}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <div
                            className={cx("bg")}
                            style={{
                                backgroundImage: `url(${playlistDetails.imageURL})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                            {isEdit
                                && <div className={cx("upload-icon")}>
                                    <img src={images.moreVertical} alt="upload" />
                                </div>}
                        </div>
                        {isEdit
                            ? <EditPlaylist data={playlistDetails} formik={formik} />
                            : <PlaylistInfo data={playlistDetails} />}
                    </div>
                    <div className={cx("container-right")}>
                        <Table
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả", "", ""]}
                        >
                            {playlistDetails.records.map((record, index) => (
                                <tr className={cx("playlist_item")} key={index}>
                                    <td >{index + 1}</td>
                                    <td>
                                        <div>{record.title}</div>
                                        <div className={cx("subtitle")}>
                                            <div>{record.category}</div>
                                            <img src={images.ellipseEffect} alt="icon" />
                                            <div>{record.format}</div>
                                            <img src={images.ellipseEffect} alt="icon" />
                                            <div>{record.time}</div>
                                        </div>
                                    </td>
                                    <td>{record.singer}</td>
                                    <td>{record.author}</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => {
                                            setVisible(true);
                                            setAudioSource(record.audioLink);
                                        }}
                                    >Nghe</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => handleClickRemove(record)}
                                    >Gỡ</td>
                                </tr>
                            ))}
                        </Table>
                        {isEdit
                            && <div className={cx("button-actions")}>
                                <Button
                                    primary
                                    size="large"
                                    value="Huỷ"
                                    onClick={() => setIsEdit(false)}
                                />
                                <Button
                                    primary
                                    size="large"
                                    fill
                                    value="Lưu"
                                    buttonType="submit"
                                    onClick={() => formik.handleSubmit()}
                                />
                            </div>}
                    </div>
                </div>
                <ActionBar>
                    {!isEdit
                        ? <>
                            <ActionBarItem
                                title="Chỉnh sửa"
                                icon={images.edit}
                                onClick={() => setIsEdit(true)}
                            />
                            <ActionBarItem
                                title="Xóa Playlist"
                                icon={images.trash}
                                onClick={() =>
                                    dispatch(deletePlaylistAction(playlistId || ''))
                                        .then(() => navigate(routes.PlaylistPage))}
                            />
                        </>
                        : <ActionBarItem
                            title="Thêm bản ghi"
                            icon={images.uPlus}
                            onClick={handleClickAddRecord}
                        />}
                </ActionBar>
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
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlaylistDetailPage;