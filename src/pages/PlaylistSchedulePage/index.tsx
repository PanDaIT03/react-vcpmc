import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Table } from "~/components/Table";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getScheduleList } from "~/state/thunk/playlistSchedule";
import { IGlobalConstantsType } from "~/types";
import { PlaylistSchedule } from "~/types/PlaylistSchedule";

import style from '~/sass/PlaylistSchedule.module.scss';
const cx = classNames.bind(style);

function PlaylistSchedulePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { setCurrentPage } = useContext(SidebarContext);
    const { listSchedule } = useSelector((state: RootState) => state.playlistSchedule);

    const [itemsPerPage, setItemsPerPage] = useState('8');
    const [currentItems, setCurrentItems] = useState<PlaylistSchedule[]>([]);
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);

    useEffect(() => {
        setCurrentPage(3);
        setActionbar([{
            icon: images.addPlaylistIcon,
            title: "Thêm lịch phát"
        }]);

        dispatch(getScheduleList());
    }, []);

    const handleNavigate = (id: string) => {
        navigate(`/playlist-schedule/detail/${id}`);
    };

    const handleCurrentItems = (items: any[]) => {
        setCurrentItems(items);
    };

    const handleItemsPerPage = (value: string) => {
        setItemsPerPage(value);
    };

    return (
        <div className={cx('wrapper')}>
            <CommonWrapper title='Danh sách lịch phát'>
                <Table
                    paginate={{
                        dataForPaginate: listSchedule,
                        setCurrentItems: handleCurrentItems
                    }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleItemsPerPage}
                    className={cx("playlist-schedule")}
                    thead={['STT', 'Tên lịch', 'Thời gian phát', '', '']}
                >
                    {currentItems.map((item: PlaylistSchedule, index) => (
                        <tr key={index} style={{ height: '47px' }} className={cx('content')}>
                            <td><p>{index + 1}</p></td>
                            <td><p>{item.name}</p></td>
                            <td><p>{item.playbackTime}</p></td>
                            <td><p className={cx('action')} onClick={() => handleNavigate(item.id)}>Xem chi tiết</p></td>
                            <td><p className={cx('action')} onClick={() => { }}>Xóa</p></td>
                        </tr>
                    ))}
                </Table>
                <ActionBar data={actionbar} />
            </CommonWrapper>
        </div>
    );
};

export default PlaylistSchedulePage;