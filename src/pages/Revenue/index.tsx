import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import classNames from "classnames/bind";
import { memo, useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { images } from "~/assets";
import { ActionBar } from "~/components/ActionBar";
import { CommonWrapper } from "~/components/CommonWrapper";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { PagingItemType } from "~/components/Paging";
import { routes } from "~/config/routes";
import { QUARTERLY, formatDateYMD, formatMoney } from "~/constants";
import { SidebarContext } from "~/context/Sidebar/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getEtmContractForControls } from "~/state/thunk/entrustmentContract";
import { getRecordPlays } from "~/state/thunk/recordPlay";
import { IGlobalConstantsType } from "~/types";
import { EtmContractForControl, Quarterly } from "~/types/EntrustmentContractType";
import { IRecordPlay } from "~/types/RecordPlayType";

import style from '~/sass/RevenueReport.module.scss';
const cx = classNames.bind(style);

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface Filter {
    type: 'Theo tháng' | 'Theo quý' | '';
    data: Array<string>;
    dataActive: string;
}

type RevenueInfo = {
    totalRecord: number;
    totalPlay: number;
    revenue: string;
    unDistributedRevenue: string;
    administrativeFee: string;
}

type RevenueInfoBox = {
    data: { key: string; value: number | string };
    className?: string;
}

type ChartDataSet = {
    label: string;
    data: Array<any>;
    borderColor: string;
    tension: number;
    backgroundColor?: any;
}

type ChartType = {
    labels: Array<any>;
    datasets: Array<ChartDataSet>;
}

const RevenueInfoBoxItem = memo(({ data, className }: RevenueInfoBox) => {
    return (
        <div className={cx('box__item', className)}>
            <p>{data.key}</p>
            <p>{data.value}</p>
        </div>
    );
});

function RevenueReportPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { setActive, setCurrentPage } = useContext(SidebarContext);

    const etmContract = useSelector((state: RootState) => state.etmContract);
    const recordPlay = useSelector((state: RootState) => state.recordPlay);

    const [paging, setPaging] = useState<Array<PagingItemType>>([] as Array<PagingItemType>);
    const [actionbar, setActionbar] = useState<any[]>([] as any[]);
    const [filter, setFilter] = useState<Filter>({ type: '', data: [], dataActive: '' } as Filter);
    const [currentDate, setCurrentDate] = useState<Date>();
    const [contracts, setContracts] = useState<Array<EtmContractForControl & { recordPlay: IRecordPlay[] }>>([] as Array<EtmContractForControl & { recordPlay: IRecordPlay[] }>);
    const [revenueInfo, setRevenueInfo] = useState<RevenueInfo>({
        totalRecord: 0,
        totalPlay: 0,
        revenue: '',
        unDistributedRevenue: '',
        administrativeFee: ''
    } as RevenueInfo);
    const [chartData, setChartData] = useState<ChartType>({
        labels: [],
        datasets: [{
            label: 'Lượt nghe',
            data: [],
            borderColor: 'orange',
            tension: 0.1,
            backgroundColor: ''
        }],
    });
    const [monthActive, setMonthActive] = useState<IGlobalConstantsType>({
        id: 1,
        title: 'Tháng 1'
    });
    const [type, setType] = useState<IGlobalConstantsType>({
        id: 1,
        title: 'Theo tháng'
    });

    const REVENUE_INFO_KEYS = ['Tổng số bài hát', 'Tổng số lượt phát', 'Doanh thu trên lượt phát', 'Doanh thu chưa phân phối', 'Hành chính phí'];
    const options = {
        plugins: {
            tooltip: {
                enabled: false,
                external: (context: any) => {
                    let linesSplit = context.tooltip.body && context.tooltip.body[0].lines[0].split(':');
                    let tooltipEl = document.getElementById('chartjs-tooltip');

                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = `<div></div>`;
                        document.body.appendChild(tooltipEl);
                    }

                    const tooltipModel = context.tooltip;

                    if (tooltipModel.body)
                        tooltipEl.innerHTML = `
                            <p id='chartjs-tooltip__title'>${linesSplit[0]}</p>
                            <p id='chartjs-tooltip__content'>${linesSplit[1].trim()}</p>
                            <div id='chartjs-tooltip__arrow'></div>
                        `;

                    const position = context.chart.canvas.getBoundingClientRect();

                    tooltipEl.style.opacity = '0.7';
                    tooltipEl.style.backgroundColor = 'rgba(62, 62, 91)';
                    tooltipEl.style.borderRadius = '10px';
                    tooltipEl.style.paddingTop = '8px';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 80 + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 105 + 'px';
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                    tooltipEl.style.width = '156.566px';
                    tooltipEl.style.height = '80px';
                    tooltipEl.style.transition = 'opacity .2s linear';
                    tooltipEl.style.boxShadow = 'rgba(0, 0, 0, 0.7) 0px 7px 15px 1px';

                    let tooltipElTitle = document.getElementById('chartjs-tooltip__title');
                    if (tooltipElTitle) {
                        tooltipElTitle.style.color = 'rgba(235, 235, 245, 0.60)';
                        tooltipElTitle.style.textAlign = 'center';
                        tooltipElTitle.style.fontSize = '14px';
                        tooltipElTitle.style.fontWeight = '500';
                        tooltipElTitle.style.lineHeight = 'normal';
                        tooltipElTitle.style.letterSpacing = '0.21px';

                    }

                    let tooltipElContent = document.getElementById('chartjs-tooltip__content');
                    if (tooltipElContent) {
                        tooltipElContent.style.color = '#FFF';
                        tooltipElContent.style.textAlign = 'center';
                        tooltipElContent.style.fontSize = '16px';
                        tooltipElContent.style.fontWeight = '700';
                        tooltipElContent.style.lineHeight = '24px';
                        tooltipElContent.style.letterSpacing = '-0.032px';
                    }

                    let tooltipElArrow = document.getElementById('chartjs-tooltip__arrow');
                    if (tooltipElArrow) {
                        tooltipElArrow.style.height = '1rem';
                        tooltipElArrow.style.width = '1rem';
                        tooltipElArrow.style.position = 'absolute';
                        tooltipElArrow.style.left = '45%';
                        tooltipElArrow.style.bottom = '-5px';
                        tooltipElArrow.style.borderLeft = '20px solid rgba(62, 62, 91, 0.70)';
                        tooltipElArrow.style.borderTop = '20px solid transparent';
                        tooltipElArrow.style.transform = 'rotate(135deg)';
                        tooltipElArrow.style.zIndex = '1';
                        tooltipElArrow.style.backgroundColor = 'rgba(62, 62, 91)';
                    }

                    if (tooltipModel.opacity === 0)
                        tooltipEl.style.opacity = '0';
                }
            },
            legend: { display: false },
            interaction: {
                intersect: false,
                mode: 'point'
            }
        },
        elements: {
            point: {
                hitRadius: 10,
                hoverRadius: 10,
                hoverBorderWidth: 4,
                hoverBorderColor: 'white',
            },
            legend: {
                display: false
            }
        },
        onHover: (event: any, chartElement: any) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    };

    useEffect(() => {
        setActionbar([{
            title: "Báo cáo chi tiết",
            icon: images.receipt,
            onClick: () => {
                navigate(routes.RevenueReportDetailPage);
                setActive(false);
            }
        }]);
    }, []);

    useEffect(() => {
        if (!contracts.length) return;

        let daysOfMonth: Array<number> = [];
        let dataOfDatasets: Array<number> = [];

        for (let i = 0; i < 31; i++)
            daysOfMonth.push(i + 1);
        for (let i = 0; i < 9; i++)
            dataOfDatasets.push(i + 1);

        type RecordPlayOfMonth = { date: Date; playsCount: number };
        let recordPlayOfMonth: Array<RecordPlayOfMonth> = [];
        contracts.map(contract => {
            return contract.recordPlay.map(recordPlay => {
                recordPlayOfMonth.push({
                    date: new Date(formatDateYMD(recordPlay.date)),
                    playsCount: +recordPlay.playsCount
                });
            })
        });

        setChartData({
            labels: daysOfMonth,
            datasets: [{
                label: 'Lượt nghe',
                data: recordPlayOfMonth
                    .sort((a: RecordPlayOfMonth, b: RecordPlayOfMonth) =>
                        a.date.getMonth() - b.date.getMonth()).map(item => item.playsCount),
                borderColor: 'orange',
                backgroundColor: 'orange',
                tension: 1,
            }],
        });
    }, [contracts]);

    useEffect(() => {
        setPaging([
            {
                title: 'Doanh thu',
                to: '#'
            }, {
                title: 'Báo cáo doanh thu',
                to: '#'
            }
        ]);

        let currentDate = new Date();
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);

        setFilter({
            ...filter,
            data: months,
            type: 'Theo tháng',
            dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        });
        setMonthActive({ id: currentDate.getMonth() + 1, title: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` });
        setCurrentDate(currentDate);

        etmContract.etmContractForControl.length === 0 && dispatch(getEtmContractForControls());
        recordPlay.recordPlays.length === 0 && dispatch(getRecordPlays());

        setActive(true);
        setCurrentPage(5);
    }, []);

    useEffect(() => {
        setRevenueInfo({
            totalRecord: contracts.reduce((sum, item) => sum + item.records.length, 0),
            totalPlay: contracts.reduce((sum, item) => sum + item.totalPlay, 0),
            revenue: `${formatMoney(contracts.reduce((sum, item) => sum + (item.CPM / 1000 * item.totalPlay), 0)).split('₫')[0]}đ`,
            unDistributedRevenue: `${formatMoney(contracts.reduce((sum, item) => sum + item.unDistributedRevenue, 0)).split('₫')[0]}đ`,
            administrativeFee: `${formatMoney(contracts.reduce((sum, item) => sum + (item.CPM / 1000 * item.administrativeFee), 0)).split('₫')[0]}đ`,
        });
    }, [contracts]);

    useEffect(() => {
        if (typeof currentDate === 'undefined' || !etmContract.etmContractForControl.length) return;

        setContracts(etmContract.etmContractForControl
            .map(contract => {
                let quarter: Quarterly = { quarter: '', time: '' };

                if (filter.type === 'Theo quý')
                    quarter = QUARTERLY.find(quarter => quarter.quarter === filter.dataActive.split('/')[0]) || { quarter: '', time: '' };

                let recordPlayArray: IRecordPlay[] = contract.recordPlay
                    .filter((recordPlay: IRecordPlay) => {
                        let recordPlayDate = new Date(formatDateYMD(recordPlay.date));

                        if (filter.type === 'Theo quý') {
                            let timeSplit = quarter.time.split('-');
                            let startTimeSplit = timeSplit[0].trim().split('/');
                            let endTimeSplit = timeSplit[1].trim().split('/');
                            let startDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${startTimeSplit[1]}-${startTimeSplit[0]}`));
                            let endDate = new Date(formatDateYMD(`${currentDate.getFullYear()}-${endTimeSplit[1]}-${endTimeSplit[0]}`));

                            return recordPlayDate.getMonth() >= startDate.getMonth() && recordPlayDate.getMonth() <= endDate.getMonth();
                        }
                        else {
                            let filterDate = new Date(formatDateYMD(`${currentDate.getDate()}/${filter.dataActive.split(' ')[1]}`));
                            return recordPlayDate.getMonth() === filterDate.getMonth() && recordPlayDate.getFullYear() === filterDate.getFullYear() - 1;
                        }
                    });

                let totalPlay = recordPlayArray.reduce((sum, item) => sum + parseInt(item.playsCount), 0);

                if (recordPlayArray.length)
                    return {
                        ...contract,
                        recordPlay: recordPlayArray,
                        totalPlay: totalPlay,
                        revenue: totalPlay * contract.CPM / 1000,
                    }

                return {
                    ...contract,
                    records: [],
                    unDistributedRevenue: 0,
                    administrativeFee: 0,
                    recordPlay: recordPlayArray,
                    totalPlay: totalPlay,
                    revenue: totalPlay * contract.CPM / 1000,
                }
            })
        );
    }, [filter, etmContract.etmContractForControl]);

    useEffect(() => {
        if (!filter.data.length) return;

        setFilter({ ...filter, dataActive: `${monthActive.title}/${new Date().getFullYear()}` });
    }, [monthActive]);

    useEffect(() => {
        if (typeof currentDate === 'undefined') return;

        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => `Tháng ${month}`);
        let quarters = QUARTERLY.map(quaterly => quaterly.quarter);

        if (type.title === 'Theo tháng') {
            setMonthActive({ id: 1, title: 'Tháng 1' });
            setFilter({
                ...filter,
                data: months,
                type: 'Theo tháng',
                dataActive: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
            });
        }
        else {
            setMonthActive({ id: 1, title: 'Quý 1' });
            setFilter({
                ...filter,
                data: quarters,
                type: 'Theo quý',
                dataActive: `${quarters[0]}/${currentDate.getFullYear()}`
            });
        }
    }, [type]);

    return (
        <CommonWrapper
            paging={paging}
            title='Báo cáo doanh thu'
            className={cx('revenue-report')}
        >
            <div className={cx('renvenue-report__filter')} style={{ marginTop: '24px' }}>
                <p style={{ color: 'white' }}>Theo:</p>
                <OptionMenu
                    data={[{ id: 1, title: 'Theo tháng' }, { id: 2, title: 'Theo quý' }]}
                    setState={setType}
                    state={type}
                />
                <OptionMenu
                    data={filter.data.map((item, index) => ({ id: index + 1, title: item }))}
                    state={monthActive}
                    setState={setMonthActive}
                />
            </div>
            <div className={cx('revenue-report__box')}>
                {Object.entries(revenueInfo).map((item, index) => (
                    <RevenueInfoBoxItem key={index} data={{ key: REVENUE_INFO_KEYS[index], value: item[1] }} />
                ))}
            </div>
            <div className={cx('revenue-report-chart')}>
                <p>Biểu đồ theo dõi lượt phát - {
                    filter.type === 'Theo tháng'
                        ? `${currentDate?.getDate()}/${filter.dataActive.split(' ')[1]}`
                        : filter.dataActive
                }</p>
                <div style={{ color: 'white' }}><Line data={chartData} options={options}></Line></div>
            </div>
            <ActionBar data={actionbar} />
            <Loading loading={etmContract.loading} />
        </CommonWrapper>
    );
};

export default RevenueReportPage;