import classNames from "classnames/bind";
import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";

import styles from "~/sass/EditPlaylist.module.scss";
const cx = classNames.bind(styles);

function EditPlaylistPage() {
    const PAGING_ITEMS: Array<PagingItemType> = [
        {
            title: 'Playlist',
            to: routes.PlaylistPage
        }, {
            title: 'Chi tiết playlist',
            to: ""
        }
    ];

    return (
        <div className={cx('wrapper')}>
            {/* <CommonWrapper
                paging={PAGING_ITEMS}
                title={`PlayList ${playlistDetail.title}`}
            >
                <div className={cx("container")}>
                    <div className={cx("container-left")}>
                        <div
                            className={cx("bg")}
                            style={{
                                backgroundImage: `url(${playlistDetail.imageURL})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                            {isEdit
                                && <div className={cx("upload-icon")}>
                                    <img src={images.moreVertical} alt="upload" />
                                </div>}
                        </div>
                        {isEdit
                            ? <EditPlaylist data={playlistDetail} formik={formik} />
                            : <PlaylistInfo data={playlistDetail} />}
                    </div>
                    <div className={cx("container-right")}>
                        <Table
                            thead={["STT", "Tên bản ghi", "Ca sĩ", "Tác giả", "", ""]}
                        >
                            {playlistDetail.records.map((record, index) => (
                                <tr className={cx("playlist_item")} key={index}>
                                    <td >{index + 1}</td>
                                    <td>
                                        <div>{record.title}</div>
                                        <div className={cx("subtitle")}>
                                            <div>{record.category}</div>
                                            <img src={images.ellipseEffect} alt="icon" />
                                            <div>{record.format}</div>
                                            <img src={images.ellipseEffect} alt="icon" />
                                            <div>{record.time}</div>
                                        </div>
                                    </td>
                                    <td>{record.singer}</td>
                                    <td>{record.author}</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => {
                                            setVisible(true);
                                            setAudioSource(record.audioLink);
                                        }}
                                    >Nghe</td>
                                    <td
                                        className={cx("edit")}
                                        onClick={() => handleClickRemove(record)}
                                    >Gỡ</td>
                                </tr>
                            ))}
                        </Table>
                        {isEdit
                            && <div className={cx("button-actions")}>
                                <Button
                                    primary
                                    size="large"
                                    value="Huỷ"
                                    onClick={() => setIsEdit(false)}
                                />
                                <Button
                                    primary
                                    size="large"
                                    fill
                                    value="Lưu"
                                    buttonType="submit"
                                    onClick={() => formik.handleSubmit()}
                                />
                            </div>}
                    </div>
                </div>
                <ActionBar visible={true}>
                    {!isEdit
                        ? <>
                            <ActionBarItem
                                title="Chỉnh sửa"
                                icon={images.edit}
                                onClick={() => setIsEdit(true)}
                            />
                            <ActionBarItem
                                title="Xóa Playlist"
                                icon={images.trash}
                            />
                        </>
                        : <ActionBarItem
                            title="Thêm Playlist"
                            icon={images.uPlus}
                            onClick={() => navigate(routes.AddPlaylistPage)}
                        />}
                </ActionBar>
                <Dialog
                    primary
                    visible={visible}
                    className={cx("audio")}
                    alignCenter="all"
                >
                    <AudioDialog
                        source={audioSource}
                        setVisible={setVisible}
                    />
                </Dialog>
                <Loading loading={loading} />
            </CommonWrapper> */}
        </div>
    );
};

export default EditPlaylistPage;