import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";

import { Quarterly } from "~/api/entrustmentContract";
import { Button } from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Input } from "~/components/Input";
import { PagingItemType } from "~/components/Paging";
import { RadioButton } from "~/components/RadioButton";
import { QUARTERLY, Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { Monthly, setForControlCircle } from "~/state/reducer/entrustmentContract";

import style from '~/sass/SettingForControl.module.scss';
const cx = classNames.bind(style);

function ForControlCirclePage() {
    const dispatch = useAppDispatch();

    const etmContract = useSelector((state: RootState) => state.etmContract);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [quarterly, setQuarterly] = useState<Array<Quarterly>>([] as Array<Quarterly>);
    const [activeToast, setActiveToast] = useState<boolean>(false);

    const forControlFormik = useFormik({
        initialValues: {
            type: '',
            controlCircle: [] || {},
            startDate: new Date(),
            endDate: new Date()
        } as { startDate: Date; endDate: Date; type: string, controlCircle: Array<Quarterly> | Monthly },
        validationSchema: Yup.object({
            endDate: Yup.date().when('startDate', (startDate, Yup) => startDate && Yup.min(startDate, "End time cannot be before start time"))
        }),
        onSubmit: values => {
            if (JSON.stringify(etmContract.forControlCircle) === JSON.stringify({
                type: values.type,
                controlCircle: values.controlCircle
            }))
                return;

            if (values.type === 'quarterly') {
                dispatch(setForControlCircle({
                    type: values.type,
                    controlCircle: quarterly
                }));
                setActiveToast(true);

                return;
            }

            dispatch(setForControlCircle({
                type: values.type,
                controlCircle: {
                    start: values.startDate,
                    end: values.endDate
                }
            }));

            setActiveToast(true);
        }
    });

    useEffect(() => {
        setPaging([
            {
                title: 'Trang chủ',
                to: '#',
                active: true
            }, {
                title: 'Cài đặt hệ thống',
                to: '#',
                active: true
            }, {
                title: 'Thông tin tác phẩm',
                to: '#',
                active: true
            }
        ]);

        setQuarterly(QUARTERLY);
    }, []);

    useEffect(() => {
        forControlFormik.setFieldValue('type', etmContract.forControlCircle.type);
        forControlFormik.setFieldValue('controlCircle', etmContract.forControlCircle.controlCircle);
    }, [etmContract.forControlCircle]);

    return (
        <CommonWrapper
            title='Cài đặt hệ thống'
            paging={paging}
            className={cx('for-control-circle')}
        >
            <form>
                <div className={cx('container')}>
                    <p className={cx('container__title')}>Cài đặt chu kì đối soát</p>
                    <div className={cx('container__type-for-control')}>
                        <div className={cx('type-for-control__quarterly')}>
                            <RadioButton
                                checked={forControlFormik.values.type === 'quarterly'}
                                title="Đối soát theo quý"
                                onClick={() => forControlFormik.setValues({ ...forControlFormik.values, type: 'quarterly', })}
                            />
                            <div className={cx('quarterly__content', forControlFormik.values.type === 'quarterly' && 'active')}>
                                {quarterly.map((quarter, index) =>
                                    <div key={index} className={cx('quarterly__content__item')}>
                                        <p>{quarter.quarter}:</p>
                                        <p>{quarter.time}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={cx('type-for-control__monthly')}>
                            <RadioButton
                                checked={forControlFormik.values.type !== 'quarterly'}
                                title="Đối soát theo tháng"
                                onClick={() => forControlFormik.setFieldValue('type', 'monthly')}
                            />
                            <div className={cx('monthly__input', forControlFormik.values.type !== 'quarterly' && 'active')}>
                                <div className={cx('monthly__input__item')}>
                                    <p>Ngày bắt đầu:</p>
                                    <Input
                                        name='startDate'
                                        type='date'
                                        value={forControlFormik.values.startDate}
                                        onChange={(e: any) => {
                                            forControlFormik.setFieldValue('startDate', e.target.value);
                                            forControlFormik.setFieldValue('controlCircle', { ...forControlFormik.values.controlCircle, start: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className={cx('monthly__input__item')}>
                                    <p>Ngày bắt đầu:</p>
                                    <Input
                                        name='endDate'
                                        type='date'
                                        value={forControlFormik.values.endDate}
                                        onChange={(e: any) => {
                                            forControlFormik.setFieldValue('endDate', e.target.value);
                                            forControlFormik.setFieldValue('controlCircle', { ...forControlFormik.values.controlCircle, end: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className={cx('monthly__input__end')}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('container__action')}>
                    <Button
                        fill
                        primary
                        disable={JSON.stringify(etmContract.forControlCircle) === JSON.stringify({
                            type: forControlFormik.values.type,
                            controlCircle: forControlFormik.values.controlCircle
                        })}
                        value='Lưu'
                        onClick={() => forControlFormik.handleSubmit()}
                    />
                </div>
            </form>
            {/* <Toast
                visible={activeToast}
                message='Lưu cài đặt chu kỳ đối soát thành công'
                duration={800}
                setVisible={setActiveToast}
            /> */}
        </CommonWrapper>
    );
}

export default ForControlCirclePage;