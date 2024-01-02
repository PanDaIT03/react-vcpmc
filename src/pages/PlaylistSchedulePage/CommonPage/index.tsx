import classNames from "classnames/bind";
import React, { ChangeEvent, ReactNode, memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { RootState } from "~/state";
import { PlaylistScheduleDetail } from "~/types/PlaylistSchedule";
import { PlaylistRecordDetail } from "~/types/PlaylistsRecords";
import { TimeActive } from "~/types/Time";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { DAYS, DAYSNUM } from "~/constants";

import style from '~/sass/CommonPlaylistSchedule.module.scss';
import { PlaylistScheduleTable } from "../PLaylistScheduleTable";
const cx = classNames.bind(style);

interface InputProps {
    fieldName: string;
    name: string;
    type?: 'text' | 'date';
    size: 'custom';
    errorMessage: string;
    value: string;
    touched?: boolean;
    onChange(e: ChangeEvent<any>): void;
    onFocus: () => void;
    onBlur: () => void;
};

interface Time {
    hour: string;
    minute: string;
    second: string;
};

interface ChoosenDay {
    day: string;
    start: Time;
    end: Time;
};

interface CommonPlaylistSchedulePageProps {
    title: string;
    data: Array<PlaylistScheduleDetail>;
    setData: React.Dispatch<React.SetStateAction<PlaylistScheduleDetail[]>>;
    formik: any;
    action: Array<any>;
    paging: Array<PagingItemType>;
    newPlaylist: Array<PlaylistRecordDetail>;
};

interface PlaylistDetailProps {
    data: PlaylistRecordDetail;
    className?: string;
    style?: any;
    closeActionClick?: () => void;
    onClick?: () => void;
};

interface DialogConfirmProps {
    children: ReactNode;
    className?: string;
    active: boolean;
    onSubmit?: () => void;
    onClose?: () => void;
};

interface TimeBoxProps {
    day: string;
    start: Time;
    end: Time;
    index: number;
    onTimeChange(index: number, start: Time, end: Time): void;
};

export const DialogConfirm = memo(({ children, className, onSubmit, onClose, active }: DialogConfirmProps) => {
    return (
        <div className={cx('dialog-confirm', active && 'active', className)}>
            <div className={cx('dialog-confirm__content')}>{children}</div>
            <div className={cx('dialog-confirm__action-button')}>
                <Button size="large" value='Hủy' onClick={onClose} />
                <Button fill size="large" value='Lưu' onClick={onSubmit} />
            </div>
        </div>
    );
});

export const PlaylistItem = memo(({ data, className, style, closeActionClick, onClick }: PlaylistDetailProps) => {
    const { playlist } = data;

    console.log(data);

    return (
        <div className={cx('playlist-item', className)} style={style} onClick={onClick}>
            <div className={cx('playlist-item__title')}><p>{playlist && playlist.title}</p></div>
            <div className={cx('playlist-item__time')}>
                <p>Thời lượng:</p>
                <p>{data.totalTime}</p>
            </div>
            <FontAwesomeIcon icon={faXmark} className={cx('playlist-item__close-action')} onClick={closeActionClick} />
        </div>
    );
});

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
                <Input name='input1' className={cx('time')} value={startTime.hour || '00'} onChange={(e: any) => setStartTime({ ...startTime, hour: e.target.value })} />
                <span>:</span>
                <Input name='input2' className={cx('time')} value={startTime.minute || '00'} onChange={(e: any) => setStartTime({ ...startTime, minute: e.target.value })} />
                <span>:</span>
                <Input name='input3' className={cx('time')} value={startTime.second || '00'} onChange={(e: any) => setStartTime({ ...startTime, second: e.target.value })} />
                <span> - </span>
                <Input name='input4' className={cx('time')} value={endTime.hour || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
                <span>:</span>
                <Input name='input5' className={cx('time')} value={endTime.minute || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
                <span>:</span>
                <Input name='input6' className={cx('time')} value={endTime.second || '00'} onChange={(e: any) => setEndTime({ ...endTime, hour: e.target.value })} />
            </div>
        </div>
    );
});

function CommonPage({
    title,
    data,
    formik,
    action,
    paging,
    newPlaylist,
    setData
}: CommonPlaylistSchedulePageProps) {
    const { playlistScheduleCode } = useParams();
    const navigate = useNavigate();

    const playlistSchedule = useSelector((state: RootState) => state.playlistSchedule);

    const [scheduleInput, setScheduleInput] = useState<InputProps[]>([] as InputProps[]);
    const [timeActive, setTimeActive] = useState<TimeActive>({} as TimeActive);
    const [active, setActive] = useState<boolean>(false);
    const [daysChosen, setDaysChosen] = useState<ChoosenDay[]>([] as ChoosenDay[]);
    const [playlistChosen, setPlaylistChosen] = useState<PlaylistRecordDetail>({} as PlaylistRecordDetail);
    const [itemChosen, setItemChosen] = useState<PlaylistScheduleDetail>({} as PlaylistScheduleDetail);

    useEffect(() => {
        console.log(formik.values.playlist);

        setScheduleInput([
            {
                fieldName: "Tên lịch phát:",
                name: 'name',
                size: 'custom',
                value: formik.values.name,
                errorMessage: formik.errors.name,
                touched: formik.touched.name,
                onChange: formik.handleChange,
                onFocus: () => formik.setFieldTouched('name', true),
                onBlur: () => formik.setFieldTouched('name', false)
            }, {
                fieldName: "Từ ngày",
                name: 'startDate',
                size: 'custom',
                type: 'date',
                value: formik.values.startDate,
                errorMessage: formik.errors.startDate,
                touched: formik.touched.startDate,
                onChange: formik.handleChange,
                onFocus: () => formik.setFieldTouched('startDate', true),
                onBlur: () => formik.setFieldTouched('startDate', false)
            }, {
                fieldName: "Đến ngày",
                name: 'endDate',
                size: 'custom',
                type: 'date',
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

    const handlePlaylistItemClick = (playlist: PlaylistRecordDetail) => {
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

        setItemChosen({} as PlaylistScheduleDetail);
    };

    const handleCancleDialog = () => {
        setActive(false);
        setDaysChosen([]);
        setItemChosen({} as PlaylistScheduleDetail);
    };

    return (
        <div className={cx('playlist-schedule-edit')}>
            <CommonWrapper
                paging={paging}
                title={title}
            >
                <form className={cx('content')} onSubmit={formik.handleSubmit}>
                    <div className={cx('content__left')}>
                        <div className={cx('schedule-information')}>
                            <p>Thông tin lịch phát</p>
                            {scheduleInput.map((input: InputProps) => <Input key={input.name} {...input} />)}
                        </div>
                        <div className={cx('playlist')}>
                            <div className={cx('playlist__current')}>
                                <p>Danh sách Playlist</p>
                                {formik.values.playlist.map((playlist: PlaylistScheduleDetail, index: number) =>
                                    <PlaylistItem
                                        key={index}
                                        data={playlist.playlist}
                                        onClick={() => handlePlaylistItemClick(playlist.playlist)}
                                    />)}
                            </div>
                            <div className={cx('playlist__new')}>
                                <p>Playlist mới</p>
                                {newPlaylist.map((playlist: PlaylistRecordDetail) =>
                                    <PlaylistItem
                                        key={playlist.playlistId}
                                        data={playlist}
                                        onClick={() => handlePlaylistItemClick(playlist)}
                                    />)}
                            </div>
                        </div>
                    </div>
                    <div className={cx('content__right')}>
                        <PlaylistScheduleTable
                            data={{
                                id: formik.values.id,
                                data: data
                            }}
                            onRemoveItem={handleRemoveSchedule}
                            saveChange={handleSaveChange}
                        />
                        <div className={cx('action')}>
                            <Button value='Hủy' onClick={() => navigate(`/playlist-schedule/detail/${playlistScheduleCode}`)} />
                            <Button buttonType='submit' value='Lưu' fill />
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
                    <p className={cx("description")}>Lặp lại trong tuần</p>
                    <div className={cx('dialog__choose-days')}>
                        {DAYSNUM.map((day, index) => {
                            let checked = typeof daysChosen.find((dayChosen: ChoosenDay) => dayChosen.day === day) !== 'undefined' ? true : false;

                            return <Checkbox
                                key={index}
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
                    {daysChosen.length > 0
                        && <div className={cx('dialog__choose-times')}>
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
                <Loading loading={playlistSchedule.loading} />
            </CommonWrapper>
        </div>
    );
};

export default CommonPage;