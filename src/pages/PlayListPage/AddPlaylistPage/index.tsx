import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import * as Yup from "yup";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { ActionBarItem } from "~/components/ActionBar/ActionBarItem";
import { AudioDialog } from "~/components/AudioDialog";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Dialog } from "~/components/Dialog";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { Upload } from "~/components/Upload";
import { routes } from "~/config/routes";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";
import { RootState, useAppDispatch } from "~/state";
import { IRecord } from "~/types";
import Button from "~/components/Button";
import { getCurrentDateDMY, getTotalMoment } from "~/constants";
import { IPLaylist } from "~/types/Playlist";
import { addPlaylistAction } from "~/state/thunk/playlist";
import { Loading } from "~/components/Loading";

import styles from "~/sass/AddPlaylist.module.scss";
const cx = classNames.bind(styles);

interface InitType {
    title: string
    imageURL: string
    description: string
    topics: string
    records: IRecord[]
    isPublic: boolean
};

const initialValues: InitType = {
    title: 'Nhạc Tết 2024',
    imageURL: 'https://res.cloudinary.com/dis180ycw/image/upload/v1701317096/pexels-daniel-reche-3721941_n2uhdn.jpg',
    description: '',
    topics: '',
    records: [],
    isPublic: true
};

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: 'Playlist',
        to: routes.PlaylistPage
    }, {
        title: 'Thêm playlist mới',
        to: "#"
    }
];

function AddPlaylistPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive } = useContext(SidebarContext);
    const [visible, setVisible] = useState(false);
    const [audioSource, setAudioSource] = useState("");

    const { loading, status } = useSelector((state: RootState) => state.playlist);
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { newRecords } = useSelector((state: RootState) => state.record);
    const [newPlaylistRecords, setNewPlaylistRecords] = useState<IRecord[]>([]);

    const { errors, values, touched, handleChange, handleSubmit, setFieldTouched, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup.string().required()
        }),
        onSubmit: values => {
            const { title, imageURL, description, records, isPublic } = values;
            let categories: string[] = [];

            records.forEach(record => categories.push(record.categoriesId));
            const categoriesId = categories.filter((category, index) =>
                categories.indexOf(category) === index
            );

            const data: Omit<IPLaylist, "categories" | "docId" | "playlistsRecordsId"> = {
                title: title,
                records: records,
                categoriesId: categoriesId,
                createdBy: currentUser.docId,
                createdDate: getCurrentDateDMY(),
                description: description,
                imageURL: imageURL,
                mode: isPublic ? "public" : "private",
            };

            dispatch(addPlaylistAction(data));
        }
    });
    const { title, description, topics, isPublic } = values;

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        if (status === "insert successfully")
            navigate(routes.PlaylistPage);
    }, [status]);

    useEffect(() => {
        if (!visible) setAudioSource('');
    }, [visible]);

    useEffect(() => {
        setNewPlaylistRecords(newRecords || []);
    }, [newRecords]);

    useEffect(() => {
        setFieldValue("records", newPlaylistRecords);
    }, [newPlaylistRecords]);

    const totalPlaylistTime = (records: IRecord[]) => {
        let timeArray: string[] = ["00:00"];

        records.map((record) => timeArray.push(record.time));
        let total = getTotalMoment(timeArray);
        return total.slice(11, 19);
    };

    const handleClickAddPlaylistsRecords = () => {
        localStorage.setItem('fromPage', routes.AddPlaylistPage);
        navigate(routes.AddPlaylistRecordPage);
    };

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title="Thêm Playlist"
                paging={PAGING_ITEMS}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <div className={cx("playlist-background")}>
                            <div className={cx("title")}>Ảnh bìa:</div>
                            <Upload />
                        </div>
                        <div className={cx("line")}></div>
                        <div className={cx("title-primary")}>
                            <Input
                                id="title"
                                type='text'
                                name='title'
                                title='Tiêu đề'
                                isRequire={true}
                                size="custom"
                                value={title}
                                errorMessage={errors.title}
                                touched={touched.title}
                                onChange={handleChange}
                                onFocus={() => setFieldTouched('title', true)}
                                onBlur={() => setFieldTouched('title', false)}
                            />
                        </div>
                        <div className={cx("line")}></div>
                        <div className={cx("total-record")}>
                            <p>Tổng số:</p>
                            <p>{newPlaylistRecords.length}</p>
                        </div>
                        <div className={cx("total-time")}>
                            <div className={cx("title")}>Tổng thời lượng:</div>
                            <div className={cx("content")}>
                                {newPlaylistRecords.length > 0
                                    ? totalPlaylistTime(newPlaylistRecords)
                                    : <p>--:--:--</p>}
                            </div>
                        </div>
                        <div className={cx("line")}></div>
                        <div className={cx("description")}>
                            <Input
                                as="textarea"
                                id="description"
                                type='text'
                                name='description'
                                title='Mô tả'
                                size="custom"
                                className={cx("description")}
                                value={description}
                                errorMessage={errors.description}
                                touched={touched.description}
                                onChange={handleChange}
                                onFocus={() => setFieldTouched('description', true)}
                                onBlur={() => setFieldTouched('description', false)}
                            />
                        </div>
                        <div className={cx("line")}></div>
                        <div className={cx("topics")}>
                            <Input
                                as="textarea"
                                id="topics"
                                type='text'
                                name='topics'
                                title='Chủ đề'
                                size="custom"
                                placeholder="Nhập chủ đề"
                                className={cx("description")}
                                value={topics}
                                errorMessage={errors.topics}
                                touched={touched.topics}
                                onChange={handleChange}
                                onFocus={() => setFieldTouched('topics', true)}
                                onBlur={() => setFieldTouched('topics', false)}
                            />
                        </div>
                        <div className={cx("public")}>
                            <Switch
                                id="switch"
                                onColor="#347AFF"
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onChange={() => setFieldValue("isPublic", !isPublic)}
                                checked={isPublic}
                            />
                            <label htmlFor="switch">Chế độ công khai</label>
                        </div>
                    </div>
                    <div className={cx("container-right")}>
                        <Table thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả"]}>
                            {newPlaylistRecords.length <= 0
                                ? <tr>
                                    <td
                                        className={cx("reminder")}
                                        colSpan={4}
                                    >
                                        <div className={cx("content")}>
                                            <p>Vui lòng chọn bản ghi để thêm vào Playlist</p>
                                            <img src={images.force} alt="force" />
                                        </div>
                                    </td>
                                </tr>
                                : newPlaylistRecords?.map((record, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{record.title}</td>
                                        <td>{record.singer}</td>
                                        <td>{record.author}</td>
                                        <td>{record.author}</td>
                                        <td>{record.author}</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => {
                                                setVisible(true);
                                                setAudioSource(record.audioLink);
                                            }}
                                        >Nghe</td>
                                        <td
                                            className={cx("action")}
                                            onClick={() => setNewPlaylistRecords(newPlaylistRecords.filter(item => item.title !== record.title))}
                                        >Gỡ</td>
                                    </tr>
                                ))}
                        </Table>
                        <div className={cx("button-actions")}>
                            <Button
                                primary
                                size="large"
                                value="Huỷ"
                                onClick={() => navigate(routes.PlaylistPage)}
                            />
                            <Button
                                primary
                                size="large"
                                fill
                                value="Lưu"
                                buttonType="submit"
                                onClick={() => handleSubmit()}
                            />
                        </div>
                    </div>
                </div>
                <Dialog
                    primary
                    visible={visible}
                    content="audio"
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setVisible}
                    />
                </Dialog>
                <ActionBar>
                    <ActionBarItem
                        title="Thêm bản ghi"
                        icon={images.uPlus}
                        onClick={handleClickAddPlaylistsRecords}
                    />
                </ActionBar>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default AddPlaylistPage;