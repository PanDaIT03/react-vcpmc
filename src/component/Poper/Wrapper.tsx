import classNames from "classnames/bind";

import style from "./Popper.module.scss";
const cx = classNames.bind(style);

interface WrapperProps {
    menu?: boolean
    children: React.ReactNode
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
};

const Wrapper = ({
    menu = false,
    children,
    className,
    onClick
}: WrapperProps) => {
    let Comp = "div";
    const props = {
        onClick
    };

    if (menu) {
        Comp = "ul";
    }

    return (
        <div className={cx("wrapper", className)} {...props}>
            {children}
        </div>
    );
};

export default Wrapper;