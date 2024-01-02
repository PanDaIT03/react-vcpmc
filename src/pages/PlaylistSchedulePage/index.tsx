import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { images } from "~/assets";
import { Table } from "~/components/Table";
import { Loading } from "~/components/Loading";
import { RootState, useAppDispatch } from "~/state";
import { CommonWrapper } from "~/components/CommonWrapper";
import { IPlaylistSchedule } from "~/types/PlaylistSchedule";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { getPlaylistScheduleAction, removeSchedulePlaybackAction } from "~/state/thunk/playlistSchedule";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { Dialog } from "~/components/Dialog";
import { DeletePlaylistSchedule } from "~/components/DeletePlaylistSchedule";

import styles from "~/sass/PlaylistSchedule.module.scss";
const cx = classNames.bind(styles);

const initialState: IPlaylistSchedule = {
    docId: "",
    name: "",
    playbackTime: "",
    playlistsIds: [],
    devices: [],
};

function PlaylistSchedulePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);

    const { playlistSchedules, loading, status } = useSelector((state: RootState) => state.playlistSchedule);

    const [data, setData] = useState<string[]>([]);
    const [selectArrayRemove, setSelectArrayRemove] = useState<string[]>([]);
    const [playlistScheduleDetails, setPlaylistScheduleDetails] = useState<IPlaylistSchedule>(initialState);

    useEffect(() => {
        setActive(true);
        setCurrentPage(3);
        dispatch(getPlaylistScheduleAction());
    }, []);

    useEffect(() => {
        if (status === "remove successfully")
            setVisible(false);
    }, [status]);

    useEffect(() => {
        if (!visible) setSelectArrayRemove([]);
    }, [visible]);

    useEffect(() => {
        if (selectArrayRemove.length <= 0) return;

        const newPlaylistsIds: any[] = [];

        playlistScheduleDetails.playlistsIds.forEach((item) => {
            const newPlaybackCycle = item.playbackCycle.filter(i =>
                !selectArrayRemove.some(selectItem => i.day === selectItem));

            newPlaylistsIds.push({
                playbackCycle: [...newPlaybackCycle],
                playlistsId: item.playlistsId
            });
        });

        const data: Pick<IPlaylistSchedule, "docId" | "playlistsIds"> = {
            docId: playlistScheduleDetails.docId,
            playlistsIds: newPlaylistsIds.filter(item => item.playbackCycle.length > 0)
        };

        dispatch(removeSchedulePlaybackAction(data));
    }, [selectArrayRemove]);

    const handleClickRemove = (playlistSchedule: IPlaylistSchedule) => {
        setData([]);

        let dayArray: string[] = [];
        playlistSchedule.playlistsIds.forEach(item => {
            item.playbackCycle.forEach((i) => dayArray.push(i.day))
        });

        const newData = dayArray.filter((item, index) =>
            dayArray.findIndex((i) => i === item) === index);

        setData(newData.sort());
        setPlaylistScheduleDetails(playlistSchedule);
        setVisible(true);
    };

    return (
        <div className={cx('wrapper')}>
            <CommonWrapper title='Danh sách lịch phát'>
                <Table
                    className={cx('playlist-schedule')}
                    thead={['STT', 'Tên lịch', 'Thời gian phát', '', '']}
                >
                    {playlistSchedules.map((playlistSchedule, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{playlistSchedule.name}</td>
                            <td>{playlistSchedule.playbackTime}</td>
                            <td
                                className={cx("action")}
                                onClick={() => navigate(`/playlist-schedule/detail/${playlistSchedule.docId}`)}
                            >Xem chi tiết</td>
                            <td
                                className={cx("action")}
                                onClick={() => handleClickRemove(playlistSchedule)}
                            >Xoá</td>
                        </tr>
                    ))}
                </Table>
                <ActionBar>
                    <ActionBarItem
                        title="Thêm lịch phát"
                        icon={images.addPlaylistIcon}
                    />
                </ActionBar>
                <Dialog
                    visible={visible}
                >
                    <DeletePlaylistSchedule
                        data={data}
                        selectArray={selectArrayRemove}
                        setSelectArray={setSelectArrayRemove}
                        setVisible={setVisible}
                    />
                </Dialog>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlaylistSchedulePage;