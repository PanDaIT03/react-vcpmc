import classNames from "classnames/bind";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import Button from "~/components/Button";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { PagingItemType } from "~/components/Paging";
import { Table } from "~/components/Table";
import { routes } from "~/config/routes";
import { Yup } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { addEtmContractType, deleteEtmContractType, updateEtmContractTypes } from "~/state/thunk/entrustmentContract";
import { IGlobalConstantsType } from "~/types";
import { ETMContractType } from "~/types/EntrustmentContractType";

import style from '~/sass/EditContractType.module.scss';
const cx = classNames.bind(style);

function EditContractTypePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const [actionbar, setActionbar] = useState<Omit<IGlobalConstantsType, "id">[]>([]);

    const [itemsPerPage, setItemsPerPage] = useState<string>('8');
    const [itemActive, setItemActive] = useState<ETMContractType>({
        docId: '',
        name: '',
        revenuePercent: 0,
        applyDate: ''
    });

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [currentItems, setCurrentItems] = useState<Array<ETMContractType>>([] as Array<ETMContractType>);

    const contractTypeFormik = useFormik({
        initialValues: {
            docId: '',
            name: '',
            revenuePercent: 0,
            applyDate: '',
            types: [] as Array<ETMContractType>,
            type: 'edit'
        },
        validationSchema: Yup.object({
            id: Yup.string().required(),
            name: Yup.string().required(),
            revenuePercent: Yup.number().required(),
            applyDate: Yup.string().required()
        }),
        onSubmit: values => {
            console.log(values);

            if (values.type === 'edit') {
                dispatch(updateEtmContractTypes({
                    types: values.types,
                    navigate: () => navigate(routes.ManagementContractTypePage)
                }));
                return;
            };

            dispatch(addEtmContractType({ type: itemActive }));
            contractTypeFormik.setFieldValue('type', 'edit');

            contractTypeFormik.setErrors(contractTypeFormik.initialErrors);
            contractTypeFormik.setTouched(contractTypeFormik.initialTouched);
        }
    });

    const handleAddNewType = useCallback((types: Array<ETMContractType>) => {
        if (!types.length) return;

        let newType = { docId: '0', name: '', revenuePercent: 0, applyDate: '' };
        contractTypeFormik.setValues({
            ...contractTypeFormik.values,
            types: [...types, newType],
            type: 'add'
        });
        setItemActive(newType);
    }, []);

    useEffect(() => {
        setPaging([
            {
                title: 'Cài đặt',
                to: routes.ManagementContractTypePage,
                active: true
            }, {
                title: 'Quản lý loại hợp đồng',
                to: routes.ManagementContractTypePage,
                active: true
            }
        ]);
        setActionbar([
            {
                icon: images.uPlus,
                title: "Thêm lịch áp dụng",
                onClick: () => handleAddNewType(contractTypeFormik.values.types)
            }, {
                title: "Xóa",
                icon: images.trash,
                onClick: () => dispatch(deleteEtmContractType({ id: itemActive.docId }))
            }
        ]);

        contractTypeFormik.setFieldValue('types', etmContract.types);
        setItemActive(etmContract.types[0]);
    }, []);

    useEffect(() => {
        contractTypeFormik.setFieldValue('types', etmContract.types);
    }, [etmContract]);

    useEffect(() => {
        if (!contractTypeFormik.values.types.length) return;

        contractTypeFormik.setValues({
            ...contractTypeFormik.values,
            docId: itemActive.docId,
            name: itemActive.name,
            revenuePercent: itemActive.revenuePercent,
            applyDate: itemActive.applyDate,
            types: contractTypeFormik.values.types.map(type => {
                if (type.docId === itemActive.docId)
                    return itemActive;
                return type;
            }),
        });
    }, [itemActive]);

    const handleSetCurrentItems = useCallback((items: Array<any>) => {
        setCurrentItems(items);
    }, []);

    const handleChange = useCallback((value: string) => {
        setItemsPerPage(value);
    }, []);

    const handleCancleAction = () => {
        contractTypeFormik.values.type === 'edit'
            ? navigate(routes.ManagementContractTypePage)
            : contractTypeFormik.setValues({
                ...contractTypeFormik.values,
                type: 'edit',
                types: contractTypeFormik.values.types.filter(type => type.docId !== '0')
            })
    };

    return (
        <CommonWrapper
            title='Loại hợp đồng'
            paging={paging}
            className={cx('edit-type-contract')}
        >
            <Form
                handleFormSubmit={contractTypeFormik.handleSubmit}
                className={cx('type-contract__form')}
            >
                <Table
                    minHeight="280px"
                    paginate={{
                        dataForPaginate: contractTypeFormik.values.types,
                        setCurrentItems: handleSetCurrentItems
                    }}
                    thead={['STT', 'Loại hợp đồng', 'Doanh thu VCPCM/hợp đồng (Đơn vị: %)', 'Ngày áp dụng']}
                    className={cx('form__table')}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={handleChange}
                >
                    {currentItems.map((item, index) => (
                        itemActive.docId === item.docId
                            ? <tr key={index} style={{ height: '47px' }}>
                                <td><p>{index + 1}</p></td>
                                <td><Input
                                    name="name"
                                    size="small"
                                    value={item.name}
                                    onChange={(e: any) => setItemActive({ ...itemActive, name: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.name}
                                    touched={contractTypeFormik.touched.name}
                                    onFocus={() => contractTypeFormik.setFieldTouched('name', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('name', false)}
                                /></td>
                                <td><Input
                                    name="revenuePercent"
                                    size="extra-small"
                                    value={`${item.revenuePercent}`}
                                    onChange={(e: any) => setItemActive({ ...itemActive, revenuePercent: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.revenuePercent}
                                    touched={contractTypeFormik.touched.revenuePercent}
                                    onFocus={() => contractTypeFormik.setFieldTouched('revenuePercen', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('revenuePercen', false)}
                                /></td>
                                <td><Input
                                    name="applyDate"
                                    size="small"
                                    value={item.applyDate}
                                    onChange={(e: any) => setItemActive({ ...itemActive, applyDate: e.target.value })}
                                    errorMessage={contractTypeFormik.errors.applyDate}
                                    touched={contractTypeFormik.touched.applyDate}
                                    onFocus={() => contractTypeFormik.setFieldTouched('applyDate', true)}
                                    onBlur={() => contractTypeFormik.setFieldTouched('applyDate', false)}
                                /></td>
                            </tr>
                            : <tr key={index} style={{ height: '47px' }} onClick={() => setItemActive(item)}>
                                <td><p>{index + 1}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p>{item.revenuePercent}%</p></td>
                                <td><p>{item.applyDate}</p></td>
                            </tr>
                    ))}
                </Table>
                <div className={cx('form__footer')}>
                    <Button primary value="Hủy" onClick={handleCancleAction} />
                    <Button
                        fill
                        primary
                        value="Lưu"
                        buttonType='submit'
                        onClick={() => contractTypeFormik.handleSubmit()} />
                </div>
            </Form >
            <ActionBar data={actionbar} />
            <Loading loading={etmContract.loading} />
        </CommonWrapper>
    );
};

export default EditContractTypePage;