import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { images } from "~/assets";
import { RootState } from "~/state";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { IPlaylistSchedule } from "~/types/PlaylistSchedule";
import { Loading } from "~/components/Loading";
import { Table } from "~/components/Table";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";

import styles from "~/sass/PlaylistScheduleDetail.module.scss";
const cx = classNames.bind(styles);

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: "Lập lịch phát",
        to: routes.PlaylistSchedulePage
    }, {
        title: "Chi tiết",
        to: "#"
    }
];

const initialState: IPlaylistSchedule = {
    docId: "",
    name: "",
    playbackTime: "",
    playlistsIds: [],
    devices: []
};

function PlaylistScheduleDetailPage() {
    const navigate = useNavigate();
    const { playlistScheduleCode } = useParams();

    const { setActive } = useContext(SidebarContext);

    const { playlistSchedules, loading } = useSelector((state: RootState) => state.playlistSchedule);
    const [playlistScheduleDetails, setPlaylistScheduleDetails] = useState<IPlaylistSchedule>(initialState);
    const { playbackTime, playlistsIds, devices } = playlistScheduleDetails;

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        setPlaylistScheduleDetails(playlistSchedules.find(playlistSchedule =>
            playlistSchedule.docId === playlistScheduleCode) || initialState
        );
    }, [playlistSchedules]);

    useEffect(() => {
        console.log(playlistScheduleDetails);
    }, [playlistScheduleDetails]);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title={playlistScheduleDetails.name}
                paging={PAGING_ITEMS}
            >
                <Table
                    thead={["STT", "Tên playlist", "Ngày phát playlist", "Bắt đầu - Kết thúc", "Chu kỳ phát", "Thiết bị"]}
                    className={cx("playlist-schedule-detail")}
                >
                    {playlistsIds.map((playlist, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{playlist.playlistTitle}</td>
                            <td>{playbackTime}</td>
                            <td>{playlist.playbackCycle.map((item, index) => (
                                <div key={index}>{item.time}</div>
                            ))}</td>
                            <td>
                                <div className={cx("playback-cycle")}>
                                    {playlist.playbackCycle.map((item, index) => (
                                        <div className={cx("item")} key={index}>
                                            <div>{item.day}</div>
                                            <p>|</p>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className={cx("devices")}>
                                    {devices.map((item, index) => (
                                        <div className={cx("item")} key={index}>
                                            <div>{item.name}</div>
                                            <p>|</p>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
                <ActionBar>
                    <ActionBarItem
                        title="Chỉnh sửa lịch phát"
                        icon={images.edit}
                        onClick={() => navigate(`/playlist-schedule/detail/edit/${playlistScheduleCode}`)}
                    />
                </ActionBar>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlaylistScheduleDetailPage;