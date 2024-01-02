import classNames from "classnames/bind";
import { Dispatch, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BoxItem } from "../BoxItem";
import { images } from "~/assets";
import { Checkbox } from "../Checkbox";
import { IPLaylist } from "~/types/PlaylistType";
import { getTotalMoment } from "~/constants";
import { IGlobalConstantsType, IRecord } from "~/types";

import styles from "~/sass/GridView.module.scss";
const cx = classNames.bind(styles);

interface GridViewProps {
    data: any[]
    className?: string
    isApprove?: boolean
    approveArray?: IRecord[]
    type?: "record" | "playlist"
    setAudioSource?: Dispatch<React.SetStateAction<string>>
    setState?: Dispatch<React.SetStateAction<boolean>>
    handleClick(record: IRecord, isChecked: boolean): void
};

const GridRecord = memo(({
    record,
    isApprove,
    isChecked
}: { record: IRecord, isChecked: boolean }
    & Omit<GridViewProps, "data" | "handleClick">) => {
    const navigate = useNavigate();

    const [boxItem, setBoxItem] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);

    useEffect(() => {
        setBoxItem([
            {
                id: 1,
                title: "Thể loại",
                value: record.category
            }, {
                id: 2,
                title: "Định dạng",
                value: record.format
            }, {
                id: 3,
                title: "Thời lượng",
                value: record.time
            }
        ]);
    }, [record]);

    return (
        <>
            <div className={cx("content-left")}>
                <div className={cx("primary")}>
                    <div className={cx("title-primary")}>
                        <h2>{record.title}</h2>
                    </div>
                    <div className={cx("sub-title")}>
                        <div className={cx("singer")}>
                            <span className={cx("title")}>Ca sĩ:</span>
                            <span className={cx("content")}>{record.singer}</span>
                        </div>
                        <div className={cx("author")}>
                            <span className={cx("title")}>Sáng tác:</span>
                            <span className={cx("content")}>{record.author}</span>
                        </div>
                        <div className={cx("contract")}>
                            <span className={cx("title")}>Số hợp đồng:</span>
                            <span className={cx("content")}>{record.contract?.contractCode}</span>
                        </div>
                    </div>
                </div>
                <div className={cx("bottom")}>
                    <BoxItem data={boxItem} />
                </div>
            </div>
            <div className={cx("content-right")}>
                {isApprove
                    ? <Checkbox checked={isChecked} />
                    : <img
                        src={images.edit}
                        alt="edit"
                        onClick={() => navigate(`/record/edit/${record.docId}`)}
                    />}
            </div>
        </>
    );
});

const GridPlaylist = memo(({
    playlist,
    onClick
}: { playlist: IPLaylist, onClick: () => void }) => {
    const navigate = useNavigate();

    const [boxItem, setBoxItem] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);
    const [boxItem2, setBoxItem2] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    useEffect(() => {
        playlist.categories.map(
            (category, index) => setBoxItem([{ id: index + 1, value: category }])
        );
        setBoxItem2([
            {
                id: 1,
                title: "Số bản ghi",
                value: playlist.records.length.toString()
            }, {
                id: 2,
                title: "Thời lượng",
                value: totalPlaylistTime(playlist.records).toString()
            }
        ])
    }, [playlist]);

    return (
        <>
            <div className={cx("content-left")}>
                <div className={cx("primary")}>
                    <div className={cx("title-primary")}>
                        <h2>{playlist.title}</h2>
                    </div>
                </div>
                <div className={cx("box-item")}>
                    <BoxItem data={boxItem} />
                </div>
                <div className={cx("info")}>
                    <div className={cx("created")}>
                        <span className={cx("title")}>Người tạo:</span>
                        <span className={cx("content")}>{playlist.createdBy}</span>
                    </div>
                    <div className={cx("date-created")}>
                        <span className={cx("title")}>Ngày tạo:</span>
                        <span className={cx("content")}>{playlist.createdDate}</span>
                    </div>
                </div>
                <div className={cx("bottom")}>
                    <BoxItem data={boxItem2} />
                </div>
            </div>
            <div className={cx("content-right")}>
                <img
                    src={images.alertCircle}
                    alt="alert circle"
                    onClick={() => navigate(`/playlist/detail/${playlist.docId}`)}
                />
            </div>
        </>
    );
});

const GridItem = memo(({
    item,
    isApprove,
    approveArray,
    type,
    setAudioSource,
    setState,
    handleClick
}: { item: any, approveArray: IRecord[] }
    & Omit<GridViewProps, "data" | "approveArray" | "className">) => {
    const navigate = useNavigate();
    const classes = cx("item-wrapper", {
        isApprove
    });

    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        let isItemExisted = approveArray.filter(i => i.docId === item.docId);
        setIsChecked(isItemExisted.length > 0);
    }, [approveArray]);

    return (
        <div
            className={classes}
            onClick={() => handleClick(item, isChecked)}
        >
            <div
                className={cx("background")}
                style={{
                    height: "100%",
                    backgroundImage: `url(${item.imageURL})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                onClick={() => {
                    if (!isApprove) {
                        setState && setState(true);
                        setAudioSource && setAudioSource(item.audioLink);
                    };
                }}
            >
                {type === "record"
                    && <div className={cx("pause")}>
                        <img src={images.polygon1} alt="pause" />
                    </div>}
            </div>
            <div className={cx("item-content")}>
                {type === "record"
                    ? <GridRecord
                        record={item}
                        isApprove={isApprove}
                        isChecked={isChecked}
                    />
                    : <GridPlaylist
                        playlist={item}
                        onClick={() => navigate(`/playlist/detail/${item.docId}`)}
                    />}
            </div>
        </div>
    );
});

export const GridView = memo(({
    data,
    className,
    isApprove = false,
    approveArray = [],
    type = "record",
    setAudioSource,
    setState,
    handleClick
}: GridViewProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            {data.map((item, index) => (
                <div key={index} className={cx("grid-item")}>
                    <GridItem
                        item={item}
                        isApprove={isApprove}
                        approveArray={approveArray}
                        type={type}
                        setAudioSource={setAudioSource && setAudioSource}
                        setState={setState && setState}
                        handleClick={handleClick}
                    />
                </div>
            ))}
        </div>
    );
});