import classNames from "classnames/bind";
import { useFormik } from "formik";
import { ReactNode, memo, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { Toast } from "~/components/Toast";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getFeedbacks, sendFeedback } from "~/state/thunk/feedback";
import { IFeedback } from "~/types/Feedback";

import style from '~/sass/Feedback.module.scss';
const cx = classNames.bind(style);

interface FeedbackInputProps {
    title: string;
    input: ReactNode;
};

interface FeedbackItemProps {
    data: IFeedback;
    className?: string;
};

const PAGING_ITEMS: PagingItemType[] = [
    {
        title: 'Hỗ trợ',
        to: '#',
        active: true
    }, {
        title: 'Feedback',
        to: '#',
        active: true
    }
];

const FeedbackItem = memo(({ data, className }: FeedbackItemProps) => {
    return (
        <div className={cx('feedbacks__item', className)}>
            <div className={cx('feedbacks__item__avatar')}>
                <img
                    src={data.user.avatar}
                    alt='avatar'
                    style={{ width: "56px", height: "56px" }} />
            </div>
            <div className={cx('feedbacks__item__content')}>
                <div className={cx('item__content__header')}>
                    <span>{data.userName}</span>
                    <span>{data.dateTime}</span>
                </div>
                <div className={cx('item__content__content')}>
                    <span>Chủ đề: {data.problem} - {data.content}</span>
                </div>
            </div>
        </div>
    );
});

function FeedbackPage() {
    const dispatch = useAppDispatch();

    const user = useSelector((state: RootState) => state.user);
    const feedback = useSelector((state: RootState) => state.feedback);

    const { setActive, setCurrentPage } = useContext(SidebarContext);
    const [itemsPerPage, setItemsPerPage] = useState<string>('7');
    const [activeToast, setActiveToast] = useState<boolean>(false);

    const [feedbacks, setFeedbacks] = useState<IFeedback[]>([] as IFeedback[]);
    const [currentItems, setCurrentItems] = useState<IFeedback[]>([] as IFeedback[]);
    const [feedbackActive, setFeedbackActive] = useState<IFeedback>({} as IFeedback);

    const feedbackFormik = useFormik({
        initialValues: {
            userName: '',
            typeProblem: '',
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Euismod iaculis metus, nisl risus urna morbi risus. Blandit tempor, ac eu ut volutpat adipiscing aliquam. Habitasse a semper cras non. Laoreet nibh et, erat sit curabitur sapien, commodo.
            Accumsan eget ut blandit sed. Tortor ultrices id amet non sit facilisis auctor phasellus nisl. Bibendum et ultrices consequat luctus interdum elementum. Leo pellentesque nulla lectus adipiscing risus, bibendum. Iaculis porttitor ornare sit nisl. Tellus lectus amet mattis sed at. Nisi augue congue ac faucibus nunc. Sed maecenas mus at urna at. Aliquet sagittis, enim egestas tincidunt leo eu. Libero nunc montes, facilisis ullamcorper scelerisque turpis.
            Pulvinar in amet donec sed. Neque hac eget mi est eleifend arcu ut sodales in. Turpis augue ut sodales scelerisque nunc. Amet, odio eu sed eleifend lorem nulla varius lorem mattis. Mi facilisi duis rutrum arcu sed aliquam cursus. Viverra sit ut congue dictum. Feugiat et, vitae nulla amet. Velit purus velit convallis non duis nunc cursus quam pulvinar.
            Vitae libero quisque tortor at amet facilisis enim et, ut. Aliquet ullamcorper risus vitae sapien morbi. Nascetur dui pulvinar urna convallis mi suspendisse cursus elementum ornare. Amet eget maecenas nunc duis. Arcu sollicitudin eget sollicitudin lectus turpis. Molestie ullamcorper amet felis et sed massa rhoncus.
            Orci ipsum est, viverra ultricies porttitor sed volutpat eu. Sit vulputate ut at suspendisse elementum non ullamcorper. Lorem condimentum id diam auctor. At ut augue in amet, cursus at quis odio tellus. Pulvinar in commodo mattis facilisis lacus nunc blandit mattis sit. A porttitor velit tempor, pharetra sem non amet. Purus porta habitant tempor etiam rhoncus vitae amet, vulputate. Sed nisl sodales ullamcorper suspendisse id massa. `
        },
        validationSchema: Yup.object({
            userName: Yup.string().required(),
            typeProblem: Yup.string().required(),
            content: Yup.string().required(),
        }),
        onSubmit: async values => {
            const currentDate = new Date();

            await dispatch(sendFeedback({
                userName: values.userName,
                content: values.content,
                problem: values.typeProblem,
                usersId: user.currentUser.docId,
                dateTime: `${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
            }));

            setActiveToast(true);
        }
    })

    useEffect(() => {
        setActive(true);
        setCurrentPage(7);
        dispatch(getFeedbacks());
    }, []);

    useEffect(() => {
        setFeedbacks(feedback.feedbacks);
    }, [feedback]);

    useEffect(() => {
        if (user.currentUser) feedbackFormik.setFieldValue('userName', user.currentUser.firstName.concat(' ', user.currentUser.lastName));
    }, [user.currentUser]);

    const handleOnItemClick = useCallback((problem: any) => {
        feedbackFormik.setFieldValue('typeProblem', problem.title);
    }, []);

    const feedbackInputs: Array<FeedbackInputProps> = [
        {
            title: '',
            input: <Input
                title={'Tên người dùng'}
                name={'userName'}
                size="custom"
                value={feedbackFormik.values.userName}
                errorMessage={feedbackFormik.errors.userName}
                touched={feedbackFormik.touched.userName}
                onChange={feedbackFormik.handleChange}
                onFocus={() => feedbackFormik.setFieldTouched('userName', true)}
                onBlur={() => feedbackFormik.setFieldTouched('userName', false)}
            />
        }, {
            title: 'Bạn muốn được hỗ trợ vấn đề gì?',
            input: <OptionMenu
                boxSize="custom"
                borderColor="var(--text-stroke-text-and-stroke-2)"
                data={[
                    { id: 1, title: 'Tài khoản' },
                    { id: 2, title: 'Quản lý doanh thu' },
                    { id: 3, title: 'Vấn đề bản quyền' },
                    { id: 4, title: 'Khác' },
                ]}
                className={cx('form__body__combobox-problem-type', feedbackFormik.errors.typeProblem && 'invalid')}
            />
        }, {
            title: '',
            input: <Input
                title={'Nội dung'}
                as='textarea'
                size="custom"
                placeholder='Nhập nội dung'
                name={'content'}
                cols={66}
                rows={11}
                className={cx("content-textare")}
                value={feedbackFormik.values.content}
                errorMessage={feedbackFormik.errors.content}
                touched={feedbackFormik.touched.content}
                onChange={feedbackFormik.handleChange}
                onFocus={() => feedbackFormik.setFieldTouched('content', true)}
                onBlur={() => feedbackFormik.setFieldTouched('content', false)}
            />
        }
    ];

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    console.log(feedback.feedbacks);
    console.log(currentItems);
    console.log(user.currentUser);

    return (
        <CommonWrapper
            title='Feedback'
            paging={PAGING_ITEMS}
            className={cx('support-feedback')}
        >
            {user.currentUser.role && user.currentUser.role === 'User'
                ? <>
                    <Form
                        handleFormSubmit={feedbackFormik.handleSubmit}
                        className={cx('support-feedback__form')}
                    >
                        <div className={cx('form__body')}>
                            {feedbackInputs.map((input, index) => (
                                <div key={index} className={cx("title")}>
                                    <p>{input.title}</p>
                                    <p className={cx("content")}>{input.input}</p>
                                </div>
                            ))}
                        </div>
                        <div className={cx('form__footer')}>
                            <Button primary fill value="Gửi" buttonType='submit' />
                        </div>
                    </Form>
                    <Toast
                        message='Gửi feedback thành công'
                        visible={activeToast} />
                </>
                : <div className={cx('support-feedback-container')}>
                    <Table
                        // paginate={{
                        //     dataForPaginate: feedbacks,
                        //     setCurrentItems: handleSetCurrentItems
                        // }}
                        // itemsPerPage={itemsPerPage}
                        // setItemsPerPage={setItemsPerPage}
                        className={cx('container__feedbacks')}
                        thead={['Danh mục hướng dẫn']}
                    >
                        {feedbacks.map((feedback, index) =>
                            <tr key={index} onClick={() => setFeedbackActive(feedback)}>
                                <td style={{ height: '80px' }}>
                                    {typeof feedback !== "undefined"
                                        && <FeedbackItem
                                            data={feedback}
                                            className={cx(feedback.docId === feedbackActive.docId && 'active')}
                                        />}
                                </td>
                            </tr>
                        )}
                    </Table>
                    <div className={cx('container__feedbacks-detail')}>
                        {feedbackActive && feedbackActive.user
                            && <>
                                <div className={cx('container__feedbacks-detail__header')}>
                                    <div className={cx('feedbacks-detail__header__account')}>
                                        <img
                                            src={feedbackActive.user.avatar}
                                            alt={feedbackActive.userName}
                                            style={{ width: "56px", height: "56px" }} />
                                        <p>{feedbackActive.user.firstName} {feedbackActive.user.lastName}</p>
                                    </div>
                                    <p>{feedbackActive.dateTime}</p>
                                </div>
                                <div className={cx('container__feedbacks-detail__content-feedback')}>
                                    <p>Chủ đề: {feedbackActive.problem}</p>
                                    <p>{feedbackActive.content}</p>
                                </div>
                            </>}
                    </div>
                </div>}
            <Loading loading={feedback.loading} />
        </CommonWrapper>
    );
};

export default FeedbackPage;