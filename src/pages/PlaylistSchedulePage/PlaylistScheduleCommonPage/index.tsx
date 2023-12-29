import classNames from "classnames/bind";
import { ChangeEvent, ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Button from "~/components/Button";
import { RootState } from "~/state";
import { PagingItemType } from "~/components/Paging";
import { IPlaylistRecordDetail } from "~/types/Playlist";
import { CommonWrapper } from "~/components/CommonWrapper";
import { IPlaylistScheduleDetail } from "~/types/PlaylistSchedule";
import { Input } from "~/components/Input";
import { DAYS, DAYSNUM } from "~/constants";
import { Checkbox } from "~/components/Checkbox";
import { ChoosenDay, Time, TimeActive } from "~/types/Time";
import { Loading } from "~/components/Loading";
import { ScheduleTable } from "../ScheduleTable";

import style from '~/sass/PlaylistScheduleCommon.module.scss';
const cx = classNames.bind(style);

interface InputProps {
    fieldName: string;
    name: string;
    type?: "date"
    errorMessage: string;
    value: string;
    touched?: boolean;
    onChange(e: ChangeEvent<any>): void;
    onFocus: () => void;
    onBlur: () => void;
};

interface PlaylistScheduleProps {
    formik: any;
    title: string;
    action: Array<any>;
    paging: Array<PagingItemType>;
    data: Array<IPlaylistScheduleDetail>;
    newPlaylist: Array<IPlaylistRecordDetail>;
    setData: React.Dispatch<React.SetStateAction<IPlaylistScheduleDetail[]>>;
};

interface PlaylistDetailProps {
    data: IPlaylistRecordDetail;
    className?: string;
    style?: any;
    closeActionClick?: () => void;
    onClick?: () => void;
};

interface DialogConfirmProps {
    children: ReactNode;
    className?: string;
    onSubmit?: () => void;
    active: boolean;
    onClose?: () => void;
};

interface TimeBoxProps {
    day: string;
    start: Time;
    end: Time;
    index: number;
    onTimeChange(index: number, start: Time, end: Time): void;
};

const TimeBox = memo(({ day, start, index, end, onTimeChange }: TimeBoxProps) => {
    const [startTime, setStartTime] = useState<Time>({} as Time);
    const [endTime, setEndTime] = useState<Time>({} as Time);

    useEffect(() => {
        setStartTime(start);
        setEndTime(end)
    }, []);

    useEffect(() => {
        onTimeChange(index, startTime, endTime);
    }, [startTime, endTime]);

    return (
        <div className={cx('time-box-container')}>
            <p>{day}</p>
            <div className={cx('time-box-item__time')}>
                <Input name="time1" className={cx('time')} value={startTime.hour || '00'} onChange={(e: any) => setStartTime({ ...startTime, hour: e.target.value })} />
                <span>:</span>
                <Input name="time2" className={cx('time')} value={startTime.minute || '00'} onChange={(e: any) => setStartTime({ ...startTime, minute: e.target.value })} />
                <span>:</span>
                <Input name="time3" className={cx('time')} value={startTime.second || '00'} onChange={(e: any) => setStartTime({ ...startTime, second: e.target.value })} />
                <span> - </span>
                <Input name="time4" className={cx('time')} value={endTime.hour || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
                <span>:</span>
                <Input name="time5" className={cx('time')} value={endTime.minute || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
                <span>:</span>
                <Input name="time6" className={cx('time')} value={endTime.second || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
            </div>
        </div>
    )
});

export const DialogConfirm = memo(({
    children,
    className,
    active,
    onSubmit,
    onClose
}: DialogConfirmProps) => {
    return (
        <div className={cx('dialog-confirm', active && 'active', className)}>
            <div className={cx('dialog-confirm__content')}>{children}</div>
            <div className={cx('dialog-confirm__action-button')}>
                <Button value="Hủy" onClick={onClose} />
                <Button value="Lưu" fill onClick={onSubmit} />
            </div>
        </div>
    );
});

export const PlaylistItem = memo(({
    data,
    className,
    style,
    closeActionClick,
    onClick
}: PlaylistDetailProps) => {
    const { playlist } = data;

    return (
        <div
            className={cx('playlist-item', className)}
            style={style}
            onClick={onClick}
        >
            <div className={cx('playlist-item__title')}>
                <p>{playlist && playlist.title}</p>
            </div>
            <div className={cx('playlist-item__time')}>
                <p>Thời lượng:</p>
                <p>{data.totalTime}</p>
            </div>
            <FontAwesomeIcon
                icon={faXmark}
                className={cx('playlist-item__close-action')}
                onClick={closeActionClick} />
        </div>
    );
});

export const PlaylistScheduleCommonPage = memo(({
    title,
    data,
    formik,
    action,
    paging,
    newPlaylist,
    setData
}: PlaylistScheduleProps) => {
    const { playlistScheduleCode } = useParams();
    const navigate = useNavigate();

    const { loading } = useSelector((state: RootState) => state.playlistSchedule);

    const [playlistChosen, setPlaylistChosen] = useState<IPlaylistRecordDetail>({} as IPlaylistRecordDetail);
    const [itemChosen, setItemChosen] = useState<IPlaylistScheduleDetail>({} as IPlaylistScheduleDetail);
    const [daysChosen, setDaysChosen] = useState<ChoosenDay[]>([] as ChoosenDay[]);

    const [active, setActive] = useState<boolean>(false);
    const [scheduleInput, setScheduleInput] = useState<InputProps[]>([] as InputProps[]);
    const [timeActive, setTimeActive] = useState<TimeActive>({} as TimeActive);

    useEffect(() => {
        setScheduleInput([
            {
                fieldName: "Tên lịch phát:",
                name: 'name',
                value: formik.values.name,
                errorMessage: formik.errors.name,
                touched: formik.touched.name,
                onChange: formik.handleChange,
                onFocus: () => formik.setFieldTouched('name', true),
                onBlur: () => formik.setFieldTouched('name', false)
            }, {
                fieldName: "Từ ngày",
                name: 'startDate',
                type: "date",
                value: formik.values.startDate,
                errorMessage: formik.errors.startDate,
                touched: formik.touched.startDate,
                onChange: formik.handleChange,
                onFocus: () => formik.setFieldTouched('startDate', true),
                onBlur: () => formik.setFieldTouched('startDate', false)
            }, {
                fieldName: "Đến ngày",
                name: 'endDate',
                type: "date",
                value: formik.values.endDate,
                errorMessage: formik.errors.endDate,
                touched: formik.touched.endDate,
                onChange: formik.handleChange,
                onFocus: () => formik.setFieldTouched('endDate', true),
                onBlur: () => formik.setFieldTouched('endDate', false)
            }
        ]);

        setData(formik.values.playlist);
    }, [formik.values]);

    console.log(formik.values);

    const handleRemoveSchedule = ({ time, playlistsId, playbackCycleIndex }: { time: string, playlistsId: string, playbackCycleIndex: number }) => {
        setTimeActive({
            id: playlistsId,
            time: time,
            index: playbackCycleIndex
        });
    };

    const handleSaveChange = useCallback((dayActive: { title: string, checked: boolean }) => {
        setData(data.map(item => {
            if (item.playlist.playlistId === timeActive.id)
                return {
                    ...item,
                    playbackCycle: dayActive.checked === true
                        ? item.playbackCycle.filter(playbackCycle => playbackCycle.day !== dayActive.title)
                        : item.playbackCycle.map(playbackCycle => {
                            if (playbackCycle.day === dayActive.title)
                                return {
                                    ...playbackCycle,
                                    time: playbackCycle.time.filter(time => time !== timeActive.time)
                                }

                            return playbackCycle;
                        })
                }
            return {
                ...item,
                playbackCycle: dayActive.checked === true
                    ? item.playbackCycle.filter(playbackCycle => playbackCycle.day !== dayActive.title)
                    : item.playbackCycle
            }
        }));
    }, [timeActive]);

    const handleTimeChange = (index: number, start: Time, end: Time) => {
        let newDaysChosen = daysChosen;
        newDaysChosen[index] = {
            ...daysChosen[index],
            start: start,
            end: end
        }

        setDaysChosen(newDaysChosen);
        setItemChosen({
            playbackCycle: newDaysChosen.map(dayChosen => ({
                day: dayChosen.day,
                time: [`${dayChosen.start.hour}:${dayChosen.start.minute}:${dayChosen.start.second} - ${dayChosen.end.hour}:${dayChosen.end.minute}:${dayChosen.end.second}`]
            })),
            playlist: playlistChosen
        });
    };

    const handlePlaylistItemClick = (playlist: IPlaylistRecordDetail) => {
        setActive(true);
        setPlaylistChosen(playlist);
    };

    const handleAddPlaylist = () => {
        setActive(false);
        if (daysChosen.length === 0) return;
        setDaysChosen([]);

        let itemExsit = data.find(item => {
            return item.playlist.playlistId === itemChosen.playlist.playlistId
        });

        if (typeof itemExsit === 'undefined')
            setData([...data, itemChosen]);
        else
            setData(data.map(item => {
                if (item.playlist.playlistId === itemChosen.playlist.playlistId)
                    return {
                        ...item,
                        playbackCycle: [...item.playbackCycle, ...itemChosen.playbackCycle]
                    }
                else return item;
            }));

        setItemChosen({} as IPlaylistScheduleDetail);
    };

    const handleCancleDialog = () => {
        setActive(false);
        setDaysChosen([]);
        setItemChosen({} as IPlaylistScheduleDetail);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                paging={paging}
                title={title}
            >
                <form className={cx('content')} onSubmit={formik.handleSubmit}>
                    <div className={cx('content__left')}>
                        <div className={cx('schedule-information')}>
                            <p>Thông tin lịch phát</p>
                            {scheduleInput.map((input: InputProps) => <Input size="custom" key={input.name} {...input} />)}
                        </div>
                        <div className={cx('playlist')}>
                            <div className={cx('playlist__current')}>
                                <p>Danh sách Playlist</p>
                                {formik.values.playlist.map((playlist: IPlaylistScheduleDetail, index: number) =>
                                    <PlaylistItem
                                        key={index}
                                        data={playlist.playlist}
                                        onClick={() => handlePlaylistItemClick(playlist.playlist)}
                                    />)}
                            </div>
                            <div className={cx('playlist__new')}>
                                <p>Playlist mới</p>
                                {newPlaylist.map((playlist, index) =>
                                    <PlaylistItem
                                        key={index}
                                        data={playlist}
                                        onClick={() => handlePlaylistItemClick(playlist)}
                                    />)}
                            </div>
                        </div>
                    </div>
                    <div className={cx('content__right')}>
                        <ScheduleTable
                            data={{
                                id: formik.values.id,
                                data: data
                            }}
                            onRemoveItem={handleRemoveSchedule}
                            saveChange={handleSaveChange}
                        />
                        <div className={cx('action')}>
                            <Button value="Hủy" onClick={() => navigate(`/playlist-schedule/detail/${playlistScheduleCode}`)} />
                            <Button fill value="Lưu" buttonType='submit' />
                        </div>
                    </div>
                </form>
                <DialogConfirm
                    className={cx('playlist-schedule-edit__dialog')}
                    active={active}
                    onClose={handleCancleDialog}
                    onSubmit={handleAddPlaylist}
                >
                    <p>{Object.keys(playlistChosen).length > 0 && playlistChosen.playlist.title}</p>
                    <p>Lặp lại trong tuần</p>
                    <div className={cx('dialog__choose-days')}>
                        {DAYSNUM.map((day, index) => {
                            let checked = typeof daysChosen.find((dayChosen: ChoosenDay) => dayChosen.day === day) !== 'undefined' ? true : false;

                            return <Checkbox
                                key={day}
                                className={cx('table__body__dialog__checkbox')}
                                label={DAYS[index]}
                                checked={checked}
                                onClick={() => {
                                    checked
                                        ? setDaysChosen(daysChosen.filter(dayChosen => dayChosen.day !== day))
                                        : setDaysChosen([...daysChosen, {
                                            day: day, start: {
                                                hour: '06',
                                                minute: '00',
                                                second: '00'
                                            }, end: {
                                                hour: '08',
                                                minute: '00',
                                                second: '00'
                                            }
                                        }])
                                }}
                            />
                        })}
                    </div>
                    {daysChosen.length > 0 && <div className={cx('dialog__choose-times')}>
                        {daysChosen.map((dayChosen, index) => {
                            const { day, start, end } = dayChosen;

                            return <TimeBox
                                key={index}
                                index={index}
                                day={day}
                                start={start}
                                end={end}
                                onTimeChange={handleTimeChange}
                            />
                        })}
                    </div>}
                </DialogConfirm>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
});