import classNames from "classnames/bind";
import { memo } from "react";

import { images } from "~/assets";
import { IPLaylist } from "~/types/Playlist";
import { IRecord } from "~/types";
import { getTotalMoment } from "~/constants";

import style from '~/sass/PlaylistInfo.module.scss';
const cx = classNames.bind(style);

interface PlaylistDetailProps {
    data: IPLaylist
    className?: string
};

export const PlaylistInfo = memo(({
    data,
    className
}: PlaylistDetailProps) => {
    if (!className) className = "";

    const classes = cx('wrapper', {
        [className]: className
    });

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    return (
        <div className={classes}>
            <div className={cx("container")}>
                <div className={cx("title-primary")}>
                    <h2>{data.title}</h2>
                </div>
                <div className={cx("line")}></div>
                <div className={cx("infomation-records")}>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Người tạo:</div>
                        <div className={cx("content")}>{data.createdBy}</div>
                    </div>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Tổng số:</div>
                        <div className={cx("content")}>{data.records.length}</div>
                    </div>
                    <div className={cx("row")}>
                        <div className={cx("title")}>Tổng thời lượng:</div>
                        <div className={cx("content")}>{totalPlaylistTime(data.records)}</div>
                    </div>
                </div>
                <div className={cx("line")}></div>
                <div className={cx("description")}>{data.description}</div>
                <div className={cx("line")}></div>
                <div className={cx("topics")}>
                    <div className={cx("topic-item")}>
                        <img src={images.ellipseEffect} alt="effect" />
                        <p>Chủ đề 1</p>
                    </div>
                    <div className={cx("topic-item")}>
                        <img src={images.ellipseEffect} alt="effect" />
                        <p>Chủ đề 2</p>
                    </div>
                    <div className={cx("topic-item")}>
                        <img src={images.ellipseEffect} alt="effect" />
                        <p>Chủ đề 3</p>
                    </div>
                </div>
                <div className={cx("line")}></div>
                <div className={cx("actions")}>
                    <div className={cx("show", "item")}>
                        <img src={images.publicIcon} alt="public" />
                        <p>Hiển thị ở chế độ công khai</p>
                    </div>
                    <div className={cx("random", "item", "--cursor-pointer")}>
                        <div className={cx("circle")}>
                            <img src={images.randomIcon} alt="random" />
                        </div>
                        <p>Phát ngẫu nhiên</p>
                    </div>
                    <div className={cx("repeat", "item", "--cursor-pointer")}>
                        <div className={cx("circle")}>
                            <img src={images.repeat} alt="repeat" />
                        </div>
                        <p>Lặp lại</p>
                    </div>
                </div>
            </div>
        </div>
    );
});