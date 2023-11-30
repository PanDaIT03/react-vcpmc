import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { Contract } from "~/component/Contract";
import { Input } from "~/component/Input";
import { OptionMenu } from "~/component/OptionMenu";
import { Tab, Tabs } from "~/component/Tabs";
import { CB_APPROVE_ITEMS } from "~/constants";
import { IGlobalConstantsType } from "~/types";
import { Table } from "~/component/Table";
import { SidebarContext } from "~/context/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getRecordsAction } from "~/state/thunk/record";
import { AudioDialog } from "~/component/AudioDialog";
import { images } from "~/assets";

import styles from "~/sass/Product.module.scss";
const cx = classNames.bind(styles);

const initialState = {
    id: 1,
    title: "Tất cả"
};

export const Product = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { contractCode, contractId } = params;

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [approve, setApprove] = useState<IGlobalConstantsType>(initialState);

    const recordState = useSelector((state: RootState) => state.record);
    const { records, loading } = recordState;
    const [audioSource, setAudioSource] = useState('');

    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClickSearch = () => {
        console.log(searchValue);
    };

    useEffect(() => {
        contractId && dispatch(getRecordsAction(contractId));
        setActive(false);
    }, []);

    console.log(records);

    return (
        <div className={cx("wrapper")}>
            <Contract title={`Hợp đồng uỷ quyền bài hát - ${contractCode}`}>
                <Tabs>
                    <Tab
                        title="Thông tin hợp đồng"
                        pageRef={firstRef}
                        status={"inactive"}
                        onClick={() => navigate(`/contract-management/authorization-contract/${contractCode}`)}
                    />
                    <Tab
                        title="Tác phầm uỷ quyền"
                        pageRef={secondRef}
                        status={"active"}
                    />
                </Tabs>
                <div className={cx("action")}>
                    <div className={cx("filter")}>
                        <OptionMenu
                            title="Tình trạng phê duyệt"
                            data={CB_APPROVE_ITEMS}
                            setState={setApprove}
                        />
                    </div>
                    <div className={cx("search")}>
                        <Input
                            id="search"
                            name="search"
                            value={searchValue}
                            placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
                            size="custom"
                            iconRight={images.search}
                            onChange={(event) => handleChange(event)}
                            onIconRightClick={handleClickSearch}
                        />
                    </div>
                </div>
                <Table
                    className="contract"
                    loading={loading}
                >
                    <tbody>
                        <tr className={cx("product_title")}>
                            <th className={cx("numerical-order", "title")}>STT</th>
                            <th className={cx("record-name", "title")}>Tên bản ghi</th>
                            <th className={cx("isrc-code", "title")}>Mã ISRC</th>
                            <th className={cx("single-name", "title")}>Ca sĩ</th>
                            <th className={cx("authorized", "title")}>Tác giả</th>
                            <th className={cx("download-date", "title")}>Ngày tải</th>
                            <th className={cx("status", "title")}>Tình trạng</th>
                            <th className={cx("listening", "title")}>&nbsp;</th>
                        </tr>
                        {records.map((record, index) => (
                            <tr className={cx("product_item")} key={index}>
                                <td className={cx("numerical-order", "content")}>{index + 1}</td>
                                <td className={cx("record-name", "content")}>
                                    <div className={cx("product-title")}>{record.nameRecord}</div>
                                    <div className={cx("sub-title")}>
                                        <div className={cx("category")}>{record.category}</div>
                                        <img
                                            className={cx("icon")}
                                            src={images.ellipseEffect}
                                        />
                                        <div className={cx("format")}>{record.format}</div>
                                        <img
                                            className={cx("icon")}
                                            src={images.ellipseEffect}
                                        />
                                        <div className={cx("duration")}>{record.time}</div>
                                    </div>
                                </td>
                                <td className={cx("isrc-code", "content")}>{record.ISRCCode}</td>
                                <td className={cx("single-name", "content")}>{record.singer}</td>
                                <td className={cx("authorized", "content")}>{record.author}</td>
                                <td className={cx("download-date", "content")}>{record.createdDate}</td>
                                <td className={cx("status", "content")}>
                                    {CB_APPROVE_ITEMS.map(item => (
                                        item.title === record.status
                                        && <span className={cx("--center-flex")} key={item.id}>
                                            <img className={cx("icon")} src={item.icon} />
                                            <p>{item.title}</p>
                                        </span>
                                    ))}
                                </td>
                                <td
                                    className={cx("listening", "content")}
                                    onClick={() => {
                                        setVisible(true)
                                        setAudioSource(record.audioLink)
                                    }}
                                >
                                    Nghe
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <ActionBar visible={true}>
                    <ActionBarItem
                        title="Chỉnh sửa hợp đồng"
                        icon={images.edit}
                    />
                    <ActionBarItem
                        title="Gia hạn hợp đồng"
                        icon={images.clipboardNotes}
                    />
                    <ActionBarItem
                        title="Huỷ hợp đồng"
                        icon={images.history}
                    />
                    <ActionBarItem
                        title="Thêm bản ghi"
                        icon={images.uPlus}
                    />
                </ActionBar>
                <AudioDialog
                    source="https://res.cloudinary.com/dvlzvsyxs/video/upload/v1701162466/Mat-Troi-Cua-Em-Bae-Remix-JustaTee_ikxrse.mp3"
                    visible={visible}
                    setVisible={setVisible}
                />
            </Contract>
        </div>
    );
};