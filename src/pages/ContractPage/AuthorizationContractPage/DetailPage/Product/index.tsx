import classNames from "classnames/bind";
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { images } from "~/assets";
import { AudioDialog } from "~/components/AudioDialog";
import Button from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { Dialog } from "~/components/Dialog";
import { Input } from "~/components/Input";
import { Loading } from "~/components/Loading";
import { OptionMenu } from "~/components/OptionMenu";
import { Table } from "~/components/Table";
import { CB_APPROVE_ITEMS } from "~/constants";
import { RootState, useAppDispatch } from "~/state";
import { getRecordsAction } from "~/state/thunk/record";
import { IContract, IGlobalConstantsType, IRecord, IUserDetail } from "~/types";

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
          onClick={() => handleCheckBox(record, isChecked)}
        >
          {approve
            && <td>
              <Checkbox checked={isChecked} />
            </td>}
          <td>{index + 1}</td>
          <td>
            <div>{record.nameRecord}</div>
            <div className={cx("subtitle")}>
              <div>{record.category}</div>
              <img src={images.ellipseEffect} alt="icon" />
              <div>{record.format}</div>
              <img src={images.ellipseEffect} alt="icon" />
              <div>{record.time}</div>
            </div>
          </td>
          <td>{record.ISRCCode}</td>
          <td>{record.singer}</td>
          <td>{record.author}</td>
          <td>{record.createdDate}</td>
          <td>
            {CB_APPROVE_ITEMS.map((item, index) => item.title === record.contractStatus
              && (
                <span key={index} className={cx("approved")}>
                  <img className={cx("icon")} src={item.icon} alt="icon" />
                  <p>{item.title}</p>
                </span>
              ))}
          </td>
          <td
            className={cx("listening")}
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
    checked
      ? setRecordArray(!approve ? records : editRecords)
      : setRecordArray([]);
  }, [checked]);

  useEffect(() => {
    isCheckedAll ? setRecordArray(editRecords) : setRecordArray([]);
  }, [isCheckedAll]);

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

  const handleCheckBox = (record: IRecord, isChecked: boolean) => {
    !isChecked
      ? setRecordArray([...recordArray, { ...record }])
      : setRecordArray(() => recordArray.filter(item => item.docId !== record.docId))
  };

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
        isApprove={approve}
        isCheckedAll={isCheckedAll}
        thead={["STT", "Tên bản ghi", "Mã ISRC", "Ca sĩ", "Tác giả", "Ngày tải",
          "Tình trạng", '']}
        className={cx("contract")}
        setIsCheckedAll={setIsCheckedAll}
      >
        <ProductItem
          data={!approve ? searchResult : editRecords}
          recordArray={recordArray}
          handleCheckBox={handleCheckBox}
          approve={approve}
          setVisible={setAudioVisible}
          setAudioSource={setAudioSource}
        />
      </Table>
      <Dialog
        primary
        visible={audioVisible}
        content="audio"
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
      <Loading loading={loading} />
    </div>
  );
};