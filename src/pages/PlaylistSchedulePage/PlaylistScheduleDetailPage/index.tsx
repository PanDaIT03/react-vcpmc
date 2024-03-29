import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { setPlaylistScheduleDetail } from "~/state/reducer/playlistSchedule";
import { getPlayListAction } from "~/state/thunk/playlist";
import { getPlaylistsRecordsList } from "~/state/thunk/playlistsRecords";
import { IPLaylist } from "~/types/PlaylistType";
import { PlaybackCycle, PlaylistSchedule, SchedulePlaylist, SchedulePlaylistDetail } from "~/types/PlaylistSchedule";

import style from "~/sass/PlaylistScheduleDetail.module.scss";
import { IGlobalConstantsType } from "~/types";
const cx = classNames.bind(style);

const initialSchedule: PlaylistSchedule = {
    id: '',
    name: '',
    playbackTime: '',
    playlistsIds: []
};

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Lập lịch phát',
        to: routes.PlaylistSchedulePage,
        active: true
    }, {
        title: 'Chi tiết',
        to: `#`,
        active: false
    }
];

function PlaylistScheduleDetailPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { playlistScheduleCode } = useParams();

    const [itemsPerPage, setItemsPerPage] = useState('8');

    const playlist = useSelector((state: RootState) => state.playlist);
    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const [currentItems, setCurrentItems] = useState<SchedulePlaylist[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);
    const [scheduleDetail, setScheduleDetail] = useState<SchedulePlaylistDetail>({
        id: '',
        name: '',
        playbackTime: '',
        playlist: []
    } as SchedulePlaylistDetail);

    useEffect(() => {
        setActionbar([{
            icon: images.edit,
            title: "Chỉnh sửa lịch phát",
            onClick: () => navigate(`/playlist-schedule/detail/edit/${playlistScheduleCode}`)
        }]);

        dispatch(getPlaylistsRecordsList());
        dispatch(getPlayListAction());
    }, []);

    useEffect(() => {
        if (playlist.playList.length <= 0 || playlistsRecords.playlistsRecords.length <= 0) return;

        let schedule: PlaylistSchedule =
            playlistSchedule.listSchedule.find(schedule => schedule.id === playlistScheduleCode)
            || initialSchedule;

        const scheduleDetail: SchedulePlaylistDetail = {
            id: schedule.id,
            name: schedule.name,
            playbackTime: schedule.playbackTime,
            playlist: schedule.playlistsIds.map(item => ({
                playbackCycle: item.playbackCycle,
                playlistDetail: playlist.playList.find(playlist =>
                    item.playlistsId === playlist.docId) || {} as IPLaylist
            }))
        };

        setScheduleDetail(scheduleDetail);
        dispatch(setPlaylistScheduleDetail(scheduleDetail));
    }, [playlist.playList, playlistsRecords.playlistsRecords]);

    useEffect(() => {
        if (playlistsRecords.loading) setLoading(true);
        else if (playlist.loading) setLoading(true);
        else if (playlistSchedule.loading === true) setLoading(true);
        else setLoading(false);
    }, [playlistsRecords, playlist]);

    const handleCurrentItems = (items: any[]) => {
        setCurrentItems(items);
    };

    const handleItemsPerPage = (value: string) => {
        setItemsPerPage(value);
    };

    return (
        <div className={cx('wrapper')}>
            <CommonWrapper
                paging={PAGING_ITEMS}
                title={scheduleDetail.name}
            >
                <p className={cx('header')}>Danh sách Playlist</p>
                <Table
                    paginate={{
                        dataForPaginate: scheduleDetail.playlist,
                        setCurrentItems: handleCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleItemsPerPage}
                    thead={['STT', 'Tên lịch', 'Ngày phát Playlist', 'Bắt đầu - Kết thúc', 'Chu kỳ phát', 'Thiết bị']}
                >
                    {currentItems.map((item: SchedulePlaylist, index) => {
                        return (
                            <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.playlistDetail.title}</p></td>
                                <td><p>{scheduleDetail.playbackTime}</p></td>
                                <td><div className={cx('table__time')}>{item.playbackCycle.map((item: PlaybackCycle, index: number) =>
                                    <p key={index}>{item.time.map(time => time)}</p>
                                )}</div></td>
                                <td><div className={cx('table__cycle')}>{item.playbackCycle.map((item: PlaybackCycle, index: number) => <span key={index}>{item.day}</span>)}</div></td>
                                <td><p>{scheduleDetail.playbackTime}</p></td>
                            </tr>
                        )
                    })}
                </Table>
                <ActionBar data={actionbar} />
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default PlaylistScheduleDetailPage;