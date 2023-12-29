import classNames from "classnames/bind";
import { memo, useEffect, useState } from "react";

import { DAYS, DAYSNUM } from "~/constants";
import { Loading } from "~/components/Loading";
import { Checkbox } from "~/components/Checkbox";
import { IPlaylistScheduleDetail } from "~/types/PlaylistSchedule";
import { DialogConfirm, PlaylistItem } from "../PlaylistScheduleCommonPage";

import style from '~/sass/ScheduleTable.module.scss';
import { images } from "~/assets";
const cx = classNames.bind(style);

interface OnRemove {
    day: string;
    time: string;
    playlistsId: string;
    playbackCycleIndex: number;
};

interface ScheduleTableProps {
    data: {
        data: Array<IPlaylistScheduleDetail>;
        id: string;
    },
    onRemoveItem({ day, time, playlistsId, playbackCycleIndex }: OnRemove): void;
    saveChange({ title, checked }: { title: string, checked: boolean }): void;
};

export const ScheduleTable = memo(({
    data,
    onRemoveItem,
    saveChange
}: ScheduleTableProps) => {
    // const scheduleDevice = useSelector((state: RootState) => state.scheduleDevice);

    const [hours, setHours] = useState<string[]>([] as string[]);
    const [currentDay, setCurrentDay] = useState<number>(-1);
    const [dayActive, setDayActive] = useState<{ title: string, checked: boolean }>({} as { title: string, checked: boolean });
    const [itemActive, setItemActive] = useState<Array<IPlaylistScheduleDetail>>([] as Array<IPlaylistScheduleDetail>);
    const [active, setActive] = useState<boolean>(false);
    const [daysActive, setDaysActive] = useState<{ day: string, index: number }[]>([] as { day: string, index: number }[]);

    useEffect(() => {
        let hoursInDay: string[] = [];
        let date = new Date();
        setCurrentDay(date.getDay());

        for (let i = 1; i < 25; i++) {
            if (i <= 10)
                hoursInDay.push(`0${i}:00`);
            else
                hoursInDay.push(`${i}:00`);
        }

        setHours(hoursInDay);
    }, []);

    useEffect(() => {
        setItemActive(data.data);
    }, [data]);

    const handleChangeDay = () => {
        setDayActive({ ...dayActive, checked: !dayActive.checked });
    }

    const handleRemoveSchedule = ({ day, time, playlistsId, playbackCycleIndex }: OnRemove) => {
        setDayActive({ title: day, checked: false });
        onRemoveItem({ day, time, playlistsId, playbackCycleIndex });
        setActive(true);
    }

    const handleSaveChange = () => {
        saveChange({ ...dayActive });
        setActive(false);
    }

    return (
        <div className={cx('table')}>
            <div className={cx('table__head')}>
                <div></div>
                {DAYS.map((day, index) => {
                    let dayIndex = currentDay - 1;
                    if (dayIndex === -1) dayIndex = 6;

                    return <div
                        key={day}
                        className={cx(index === dayIndex && 'active')}
                    >
                        <p>{day} {index === dayIndex
                            && <span className={cx("today")}>
                                <span><img src={images.ellipseNew} alt="today" /></span>
                                <span>Hôm nay</span>
                            </span>
                        }</p>
                        {daysActive.map((day, index) =>
                            typeof DAYSNUM.find(dayNum => dayNum === day.day) !== 'undefined'
                            && <div
                                key={index}
                                className={cx('schedule-active')}
                                style={{ left: `calc((166.5px) * ${day.index + 1} + 24px)` }}>
                            </div>
                        )}
                    </div>
                })}
            </div>
            <div className={cx('table__body')}>
                <div className={cx('table__body__hour')}><p></p></div>
                {hours.map(hour =>
                    <div key={hour} className={cx('table__body__hour')}><p>{hour}</p></div>
                )}
                <div className={cx('table__body__schedule')}>
                    {itemActive.length && itemActive.map(item =>
                        item.playbackCycle.map((playback, playbackCycleIndex) => {
                            let day = playback.day;
                            let leftIndex = DAYSNUM.indexOf(day);

                            if (typeof daysActive.find(dayActive => dayActive.day === day) === 'undefined')
                                setDaysActive([...daysActive, { day: day, index: leftIndex }]);

                            return playback.time.map((time, index) => {
                                let timeArray = time.split('-');
                                let timeArrayStart = timeArray[0].split(':');
                                let topIndex = hours.indexOf(`${timeArrayStart[0]}:${timeArrayStart[1]}`);
                                let timeArrayEnd = timeArray[1].split(':');
                                let widthIndex = hours.indexOf(`${timeArrayEnd[0].trim()}:${timeArrayEnd[1].trim()}`) - topIndex;

                                return <div key={index}>
                                    <PlaylistItem
                                        style={{
                                            top: `calc((47px * ${topIndex + 1}) + 10px)`,
                                            left: `calc(166.88px * ${leftIndex + 1})`,
                                            height: `calc(47px * ${widthIndex})`
                                        }}
                                        className={cx('table__body__schedule__playlist', `${time}, ${leftIndex}, ${topIndex}, ${widthIndex}`)}
                                        data={item.playlist}
                                        closeActionClick={() => handleRemoveSchedule({
                                            day: day,
                                            time: time,
                                            playlistsId: item.playlist.playlistId,
                                            playbackCycleIndex: playbackCycleIndex
                                        })}
                                    />
                                </div>
                            })
                        })
                    )}
                </div>
                <DialogConfirm
                    className={cx('table__body__dialog')}
                    active={active}
                    onClose={() => setActive(false)}
                    onSubmit={handleSaveChange}
                >
                    <p>Xóa lịch phát</p>
                    <p>Xóa tất cả lịch phát trong ngày </p>
                    <Checkbox
                        className={cx('table__body__dialog__checkbox')}
                        label={dayActive.title}
                        checked={dayActive.checked}
                        onClick={handleChangeDay}
                    />
                </DialogConfirm>
            </div>
            <Loading loading={false} />
        </div>
    );
});
