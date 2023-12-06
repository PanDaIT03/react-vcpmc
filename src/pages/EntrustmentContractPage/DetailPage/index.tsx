import classNames from "classnames/bind";
import { useContext, useEffect, useRef } from "react";

import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
// import { Contract } from "~/component/Contract";
import { SidebarContext } from "~/context/SidebarContext";

import styles from "~/sass/ContractAction.module.scss";
const cx = classNames.bind(styles);

function DetailPage() {
    const { active, setActive } = useContext(SidebarContext);
    const detailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActive(false);
    }, []);

    useEffect(() => {
        let handler = (event: MouseEvent) => {
            if (detailRef.current?.contains(event.target as Node))
                setActive(false);
        };
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return (
        <div className={cx("container")} ref={detailRef}>
            {/* <Contract
                title="Hợp đồng khai thác - HD123"
                tabs={false}
            >
                <div className={cx("content")}>
                    <div className={cx("col-top")}>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Tên hợp đồng:</div>
                                <div className={cx("title")}>Số hợp đồng:</div>
                                <div className={cx("title")}>Ngày hiệu lực:</div>
                                <div className={cx("title")}>Tên hợp đồng:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>Hợp đồng kinh doanh</div>
                                <div className={cx("value")}>HD123</div>
                                <div className={cx("value")}>02/06/2021</div>
                                <div className={cx("value")}>02/06/2021</div>
                            </div>
                        </div>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Đính kèm tệp:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>
                                    <img src="./images/icon_file_word.png" />
                                    hetthuongcannho.doc
                                </div>
                                <div className={cx("value")}>
                                    <img src="./images/icon_file.png" />
                                    hetthuongcannho.doc
                                </div>
                            </div>
                        </div>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Loại hợp đồng:</div>
                                <div className={cx("title")}>Giá trị hợp đồng (VNĐ):</div>
                                <div className={cx("title")}>Giá trị phân phối (VNĐ/ngày):</div>
                                <div className={cx("title")}>Tình trạng:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>Trọn gói</div>
                                <div className={cx("value")}>365.000.000</div>
                                <div className={cx("value")}>1.000.000</div>
                                <div className={cx("value")}>
                                    <span className={cx("--center-flex")}>
                                        <img src="./images/ellipse_effect.png" />
                                        <p>Đang hiệu lực</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx("col-bottom")}>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Tên đơn vị sử dụng:</div>
                                <div className={cx("title")}>Người đại diện:</div>
                                <div className={cx("title")}>Chức vụ:</div>
                                <div className={cx("title")}>Ngày sinh:</div>
                                <div className={cx("title")}>Quốc tịch:</div>
                                <div className={cx("title")}>Số điện thoại:</div>
                                <div className={cx("title")}>Email:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>Công ty TNHH MTV Âu Lạc</div>
                                <div className={cx("value")}>Nguyễn văn A</div>
                                <div className={cx("value")}>Giám đốc</div>
                                <div className={cx("value")}>01/05/1984</div>
                                <div className={cx("value")}>Việt Nam</div>
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>nguyenvana@gmail.com</div>
                            </div>
                        </div>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Giới tính:</div>
                                <div className={cx("title")}>CMND/CCCD:</div>
                                <div className={cx("title")}>Ngày cấp:</div>
                                <div className={cx("title")}>Nơi cấp:</div>
                                <div className={cx("title")}>Mã số thuế:</div>
                                <div className={cx("title")}>Nơi cư trú:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>Nam</div>
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>02/06/2005</div>
                                <div className={cx("value")}>TP. Hồ Chí Minh</div>
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>69/53, Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh</div>
                            </div>
                        </div>
                        <div className={cx("col")}>
                            <div className={cx("col_left")}>
                                <div className={cx("title")}>Tên đăng nhập:</div>
                                <div className={cx("title")}>Mật khẩu:</div>
                                <div className={cx("title")}>Số tài khoản:</div>
                                <div className={cx("title")}>Ngân hàng:</div>
                            </div>
                            <div className={cx("col_right")}>
                                <div className={cx("value")}>vuonganhtu123</div>
                                <input
                                    className={cx("value", "password")}
                                    value="1234567"
                                    type="password"
                                    readOnly={true}
                                />
                                <div className={cx("value")}>123456789012</div>
                                <div className={cx("value")}>ACB - Ngân hàng TMCP Á Châu</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Contract> */}
            <ActionBar visible={true}>
                <ActionBarItem
                    icon="./images/fi_edit.png"
                    title="Chỉnh sửa"
                />
                <ActionBarItem
                    icon="./images/fi_x.png"
                    title="Huỷ hợp đồng"
                />
            </ActionBar>
        </div>
    );
};

export default DetailPage;