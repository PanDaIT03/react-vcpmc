import classNames from "classnames/bind";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Button from "../Button";
import { Input } from "../Input";
import { images } from "~/assets";
import { Checkbox } from "../Checkbox";
import { Upload } from "../Upload";
import { BlockDetail } from "../BlockDetail";
import { IGlobalConstantsType } from "~/types";
import { CAPABILITY, formatDateDMY, formatDateYMD, regexOnlyNumer, theFollowingDays } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { editContractAction } from "~/state/thunk/contract";
import { Loading } from "../Loading";
import moment from "moment";

import styles from "~/sass/RenewalAuthorization.module.scss";
const cx = classNames.bind(styles);

interface RenewalAuthorizationProps {
    title: string
    from: string
    ownerShips: IGlobalConstantsType[]
    contractId: string
    className?: string
    setVisible: Dispatch<SetStateAction<boolean>>
};

export const RenewalAuthorization = ({
    title,
    from,
    ownerShips,
    contractId,
    className,
    setVisible
}: RenewalAuthorizationProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", {
        [className]: className,
    });

    const dispatch = useAppDispatch();
    const contractState = useSelector((state: RootState) => state.contract);
    const { loading } = contractState;

    const [checked, setChecked] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);

    const [toDate, setTodate] = useState('');
    const [performer, setPerformer] = useState("50");
    const [author, setAuthor] = useState("0");

    const [fileAttach, setFileAttach] = useState<IGlobalConstantsType[]>([]);
    const [capability, setCapability] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);

    const authorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setChecked(true);

        setFileAttach([
            {
                id: 1,
                title: "",
                value: [
                    {
                        id: 1,
                        icon: images.iconFileWord,
                        title: "hetthuongcannho.doc"
                    },
                    {
                        id: 2,
                        icon: images.iconFile,
                        title: "hetthuongcannho.doc"
                    }
                ]
            }
        ]);
    }, []);

    useEffect(() => {
        console.log(ownerShips);

    }, [ownerShips])

    useEffect(() => {
        console.log(capability, capability.length);
    }, [capability]);

    useEffect(() => {
        !checked ? setCapability([]) : setCapability(CAPABILITY);
    }, [checked]);

    useEffect(() => {
        if (isAuthor) authorRef.current?.focus();
    }, [isAuthor]);

    const handleCheckbox = (item: IGlobalConstantsType, isChecked: boolean) => {
        isChecked
            ? capability.length > 1 && setCapability(() => capability.filter(i => i.id !== item.id))
            : setCapability([...capability, { ...item }]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { };

    return (
        <div className={classes}>
            <h2 className={cx("title")}>{title}</h2>
            <div className={cx("content")}>
                <div className={cx("content_top")}>
                    <div className={cx("left")}>
                        <div className={cx("left_title")}>
                            <h3>Thời gian gia hạn</h3>
                            <img src={images.force} alt="force" />
                        </div>
                        <div className={cx("from")}>Từ ngày: {theFollowingDays(from, 1)}</div>
                        <div className={cx("to")}>
                            <span>Đến ngày:</span>
                            <div className={cx("calendar-picker")}>
                                <Input
                                    name="calendar"
                                    value={toDate}
                                    type="date"
                                    size="custom"
                                    min={formatDateYMD(theFollowingDays(from, 1) || "")}
                                    onChange={(event) => setTodate(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx("note")}>Lưu ý: Thời gian bắt đầu gia hạn hợp đồng mới được tính sau ngày hết hạn hợp đồng cũ một ngày.</div>
                    </div>
                    <div className={cx("right")}>
                        <div className={cx("right_title")}>
                            <h3>Mức nhuận bút</h3>
                            <img src={images.force} alt="force" />
                        </div>
                        <div className={cx("content")}>
                            <div className={cx("content_row")}>
                                <Checkbox
                                    checked={isAuthor}
                                    visible={true}
                                    label="Quyền tác giả"
                                    onClick={() => setIsAuthor(!isAuthor)}
                                />
                                <div className={cx("author")}>
                                    <Input
                                        className={cx(!isAuthor ? "inactive" : "active")}
                                        name="author"
                                        size="custom"
                                        value={author}
                                        inputRef={authorRef}
                                        onChange={(event) => {
                                            console.log(event.target.value);

                                            if (regexOnlyNumer(event.target.value))
                                                setAuthor(event.target.value)
                                        }}
                                    />
                                </div>
                                <p>%</p>
                            </div>
                            <div className={cx("items", "content_row")}>
                                <Checkbox
                                    checked={checked}
                                    visible={true}
                                    label="Quyền liên quan"
                                />
                                <div className={cx("item")}>
                                    <p className={cx("line")}></p>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.2rem"
                                    }}>
                                        {CAPABILITY.map(item => {
                                            const isItemExisted = capability.filter(i => i.id === item.id);
                                            const isChecked = isItemExisted.length > 0;

                                            return (
                                                <div className={cx("content_row")} key={item.id}>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        visible={true}
                                                        label={item.title}
                                                        labelMaxWidth="217"
                                                        onClick={() => handleCheckbox(item, isChecked)}
                                                    />
                                                    <div className={cx("author")}>
                                                        <Input
                                                            className={cx(!isChecked ? "inactive" : "active")}
                                                            value={performer}
                                                            name="author"
                                                            size="custom"
                                                            onChange={(event) => handleChange(event)}
                                                        />
                                                    </div>
                                                    <p>%</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx("content_bottom")}>
                    <div className={cx("content_bottom_left")}>
                        <h3>Đính kèm tệp:</h3>
                    </div>
                    <div className={cx("content_bottom_right")}>
                        <Upload />
                        <BlockDetail data={fileAttach} />
                    </div>
                </div>
            </div>
            <div className={cx("actions")}>
                <Button primary size="large" value="Huỷ" onClick={() => setVisible(false)} />
                <Button
                    primary
                    size="large"
                    fill
                    value="Lưu"
                    onClick={() => {
                        toDate !== ""
                            && dispatch(editContractAction({ date: formatDateDMY(toDate) || "", status: "Còn thời hạn", id: contractId }));
                    }}
                />
            </div>
            {loading && <Loading loading={loading} />}
        </div>
    );
};