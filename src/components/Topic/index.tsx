import classNames from "classnames/bind";
import { memo, useState } from "react";
import { images } from "~/assets";

import style from '~/sass/Topic.module.scss';
import { Input } from "../Input";
const cx = classNames.bind(style);

interface TopicProps {
    className?: string
}

const TopicItem = memo(({ title }: { title: string }) => {
    return (
        <div className={cx("item-container")}>
            <div className={cx("title")}>{title}</div>
            <img className={cx("remove")} src={images.fiX} alt="x-icon" />
        </div>
    );
});

export const Topic = memo(({
    className
}: TopicProps) => {
    if (!className) className = "";

    const classes = cx('wrapper', {
        [className]: className
    });

    const [topicValue, setTopicValue] = useState('');

    return (
        <div className={classes}>
            <div className={cx("container")}>
                <div className={cx("topics")}>
                    <TopicItem title="Chill" />
                    <TopicItem title="Lofi" />
                    <TopicItem title="Mashup" />
                </div>
                <Input
                    id="topic"
                    name="topic"
                    size="custom"
                    border={false}
                    className={cx("topic")}
                    value={topicValue}
                    onChange={(e) => setTopicValue(e.target.value)}
                />
            </div>
        </div>
    );
});