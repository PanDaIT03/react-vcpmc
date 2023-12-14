import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { CommonWrapper } from "~/components/CommonWrapper";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { RootState, useAppDispatch } from "~/state";
import { Loading } from "~/components/Loading";
import { IGlobalConstantsType, IRecord } from "~/types";
import { images } from "~/assets";
import { Input } from "~/components/Input";
import { Form } from "~/components/Form";
import { OptionMenu } from "~/components/OptionMenu";
import Button from "~/components/Button";
import { updateRecordAction } from "~/state/thunk/record";
import { VALIDITY_CONTRACT_ITEMS, CB_MUSIC_KIND, formatDateMDY, getCurrentDate } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext.index";

import styles from "~/sass/EditRecord.module.scss";
const cx = classNames.bind(styles);

interface InitType {
    docId: string
    nameRecord: string
    ISRCCode: string
    singer: string
    author: string
    producer: string
    category: string
};

const PAGING_ITEMS: Array<PagingItemType> = [
    {
        title: "Kho bản ghi",
        to: routes.RecordPage
    }, {
        title: "Cập nhật thông tin",
        to: "#"
    }
];

const initialValues: InitType = {
    docId: "",
    nameRecord: "",
    ISRCCode: "",
    singer: "",
    author: "",
    producer: "",
    category: ""
};

const initialFormat = {
    id: 0,
    title: ""
};

const CB_MUSIC_KIND_WITHOUT_ALL = CB_MUSIC_KIND.filter(item => item.title !== "Tất cả");

function EditRecordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { recordId } = params;

    const recordState = useSelector((state: RootState) => state.record);
    const { records, loading } = recordState;

    const { setCurrentPage } = useContext(SidebarContext);
    const [record, setRecord] = useState<IRecord>({} as IRecord);
    const [kind, setKind] = useState<IGlobalConstantsType>(CB_MUSIC_KIND_WITHOUT_ALL[1]);
    const [recordInput, setRecordInput] = useState<IGlobalConstantsType[]>([] as IGlobalConstantsType[]);

    const {
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        setFieldTouched,
        setFieldValue,
        setValues } = useFormik({
            initialValues: initialValues,
            validationSchema: Yup.object({
                docId: Yup.string().required(),
                nameRecord: Yup.string().required(),
                ISRCCode: Yup.string().required(),
                singer: Yup.string().required(),
                author: Yup.string().required(),
                producer: Yup.string().required(),
                category: Yup.string().required()
            }),
            onSubmit: values => {
                dispatch(updateRecordAction(values)).then(() => navigate(routes.RecordPage));
            }
        });
    const { nameRecord, ISRCCode, singer, author, producer } = values;

    useEffect(() => {
        if (Object.keys(records).length <= 0)
            navigate(routes.RecordPage);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        const record = records.find(record => recordId === record.docId);
        setRecord(record || {} as IRecord);
    }, [records]);

    useEffect(() => {
        if (Object.keys(record).length <= 0) return;

        setValues({
            docId: recordId || "",
            nameRecord: record.nameRecord,
            ISRCCode: record.ISRCCode,
            singer: record.singer,
            author: record.author,
            producer: record.producer,
            category: record.category || ""
        } || initialValues);

        setKind(CB_MUSIC_KIND_WITHOUT_ALL.find(item => item.title.toLowerCase() === record.category?.toLowerCase())
            || initialFormat);
    }, [record]);

    useEffect(() => {
        setRecordInput([
            {
                id: 1,
                tag: <Input
                    id="nameRecord"
                    type='text'
                    name='nameRecord'
                    title='Tên bản ghi'
                    size="custom"
                    value={nameRecord}
                    errorMessage={errors.nameRecord}
                    touched={touched.nameRecord}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('nameRecord', true)}
                    onBlur={() => setFieldTouched('nameRecord', false)}
                />
            }, {
                id: 2,
                tag: <Input
                    id="ISRCCode"
                    type='text'
                    name='ISRCCode'
                    title='Mã ISRC'
                    size="custom"
                    value={ISRCCode}
                    errorMessage={errors.ISRCCode}
                    touched={touched.ISRCCode}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('ISRCCode', true)}
                    onBlur={() => setFieldTouched('ISRCCode', false)}
                />
            }, {
                id: 3,
                tag: <Input
                    id="singer"
                    type='text'
                    name='singer'
                    title='Ca sĩ'
                    size="custom"
                    value={singer}
                    errorMessage={errors.singer}
                    touched={touched.singer}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('singer', true)}
                    onBlur={() => setFieldTouched('singer', false)}
                />
            }, {
                id: 4,
                tag: <Input
                    id="author"
                    type='text'
                    name='author'
                    title='Tác giả'
                    size="custom"
                    value={author}
                    errorMessage={errors.author}
                    touched={touched.author}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('author', true)}
                    onBlur={() => setFieldTouched('author', false)}
                />
            }, {
                id: 5,
                tag: <Input
                    id="producer"
                    type='text'
                    name='producer'
                    title='Nhà sản xuất'
                    size="custom"
                    value={producer}
                    errorMessage={errors.producer}
                    touched={touched.producer}
                    onChange={handleChange}
                    onFocus={() => setFieldTouched('producer', true)}
                    onBlur={() => setFieldTouched('producer', false)}
                />
            }, {
                id: 6,
                tag: <OptionMenu
                    title="Thể loại"
                    titlePosition="top"
                    data={CB_MUSIC_KIND_WITHOUT_ALL}
                    boxSize="extra-extra-large"
                    borderColor="var(--text-stroke-text-and-stroke-2)"
                    className={cx("format")}
                    state={kind}
                    setState={setKind}
                />
            }
        ]);
    }, [values, errors]);

    useEffect(() => {
        setFieldValue("category", kind.title);
    }, [kind]);

    return (
        <div className={cx("wrapper")}>
            <CommonWrapper
                title={`Bản ghi - ${record.nameRecord}`}
                paging={PAGING_ITEMS}
            >
                <div className={cx("content")}>
                    <div className={cx("content_left")}>
                        <div className={cx("top")}>
                            <div className={cx("title-primary")}>Thông tin bản ghi</div>
                            <div
                                className={cx("avatar")}
                                style={{
                                    backgroundImage: `url(${record.imageURL})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover'
                                }}
                            >
                                <div className={cx("camera")}>
                                    <img src={images.camera} alt="avatar" />
                                </div>
                            </div>
                            <div className={cx("file-name")}>
                                <img src={images.musicIcon} alt="music icon" />
                                <p>Matem.mp3</p>
                            </div>
                            <div className={cx("detail")}>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Ngày thêm:</div>
                                    <div className={cx("text")}>{record.createdDate}</div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Người tải lên:</div>
                                    <div className={cx("text")}>Super Admin</div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Người duyệt:</div>
                                    <div className={cx("text")}>
                                        Hệ thống
                                        <br />
                                        Tự động phê duyệt
                                    </div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Ngày phê duyệt:</div>
                                    <div className={cx("text")}>{record.approvalDate}</div>
                                </div>
                            </div>
                        </div>
                        <div className={cx("bottom")}>
                            <div className={cx("title-primary")}>Thông tin ủy quyền</div>
                            <div className={cx("detail")}>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Số hợp đồng:</div>
                                    <div className={cx("text")}>{record.contract?.contractCode}</div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Ngày nhận ủy quyền:</div>
                                    <div className={cx("text")}>{record.approvalDate}</div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Ngày hết hạn:</div>
                                    <div className={cx("text")}>{record.contract?.expirationDate}</div>
                                </div>
                                <div className={cx("detail_item")}>
                                    <div className={cx("title")}>Trạng thái:</div>
                                    <div className={cx("text")}>
                                        {VALIDITY_CONTRACT_ITEMS.map(item => {
                                            let expiryDateRecord = new Date(formatDateMDY(record.expirationDate || ""));
                                            let currentDate = new Date(getCurrentDate());
                                            let status = !(expiryDateRecord < currentDate) ? "Còn thời hạn" : "Hết hạn";

                                            return (
                                                status === item.title
                                                && <div key={item.id} className={cx("status")}>
                                                    <img src={item.icon} alt="icon" />
                                                    <p>{item.title}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx("content_right")}>
                        <div className={cx("title-primary")}>Chỉnh sửa thông tin</div>
                        <Form
                            className={cx("edit-record")}
                            handleFormSubmit={handleSubmit}
                        >
                            {recordInput.map((item, index) => (
                                <div key={index} className={cx("item")}>{item.tag}</div>
                            ))}
                        </Form>
                    </div>
                </div>
                <div className={cx("actions")}>
                    <Button primary size="large" value="Huỷ" onClick={() => navigate(routes.RecordPage)} />
                    <Button
                        fill
                        primary
                        size="large"
                        value="Lưu"
                        buttonType="submit"
                        onClick={() => handleSubmit()}
                    />
                </div>
                <Loading loading={loading} />
            </CommonWrapper>
        </div>
    );
};

export default EditRecordPage;