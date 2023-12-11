import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { OptionMenu } from "~/components/OptionMenu";
import { CB_APPROVE_ITEMS } from "~/constants";
import { IContract, IGlobalConstantsType, IRecord, IUserDetail } from "~/types";
import { Table } from "~/components/Table";
import { RootState, useAppDispatch } from "~/state";
import { getRecordsAction } from "~/state/thunk/record";
import { AudioDialog } from "~/components/AudioDialog";
import { Dialog } from "~/components/Dialog";
import { Checkbox } from "~/components/Checkbox";
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
          key={index}
          className={cx("product_item")}
          onClick={() => handleCheckBox(record, isChecked)}
        >
          {approve
            && <td className={cx("check", "content")}>
              <Checkbox checked={isChecked} visible={approve} />
            </td>}
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
            {CB_APPROVE_ITEMS.map((item, index) => item.title === record.contractStatus
              && (
                <span className={cx("--center-flex")} key={index}>
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

interface ProductProps {
  contractDetail: IContract & IUserDetail
  approve: boolean
  recordArray: IRecord[]
  setRecordArray: Dispatch<SetStateAction<IRecord[]>>
  setApprove: Dispatch<SetStateAction<boolean>>
  handleClickApprove: (status: string) => void
};

export const Product = ({
  contractDetail,
  approve,
  recordArray,
  setRecordArray,
  setApprove,
  handleClickApprove
}: ProductProps) => {
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(false);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);

  const [audioSource, setAudioSource] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [approveOption, setApproveOption] = useState<IGlobalConstantsType>(initialState);

  const recordState = useSelector((state: RootState) => state.record);
  const { records, loading } = recordState;
  const [editRecords, setEditRecords] = useState<IRecord[]>([] as IRecord[]);
  const [searchResult, setSearchResult] = useState<IRecord[]>([] as IRecord[]);

  useEffect(() => {
    contractDetail && dispatch(getRecordsAction(contractDetail.docId));
  }, [contractDetail]);

  useEffect(() => {
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

  useEffect(() => {
    !audioVisible && setAudioSource("");
  }, [audioVisible]);

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

  return (
    <div className={cx("wrapper")}>
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
      <Table
        className={cx("contract")}
        loading={loading}
      >
        <tbody>
          <tr className={cx("product_title")}>
            {approve
              && <th className={cx("check", "title")}>
                <Checkbox
                  checked={isCheckedAll}
                  visible={approve}
                  onClick={() => setChecked(!checked)}
                />
              </th>}
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
      <Dialog
        primary
        visible={audioVisible}
        className={cx("audio")}
        alignCenter="all"
      >
        <AudioDialog
          source={audioSource}
          setVisible={setAudioVisible}
        />
      </Dialog>
      <div className={cx("approval-actions", !approve && "inactive")}>
        <Button primary value="Huỷ" onClick={() => setApprove(false)} />
        <Button primary fill value="Lưu" onClick={() => handleClickApprove("Đã phê duyệt")} />
      </div>
    </div>
  );
};