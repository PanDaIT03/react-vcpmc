import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { PlaybackCycle, PlaylistScheduleDetail } from "~/types/PlaylistSchedule";
import * as Yup from "yup";
import { PlaylistRecordDetail } from "~/types/PlaylistsRecords";
import { formatDateDMYHPTS, formatDateYMD } from "~/constants";
import { savePlaylistSchedule } from "~/state/thunk/playlistSchedule";
import { getPlaylistsRecordsDetail } from "~/state/reducer/playlistsRecords";
import CommonPage from "../CommonPage";
import { getRecordsAction } from "~/state/thunk/record";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";

function EditPlaylistSchedulePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { playlistScheduleCode } = useParams();

    const PAGING_ITEMS: Array<PagingItemType> = [
        {
            title: 'Lập lịch phát',
            to: routes.PlaylistSchedulePage,
            active: true
        }, {
            title: 'Chi tiết',
            to: `/playlist-schedule/detail/${playlistScheduleCode}`,
            active: false
        }, {
            title: 'Chỉnh sửa lịch phát',
            to: '#',
            active: false
        }
    ];

    const playlist = useSelector((state: RootState) => state.playlist);
    const record = useSelector((state: RootState) => state.record);
    const playlistsRecords = useSelector((state: RootState) => state.playlistsRecords);
    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);

    const { setActive } = useContext(SidebarContext);
    const [itemActive, setItemActive] = useState<PlaylistScheduleDetail[]>([] as PlaylistScheduleDetail[]);
    const [actionData, setActionData] = useState<any[]>([] as any[]);
    const [title, setTitle] = useState<string>('');

    const scheduleFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            playbackTime: '',
            playlist: [] as PlaylistScheduleDetail[],
            newPlaylist: [] as PlaylistRecordDetail[],
            startDate: '',
            endDate: ''
        },
        validationSchema: Yup.object({
            startDate: Yup.string().required(),
            endDate: Yup.string().required(),
            name: Yup.string().required()
        }),
        onSubmit: values => {
            let playlists = itemActive.map((item: PlaylistScheduleDetail) => ({
                playbackCycle: item.playbackCycle.filter((playbackCycle: PlaybackCycle) => playbackCycle.time.length > 0),
                playlistsId: item.playlist.playlistId
            }));

            let playbackTime = `${formatDateDMYHPTS(values.startDate)} - ${formatDateDMYHPTS(values.endDate)}`;

            dispatch(savePlaylistSchedule({
                id: values.id,
                playlistsIds: playlists.filter(playlist => playlist.playbackCycle.length > 0),
                navigate: () => navigate('/playlist-schedule'),
                name: values.name,
                playbackTime: playbackTime
            }));
        }
    });

    useEffect(() => {
        // setActionData([
        //     {
        //         icon: <Icon icon={calendarIcon} />,
        //         title: 'Áp lịch cho thiết bị',
        //         onClick: () => navigate(`/playlist-schedule/detail/edit/${id}/apply-schedule`)
        //     }
        // ]);
        setActive(false);
        dispatch(getRecordsAction(''));
    }, []);

    useEffect(() => {
        if (Object.keys(playlist).length <= 0
            || Object.keys(playlistsRecords).length <= 0
            || Object.keys(record).length <= 0) return;

        dispatch(getPlaylistsRecordsDetail({ playlist, playlistsRecords, record }));
    }, [record]);

    useEffect(() => {

    }, []);

    useEffect(() => {
        setItemActive(scheduleFormik.values.playlist);

        console.log("re-render");
        console.log(typeof scheduleFormik.values.playlist !== 'undefined' && scheduleFormik.values.playlist.length > 0);

        typeof scheduleFormik.values.playlist !== 'undefined' && scheduleFormik.values.playlist.length > 0 &&
            scheduleFormik.setFieldValue('newPlaylist',
                playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail => !scheduleFormik.values.playlist.some((playlistDetail: PlaylistScheduleDetail) =>
                    playlistDetail.playlist.playlistId === playlistsRecordsDetail.playlistId)
                ));
    }, [scheduleFormik.values.playlist]);

    useEffect(() => {
        if (typeof playlistSchedule.playlistScheduleDetail === 'undefined' ||
            typeof playlistSchedule.playlistScheduleDetail.playbackTime === 'undefined' ||
            playlistsRecords.playlistsRecordsDetail.length <= 0)
            return;

        const playlistDetailList: Array<PlaylistScheduleDetail> = playlistSchedule.playlistScheduleDetail.playlist.map(playlist => ({
            playbackCycle: playlist.playbackCycle,
            playlist: playlistsRecords.playlistsRecordsDetail.find((playlistDetail: PlaylistRecordDetail) =>
                playlistDetail.playlistId === playlist.playlistDetail.docId) || {} as PlaylistRecordDetail
        }));

        const playbackTimeSplit = playlistSchedule.playlistScheduleDetail.playbackTime.split('-');

        scheduleFormik.setValues({
            ...playlistSchedule.playlistScheduleDetail,
            newPlaylist: playlistsRecords.playlistsRecordsDetail.filter(playlistsRecordsDetail => !playlistDetailList.some(playlistDetail =>
                playlistDetail.playlist.playlistId === playlistsRecordsDetail.playlistId)),
            playlist: playlistDetailList,
            startDate: formatDateYMD(playbackTimeSplit[0].trim()),
            endDate: formatDateYMD(playbackTimeSplit[1].trim()),
        });

        setTitle(playlistSchedule.playlistScheduleDetail.name);
    }, [playlistsRecords.playlistsRecordsDetail]);

    useEffect(() => {
        console.log("re-render-2");

        // scheduleFormik.setFieldValue('playlist', itemActive);
    }, [itemActive]);

    return <CommonPage
        title={title}
        data={itemActive}
        setData={setItemActive}
        newPlaylist={scheduleFormik.values.newPlaylist}
        formik={scheduleFormik}
        action={actionData}
        paging={PAGING_ITEMS}
    />
};

export default EditPlaylistSchedulePage;