import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

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
import { removePlaylistRecordAction, updatePlaylistAction } from "~/state/thunk/playlist";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { ActionBar } from "~/components/ActionBar";
import Button from "~/components/Button";
import { PlaylistInfo } from "~/components/Playlist/PlaylistInfo";
import { EditPlaylist } from "~/components/Playlist/EditPlaylist";

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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { playlistId } = params;

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [audioSource, setAudioSource] = useState("");

    const playlistState = useSelector((state: RootState) => state.playlist);
    const { playList, loading, status } = playlistState;
    const [playlistDetail, setPlaylistDetail] = useState<IPLaylist>(initialState);
    const [newPlaylistDetail, setNewPlaylistDetail] = useState<IPLaylist>(initialState);

    useEffect(() => {
        setActive(false);
    });

    useEffect(() => {
        if (status === "get successfully")
            setIsEdit(false);

        setPlaylistDetail(playList.find(item => item.docId === playlistId) || initialState);
    }, [playList, status]);

    useEffect(() => {
        if (!visible) setAudioSource('');
    }, [visible]);

    useEffect(() => {
        dispatch(removePlaylistRecordAction(newPlaylistDetail));
    }, [newPlaylistDetail]);

    const handleClickRemove = (item: IRecord) => {
        const index = playlistDetail.records.findIndex(record => record.docId === item.docId);

        const newPlaylistDetail = { ...playlistDetail };
        newPlaylistDetail.records = newPlaylistDetail.records.filter(record => record.docId !== newPlaylistDetail.records[index].docId);

        setNewPlaylistDetail(newPlaylistDetail);
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup.string().required()
        }),
        onSubmit: value => {
            const data = {
                docId: playlistDetail.docId,
                ...value
            };
            dispatch(updatePlaylistAction(data));
        }
    });

    useEffect(() => {
        console.log(playlistDetail);
    }, [playlistDetail]);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                paging={PAGING_ITEMS}
                title={`PlayList ${playlistDetail.title}`}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <div
                            className={cx("bg")}
                            style={{
                                backgroundImage: `url(${playlistDetail.imageURL})`,
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
                            ? <EditPlaylist data={playlistDetail} formik={formik} />
                            : <PlaylistInfo data={playlistDetail} />}
                    </div>
                    <div className={cx("container-right")}>
                        <Table
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả", "", ""]}
                        >
                            {playlistDetail.records.map((record, index) => (
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
                <ActionBar visible={true}>
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
                            />
                        </>
                        : <ActionBarItem
                            title="Thêm Playlist"
                            icon={images.uPlus}
                            onClick={() => navigate(routes.AddPlaylistPage)}
                        />}
                </ActionBar>
                <Dialog
                    primary
                    visible={visible}
                    className={cx("audio")}
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