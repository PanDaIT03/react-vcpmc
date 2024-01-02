import { useNavigate, useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "~/state";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { images } from "~/assets";
import { routes } from "~/config/routes";
import { IGlobalConstantsType, IRecord } from "~/types";
import { formatDateYMD, getTotalMoment } from "~/constants";
import { PagingItemType } from "~/components/Paging";
import { IPLaylist, IPlaylistRecordDetail } from "~/types/Playlist";
import { IPlaylistSchedule, IPlaylistScheduleDetail } from "~/types/PlaylistSchedule";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { PlaylistScheduleCommonPage } from "../PlaylistScheduleCommonPage";
import { getPlayListAction } from "~/state/thunk/playlist";

function EditPlaylistSchedulePage() {
    const { playlistScheduleCode } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const PAGING_ITEMS: PagingItemType[] = [
        {
            title: 'Lập lịch phát',
            to: routes.PlaylistSchedulePage,
        }, {
            title: 'Chi tiết',
            to: `/playlist-schedule/detail/${playlistScheduleCode}`,
        }, {
            title: 'Chỉnh sửa lịch phát',
            to: '#',
        }
    ];

    const { playList } = useSelector((state: RootState) => state.playlist);
    const { playlistSchedules } = useSelector((state: RootState) => state.playlistSchedule);

    const [playlistScheduleDetails, setPlaylistScheduleDetails] = useState<IPlaylistSchedule>();

    const { setActive } = useContext(SidebarContext);
    const [actions, setActions] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);
    const [itemActive, setItemActive] = useState<IPlaylistScheduleDetail[]>([] as IPlaylistScheduleDetail[]);
    const [title, setTitle] = useState<string>('');

    const scheduleFormik = useFormik({
        initialValues: {
            id: '',
            name: '',
            playbackTime: '',
            playlist: [] as Array<IPlaylistScheduleDetail>,
            newPlaylist: [] as Array<IPlaylistRecordDetail>,
            startDate: '',
            endDate: ''
        },
        validationSchema: Yup.object({
            startDate: Yup.string().required(),
            endDate: Yup.string().required(),
            name: Yup.string().required()
        }),
        onSubmit: values => {
            // let playlists = itemActive.map((item: IPlaylistScheduleDetail) => ({
            //     playbackCycle: item.playbackCycle.filter((playbackCycle) => playbackCycle.time.length > 0),
            //     playlistsId: item.playlist.playlistId
            // }));

            // let playbackTime = `${formatDateDMYHPTS(values.startDate)} - ${formatDateDMYHPTS(values.endDate)}`;

            console.log(values);
            // console.log(playlists);
            // console.log(playbackTime);
            // dispatch(savePlaylistSchedule({
            //     id: values.id,
            //     playlistsIds: playlists.filter(playlist => playlist.playbackCycle.length > 0),
            //     navigate: () => navigate('/playlist-schedule'),
            //     name: values.name,
            //     playbackTime: playbackTime
            // }));
        }
    });
    const { values, setValues } = scheduleFormik;

    console.log(playlistSchedules);

    useEffect(() => {
        if (playlistSchedules.length <= 0)
            navigate(routes.PlaylistSchedulePage);

        setActive(false);
        setActions([
            {
                id: 1,
                title: 'Áp lịch cho thiết bị',
                icon: images.calendarAltOrange
            }
        ]);

        dispatch(getPlayListAction());
    }, []);

    useEffect(() => {
        setPlaylistScheduleDetails(
            playlistSchedules.find(item => item.docId === playlistScheduleCode)
            || {} as IPlaylistSchedule);
    }, playlistSchedules);

    useEffect(() => {
        if (typeof playlistScheduleDetails !== "undefined") {
            const playlistDetails = playList.filter(playlist =>
                playlistScheduleDetails.playlistsIds.some(item => item.playlistsId === playlist.docId)) || {} as IPLaylist;

            const playlist = playList.filter(playlist => !playlistDetails.some(item => item.docId === playlist.docId));

            console.log(playlistDetails);
            console.log(playlist);

            // const playlistDetails: IPlaylistScheduleDetail[] = playlistScheduleDetails.playlistsIds.map(item => ({
            //     playbackCycle: item.playbackCycle,
            //     playlist: {
            //         playlist: playlist,
            //         quantity: playlist.records.length,
            //         totalTime: totalPlaylistTime(playlist.records),
            //         playlistId: playlist.docId,
            //         playlistRecordId: playlist.playlistsRecordsId
            //     }
            // })),
            //     playbackTimeSplit = playlistScheduleDetails.playbackTime.split('-'),
            //     newPlaylist =

            //         setValues({
            //             id: playlistScheduleDetails.docId,
            //             name: playlistScheduleDetails.name,
            //             playbackTime: playlistScheduleDetails.playbackTime,
            //             playlist: playlistDetails,
            //             newPlaylist: newPlaylist,
            //             startDate: formatDateYMD(playbackTimeSplit[0].trim()),
            //             endDate: formatDateYMD(playbackTimeSplit[1].trim())
            //         });
        }
    }, [playlistScheduleDetails]);

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    return (
        <PlaylistScheduleCommonPage
            title={title}
            data={itemActive}
            setData={setItemActive}
            newPlaylist={scheduleFormik.values.newPlaylist}
            formik={scheduleFormik}
            action={actions}
            paging={PAGING_ITEMS}
        />
    );
};

export default EditPlaylistSchedulePage;