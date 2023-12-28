import classNames from "classnames/bind";
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "~/state";
import { routes } from "~/config/routes";
import { PagingItemType } from "~/components/Paging";
import { CommonWrapper } from "~/components/CommonWrapper";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { IPlaylistSchedule } from "~/types/PlaylistSchedule";
import { Loading } from "~/components/Loading";
import { Input } from "~/components/Input";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { images } from "~/assets";
import { Table } from "~/components/Table";

import styles from "~/sass/EditPlaylistSchedule.module.scss";
const cx = classNames.bind(styles);

const initialState: IPlaylistSchedule = {
    docId: "",
    name: "",
    playbackTime: "",
    playlistsIds: [],
    devices: []
};

function EditPlaylistSchedulePage() {
    const { setActive } = useContext(SidebarContext);
    const { playlistScheduleCode } = useParams();

    const { playlistSchedules, loading } = useSelector((state: RootState) => state.playlistSchedule);
    const [playlistScheduleDetails, setPlaylistScheduleDetails] = useState<IPlaylistSchedule>(initialState);

    const PAGING_ITEMS: Array<PagingItemType> = [
        {
            title: "Lập lịch phát",
            to: routes.PlaylistSchedulePage
        }, {
            title: "Chi tiết",
            to: `/playlist-schedule/detail/${playlistScheduleCode}`
        }, {
            title: "Chỉnh sửa lịch phát",
            to: "#"
        }
    ];

    const theadArray = ["", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];
    const hoursArray: Array<string> = [];

    for (let index = 1; index <= 24; index++) {
        if (index < 10)
            hoursArray.push(`0${index}:00`);
        else
            hoursArray.push(`${index}:00`);
    };

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        setPlaylistScheduleDetails(playlistSchedules.find(playlistSchedule =>
            playlistSchedule.docId === playlistScheduleCode) || initialState
        );
    }, [playlistSchedules]);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title={playlistScheduleDetails.name}
                paging={PAGING_ITEMS}
            >
                <div className={cx("content")}>
                    <div className={cx("content-left")}>
                        <div className={cx("top")}>
                            <div className={cx("title")}>Thông tin lịch phát</div>
                            <Input
                                id="playlistScheduleName"
                                name="playlistScheduleName"
                                value="Lịch phát số 1"
                                title="Tên lịch phát"
                                size="custom"
                            />
                            <Input
                                id="playlistScheduleName"
                                name="playlistScheduleName"
                                value="22/10/2023"
                                title="Từ ngày"
                                size="custom"
                                type="date"
                                border="orange-4-default"
                            />
                            <Input
                                id="playlistScheduleName"
                                name="playlistScheduleName"
                                value="22/10/2023"
                                title="Đến ngày"
                                size="custom"
                                type="date"
                                border="orange-4-default"
                            />
                        </div>
                        <div className={cx("bottom")}>
                            <div className={cx("bottom_content")}>
                                <div className={cx("title")}>Danh sách Playlist</div>
                                <div className={cx("playlist")}>
                                    <div className={cx("item")}>
                                        <div className={cx("item_title")}>Top USUK</div>
                                        <div className={cx("duration")}>
                                            <p>Thời lượng:</p>
                                            <div className={cx("duration_content")}>02:00:00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx("playlist", "line")}>
                                    <div className={cx("title")}>Playlist mới</div>
                                    <div className={cx("item")}>
                                        <div className={cx("item_title")}>Top USUK</div>
                                        <div className={cx("duration")}>
                                            <p>Thời lượng:</p>
                                            <div className={cx("duration_content")}>02:00:00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx("playlist", "line")}>
                                    <div className={cx("title")}>Playlist đề xuất</div>
                                    <div className={cx("item")}>
                                        <div className={cx("item_title")}>Top USUK</div>
                                        <div className={cx("duration")}>
                                            <p>Thời lượng:</p>
                                            <div className={cx("duration_content")}>02:00:00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx("content-right")}>
                        <div className={cx("playlist-schedule")}>
                            <div className={cx("schedule_title")}>
                                {theadArray.map((item, index) => (
                                    <div
                                        className={cx("schedule_item", item === "" && "null")}
                                        key={index}
                                    >{item}</div>
                                ))}
                            </div>
                            <div className={cx("schedule_content")}>
                                {hoursArray.map((item, index) => (
                                    <div key={index} className={cx("item_content")}>
                                        <p>{item}</p>
                                        <div className={cx("row-line")}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Loading loading={loading} />
                <ActionBar>
                    <ActionBarItem
                        title="Áp lịch cho thiết bị"
                        icon={images.calendarAltOrange}
                    />
                </ActionBar>
            </CommonWrapper>
        </div>
    );
};

export default EditPlaylistSchedulePage;