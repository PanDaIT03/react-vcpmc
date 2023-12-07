import classNames from "classnames/bind";
import { memo } from 'react';

import styles from '~/sass/Block.module.scss';
const cx = classNames.bind(styles);

interface BlockInfoItemProps {
    title: string;
    content: string;
};

const BlockInfoItem = memo(({ data }: { data: Array<BlockInfoItemProps> }) => {
    return (
        <div className={cx('block-info__item')}>
            <div className={cx('item__content__left')}>
                {data.map((item: BlockInfoItemProps, index) => (
                    <p key={index}>{item.title}</p>
                ))}
            </div>
            <div className={cx('item__content__right')}>
                {data.map((item: BlockInfoItemProps, index) => (
                    <p key={index}>{item.content}</p>
                ))}
            </div>
        </div >
    );
});

interface BlockInfoProps {
    data: Array<any>;
    className?: string;
};

export const BlockInfo = memo(({ data, className }: BlockInfoProps) => {
    return (
        <div className={cx('block-info-container', className)}>
            {data.map((item, index) =>
                <BlockInfoItem key={index} data={item.children} />
            )}
        </div>
    );
});

const BlockInputItem = memo(({ data, className }: BlockInputProps) => {
    return (
        <div className={cx('block-input__item', className)}>
            <div className={cx('item__left')}>
                {data.map((input) =>
                    input.fieldName && <div key={input.fieldName}>
                        <span>
                            {input.fieldName}
                            {input.isRequired && <span>*</span>}
                        </span>
                    </div>)}
            </div>
            <div className={cx('item__right')}>
                {data.map(input => <div key={input.fieldName}>{input.input}</div>)}
            </div>
        </div>
    );
});

interface BlockInputProps {
    data: Array<any>;
    className?: string;
};

export const BlockInput = memo(({ data, className }: BlockInputProps) => {
    return <BlockInputItem data={data} className={className} />
});