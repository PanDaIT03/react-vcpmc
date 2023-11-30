import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faVolumeLow, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";

import { images } from "~/assets";
import { Input } from "../Input";
import { formatTime } from "~/constants";

import styles from "~/sass/AudioDialog.module.scss";
const cx = classNames.bind(styles);

interface AudioDialogProps {
    source: string
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    className?: string
};

const backgroundURL =
    "https://res.cloudinary.com/dis180ycw/image/upload/c_scale,w_452/v1701317096/pexels-daniel-reche-3721941_n2uhdn.jpg"

export const AudioDialog = memo(({ source, visible, setVisible, className }: AudioDialogProps) => {
    if (!className) className = "";

    const classes = cx("wrapper", visible && "active", {
        [className]: className
    });

    const audioRef = useRef<HTMLAudioElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [play, setPlay] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (!play)
            audioRef.current?.pause();
        else
            audioRef.current?.play();
    }, [play]);

    useEffect(() => {
        setInputValue(currentTime);
    }, [currentTime]);

    return (
        <div className={classes}>
            <div
                className={cx("content")}
                style={{ background: `url(${backgroundURL})` }}
            >
                <audio
                    muted={muted}
                    ref={audioRef}
                    autoPlay
                    onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                >
                    <source src={source} type="audio/mpeg" />
                </audio>
                <div className="actions">
                    <div className={cx("action-top")}>
                        <img
                            src={images.xCircle}
                            onClick={() => setVisible(false)}
                        />
                    </div>
                    <div className={cx("action-bottom")}>
                        <div className={cx("action-left")}>
                            <div
                                className={cx("play-pause")}
                                onClick={() => setPlay(!play)}
                            >
                                {play
                                    ? <FontAwesomeIcon icon={faPlay} />
                                    : <FontAwesomeIcon icon={faPause} />
                                }
                            </div>
                            <div className={cx("mute")}>
                                {!muted
                                    ? <FontAwesomeIcon
                                        icon={faVolumeLow}
                                        onClick={() => setMuted(!muted)}
                                    />
                                    : <FontAwesomeIcon
                                        icon={faVolumeXmark}
                                        onClick={() => setMuted(!muted)}
                                    />
                                }
                            </div>
                            <div className={(cx("duration"))}>
                                <span>{formatTime(currentTime)}</span>
                                <span> / </span>
                                <span>{formatTime(audioRef.current?.duration || 0)}</span>
                            </div>
                        </div>
                        <div className={cx("action-right")}>
                            <img src={images.maximize} />
                        </div>
                    </div>
                </div>
                <div className={cx("progress")}>
                    <Input
                        type="range"
                        name="progess"
                        value={inputValue}
                        size="custom"
                        inputRef={inputRef}
                        min={0}
                        max={audioRef.current?.duration}
                        steps={1}
                        onChange={(event) => setCurrentTime(parseInt(event.target.value))}
                    />
                </div>
            </div>
        </div>
    );
});