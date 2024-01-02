import classNames from "classnames/bind";

import { IGlobalConstantsType } from "~/types";
import { Upload } from "../Upload";
import { RadioButton } from "../RadioButton";
import { memo } from "react";
import { images } from "~/assets";

import styles from "~/sass/BlockDetail.module.scss";
const cx = classNames.bind(styles);

interface BlockDetailProps {
    icon?: string
    title?: string
    editable?: boolean
    data: IGlobalConstantsType[]
    maxWidth?: "mw-medium" | "custom"
    upload?: boolean
    isHorizontal?: boolean
    className?: string
};

export const BlockInfo = memo(({
    data,
    maxWidth,
}: Pick<BlockDetailProps, "data" | "maxWidth">) => {
    return <>
        {data.map(item => {
            return (!Array.isArray(item.value)
                ? <div
                    key={item.id}
                    className={cx("value", maxWidth, item.isActive && "active")}
                >
                    {item.tag}
                </div>
                : item.value?.map((item, index) => (
                    <div className={cx("value")} key={index}>
                        <img src={item.icon} alt="icon" />
                        <p>{item.title}</p>
                    </div>
                )));
        })}
    </>
});

const BlockInput = memo(({
    data,
    maxWidth,
}: Pick<BlockDetailProps, "data" | "maxWidth">) => {
    return <>
        {data.map(item => {
            let title = item.radioTitle?.split(",") || [];
            const { id, tag, isActive, setState, isChecked = true } = item;

            const render = (tag: React.ReactNode | string) => {
                let classes = cx("value",
                    isActive && "active", {
                    maxWidth,
                });

                if (tag === "radio")
                    return (
                        <div
                            key={id}
                            className={classes}
                        >
                            <div className={cx("radio-group")}>
                                <RadioButton
                                    title={title.length > 0 ? title[0] : ""}
                                    checked={isChecked}
                                    onClick={() => setState()}
                                />
                                <RadioButton
                                    title={title.length > 0 ? title[1] : ""}
                                    checked={!isChecked}
                                    onClick={() => setState()}
                                />
                            </div>
                        </div>
                    );
                else if (tag === "none") return;
                else return (
                    <div
                        key={id}
                        className={cx("value", maxWidth, isActive && "active")}
                    >
                        {tag}
                    </div>
                );
            };

            return render(tag);
        })}
    </>
});

export const BlockDetail = memo(({
    icon,
    title,
    editable = false,
    data,
    maxWidth = "mw-medium",
    upload = false,
    isHorizontal = false,
    className,
}: BlockDetailProps) => {
    if (!className) className = "";

    const classes = cx('wrapper', {
        [className]: className,
        editable,
        upload
    });

    return (
        <div className={classes}>
            {title && (
                <div className={cx("title-primary")}>
                    {icon && <img className={cx("icon")} src={icon} alt="icon" />}
                    <div className={cx("text")}>{title}</div>
                </div>
            )}
            <div className={cx("col_content")}>
                <div className={cx("col_left")}>
                    {data.map(item => (
                        typeof item.title === "string" && item.title !== ""
                        && <div
                            key={item.id}
                            className={cx("title", item.isActive && "active")}
                        >
                            <div>{item.title}:</div>
                            {item.isRequired
                                && <img src={images.require} alt="require" className={cx("require")} />}
                        </div>
                    ))}
                </div>
                <div className={cx("col_right", isHorizontal && "horizontal")}>
                    {upload && <Upload />}
                    {!editable
                        ? <BlockInfo data={data} maxWidth={maxWidth} />
                        : <BlockInput data={data} maxWidth={maxWidth} />}
                </div>
            </div>
        </div >
    );
});