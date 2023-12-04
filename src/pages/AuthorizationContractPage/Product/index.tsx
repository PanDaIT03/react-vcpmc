import classNames from "classnames/bind";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "~/component/Button";
import { ActionBar } from "~/component/ActionBar";
import { ActionBarItem } from "~/component/ActionBar/ActionBarItem";
import { Contract } from "~/component/Contract";
import { Input } from "~/component/Input";
import { OptionMenu } from "~/component/OptionMenu";
import { Tab, Tabs } from "~/component/Tabs";
import { CB_APPROVE_ITEMS } from "~/constants";
import { IGlobalConstantsType, IRecord } from "~/types";
import { Table } from "~/component/Table";
import { SidebarContext } from "~/context/SidebarContext";
import { RootState, useAppDispatch } from "~/state";
import { getRecordsAction, updateRecordsAction } from "~/state/thunk/record";
import { AudioDialog } from "~/component/AudioDialog";
import { RenewalAuthorization } from "~/component/RenewalAuthorization";
import { Dialog } from "~/component/Dialog";
import { Checkbox } from "~/component/Checkbox";
import { images } from "~/assets";

import styles from "~/sass/Product.module.scss";
const cx = classNames.bind(styles);

const initialState = {
  id: 1,
  title: "Tất cả",
};

interface ProductItemProps {
  data: IRecord[]
  recordArray: IRecord[]
  approve: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setAudioSource: React.Dispatch<React.SetStateAction<string>>
  handleCheckBox: (record: IRecord, isChecked: boolean) => void
};

const ProductItem = memo(({
  data,
  recordArray,
  approve,
  setVisible,
  setAudioSource,
  handleCheckBox
}: ProductItemProps) => {
  return <>
    {data.map((record, index) => {
      const isItemExisted = recordArray.filter(item => item.docId === record.docId);
      const isChecked = isItemExisted.length > 0;

      return (
        <tr
          className={cx("product_item")}
          key={index}
          onClick={() => handleCheckBox(record, isChecked)}
        >
          <td className={cx("check", "content")}>
            <Checkbox checked={isChecked} visible={approve} />
          </td>
          <td className={cx("numerical-order", "content")}>{index + 1}</td>
          <td className={cx("record-name", "content")}>
            <div className={cx("product-title")}>{record.nameRecord}</div>
            <div className={cx("sub-title")}>
              <div className={cx("category")}>{record.category}</div>
              <img className={cx("icon")} src={images.ellipseEffect} alt="icon" />
              <div className={cx("format")}>{record.format}</div>
              <img className={cx("icon")} src={images.ellipseEffect} alt="icon" />
              <div className={cx("duration")}>{record.time}</div>
            </div>
          </td>
          <td className={cx("isrc-code", "content")}>{record.ISRCCode}</td>
          <td className={cx("single-name", "content")}>{record.singer}</td>
          <td className={cx("authorized", "content")}>{record.author}</td>
          <td className={cx("download-date", "content")}>{record.createdDate}</td>
          <td className={cx("status", "content")}>
            {CB_APPROVE_ITEMS.map((item) => item.title === record.contractStatus
              && (
                <span className={cx("--center-flex")} key={item.id}>
                  <img className={cx("icon")} src={item.icon} alt="icon" />
                  <p>{item.title}</p>
                </span>
              ))}
          </td>
          <td className={cx("listening", "content")}
            onClick={() => {
              setVisible(true);
              setAudioSource(record.audioLink);
            }}
          >Nghe</td>
        </tr >
      );
    })}
  </>;
});

export const Product = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { contractCode, contractId } = params;

  const { setActive } = useContext(SidebarContext);
  // const [visible, setVisible] = useState(false);
  const [approve, setApprove] = useState(false);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checked, setChecked] = useState(false);

  const [renewalVisible, setRenewalVisible] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);

  const [approveOption, setApproveOption] = useState<IGlobalConstantsType>(initialState);
  const [audioSource, setAudioSource] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const recordState = useSelector((state: RootState) => state.record);
  const { records, loading } = recordState;
  const [recordArray, setRecordArray] = useState<IRecord[]>([] as IRecord[]);
  const [editRecords, setEditRecords] = useState<IRecord[]>([] as IRecord[]);
  const [searchResult, setSearchResult] = useState<IRecord[]>([] as IRecord[]);

  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contractId && dispatch(getRecordsAction(contractId));
    setActive(false);
  }, []);

  useEffect(() => {
    console.log(records);

    setSearchResult(records);
  }, [records]);

  useEffect(() => {
    const isAll = records.length > 0 && recordArray.length === editRecords.length;
    setIsCheckedAll(isAll);
  }, [recordArray]);

  useEffect(() => {
    checked
      ? setRecordArray(!approve ? records : editRecords)
      : setRecordArray([]);
  }, [checked]);

  useEffect(() => {
    if (approve) {
      const newRecords = records.filter(record => record.contractStatus === "Mới")
      setEditRecords(newRecords);
    } else {
      setChecked(false);
      setRecordArray([]);
      setIsCheckedAll(false);
    };
  }, [approve]);

  const handleCheckBox = (record: IRecord, isChecked: boolean) => {
    !isChecked
      ? setRecordArray([...recordArray, { ...record }])
      : setRecordArray(() => recordArray.filter(item => item.docId !== record.docId))
  };

  useEffect(() => {
    const approveStateOption = approveOption.title;
    const search = searchValue.toLowerCase().trim();

    if (approveStateOption) {
      const result = records.filter(record => {
        let itemResult;

        if (approveStateOption === "Tất cả")
          itemResult = record;
        else if (record.contractStatus.includes(approveStateOption)) {
          if (approveStateOption === "Mới")
            itemResult = record;
          else if (approveStateOption === "Đã phê duyệt")
            itemResult = record;
          else if (approveStateOption === "Bị từ chối")
            itemResult = record;
        };

        return itemResult;
      });

      setSearchResult(result.filter(item =>
        item.nameRecord.toLowerCase().includes(search) ||
        item.ISRCCode.toLowerCase().includes(search) ||
        item.singer.toLowerCase().includes(search) ||
        item.author.toLowerCase().includes(search) ||
        item.createdDate.toLowerCase().includes(search)
      ));
    };
  }, [searchValue, approveOption]);

  const handleClickApproval = (status: string) => {
    dispatch(updateRecordsAction({ records: recordArray, status: status, contractId: contractId || "" }));
    setApprove(false);
  };

  return (
    <div className={cx("wrapper")}>
      <Contract title={`Hợp đồng uỷ quyền bài hát - ${contractCode}`}>
        <Tabs>
          <Tab
            title="Thông tin hợp đồng"
            pageRef={firstRef}
            status={"inactive"}
            onClick={() => navigate(`/contract-management/authorization-contract/${contractCode}`)}
          />
          <Tab
            title="Tác phầm uỷ quyền"
            pageRef={secondRef}
            status={"active"}
          />
        </Tabs>
        <div className={cx("action")}>
          {!approve && <div className={cx("filter")}>
            <OptionMenu
              title="Tình trạng phê duyệt"
              data={CB_APPROVE_ITEMS}
              setState={setApproveOption}
            />
          </div>}
          <div className={cx("search")}>
            <Input
              id="search"
              name="search"
              value={searchValue}
              placeholder="Tên hợp đồng, số hợp đồng, người uỷ quyền..."
              size="custom"
              iconRight={images.search}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>
        </div>
        <Table className={cx("contract")} loading={loading}>
          <tbody>
            <tr className={cx("product_title")}>
              <th className={cx("check", "title")}>
                <Checkbox
                  checked={isCheckedAll}
                  visible={approve}
                  onClick={() => setChecked(!checked)}
                />
              </th>
              <th className={cx("numerical-order", "title")}>STT</th>
              <th className={cx("record-name", "title")}>Tên bản ghi</th>
              <th className={cx("isrc-code", "title")}>Mã ISRC</th>
              <th className={cx("single-name", "title")}>Ca sĩ</th>
              <th className={cx("authorized", "title")}>Tác giả</th>
              <th className={cx("download-date", "title")}>Ngày tải</th>
              <th className={cx("status", "title")}>Tình trạng</th>
              <th className={cx("listening", "title")}>&nbsp;</th>
            </tr>
            <ProductItem
              data={!approve ? searchResult : editRecords}
              recordArray={recordArray}
              handleCheckBox={handleCheckBox}
              approve={approve}
              setVisible={setAudioVisible}
              setAudioSource={setAudioSource}
            />
          </tbody>
        </Table>
        <div className={cx("approval-actions", !approve && "inactive")}>
          <Button primary value="Huỷ" onClick={() => setApprove(false)} />
          <Button primary fill value="Lưu" onClick={() => handleClickApproval("Đã phê duyệt")} />
        </div>
        <ActionBar visible={true}>
          {!approve
            ? <>
              <ActionBarItem
                title="Chỉnh sửa hợp đồng"
                icon={images.edit}
                onClick={() => setApprove(!approve)}
              />
              <ActionBarItem
                title="Gia hạn hợp đồng"
                icon={images.clipboardNotes}
                onClick={() => setRenewalVisible(true)}
              />
              <ActionBarItem title="Huỷ hợp đồng" icon={images.history} />
              <ActionBarItem title="Thêm bản ghi" icon={images.uPlus} />
            </>
            : <ActionBarItem title="Từ chối bản ghi" icon={images.fiX} onClick={() => handleClickApproval("Bị từ chối")} />
          }
        </ActionBar>
        <Dialog
          primary
          visible={audioVisible}
          setVisible={setAudioVisible}
          alignCenter="all"
        >
          <AudioDialog
            source={audioSource}
            setVisible={setAudioVisible}
          />
        </Dialog>
        <Dialog
          visible={renewalVisible}
          className={cx("renewal")}
          setVisible={setRenewalVisible}
        >
          <RenewalAuthorization
            title="Gia hạn uỷ quyền tác phẩm"
            from="02/12/2023"
            setVisible={setRenewalVisible}
          />
        </Dialog>
      </Contract>
    </div>
  );
};