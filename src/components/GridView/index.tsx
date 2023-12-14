import classNames from "classnames/bind";
import { Dispatch, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IGlobalConstantsType, IRecord } from "~/types";
import { BoxItem } from "../BoxItem";
import { images } from "~/assets";
import { Checkbox } from "../Checkbox";

import styles from "~/sass/GridView.module.scss";
const cx = classNames.bind(styles);

interface GridViewProps {
    records: IRecord[]
    className?: string
    isApprove?: boolean
    approveArray?: IRecord[]
    setAudioSource: Dispatch<React.SetStateAction<string>>
    setState: Dispatch<React.SetStateAction<boolean>>
    handleClickApprove(record: IRecord, isChecked: boolean): void
};

interface GridItemProps {
    record: IRecord
    className?: string
    isApprove?: boolean
    approveArray: IRecord[]
    setAudioSource: Dispatch<React.SetStateAction<string>>
    setState: Dispatch<React.SetStateAction<boolean>>
    handleClickApprove(record: IRecord, isChecked: boolean): void
};

const GridItem = memo(({
    record,
    className,
    isApprove,
    approveArray,
    setAudioSource,
    setState,
    handleClickApprove
}: GridItemProps) => {
    if (!className) className = "";

    const navigate = useNavigate();

    const classes = cx("item-wrapper", {
        [className]: className,
        isApprove
    });

    const [isChecked, setIsChecked] = useState(false);
    const [boxItem, setBoxItem] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);

    useEffect(() => {
        console.log(approveArray);

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

    useEffect(() => {
        let isItemExisted = approveArray.filter(item => item.docId === record.docId);
        setIsChecked(isItemExisted.length > 0);
    }, [approveArray]);

    return (
        <div
            className={classes}
            onClick={() => handleClickApprove(record, isChecked)}
        >
            <div
                className={cx("background")}
                style={{
                    height: "100%",
                    backgroundImage: `url(${record.imageURL})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
                onClick={() => {
                    if (!isApprove) {
                        setState(true);
                        setAudioSource(record.audioLink);
                    };
                }}
            >
                <div className={cx("pause")}>
                    <img src={images.polygon1} alt="pause" />
                </div>
            </div>
            <div className={cx("item-content")}>
                <div className={cx("content-top")}>
                    <div className={cx("primary")}>
                        <div className={cx("title-primary")}><h2>{record.nameRecord}</h2></div>
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
                <div className={cx("content-bottom")}>
                    {isApprove
                        ? <Checkbox checked={isChecked} />
                        : <img src={images.edit} alt="edit" onClick={() => navigate(`/record/edit/${record.docId}`)} />}
                </div>
            </div>
        </div>
    );
});

export const GridView = memo(({
    records,
    className,
    isApprove = false,
    approveArray = [],
    setAudioSource,
    setState,
    handleClickApprove
}: GridViewProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className
    });

    return (
        <div className={classes}>
            {records.map((item, index) => (
                <div key={index} className={cx("grid-item")}>
                    <GridItem
                        record={item}
                        isApprove={isApprove}
                        approveArray={approveArray}
                        setAudioSource={setAudioSource}
                        setState={setState}
                        handleClickApprove={handleClickApprove}
                    />
                </div>
            ))}
        </div>
    );
});