import { DeleteOutlined } from '@ant-design/icons';
import { Button, Image, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '../../../store/templateStore';
import ModalTemplateForm from './ModalTemplateForm';

export default function DesignTemplate({ checkedItems, setCheckedItems }) {
  const { getAllDesignTemplate, designTemplates, deleteDesignTemplate } = useTemplateStore();
  const [isShowModal, setShowModal] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    getAllDesignTemplate();
  }, []);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;
    if (CountSelectedItems === designTemplates.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  }, [checkedItems]);

  const handleCheckAllChange = (event) => {
    const newCheckedItems = designTemplates.reduce((acc, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleDeleteTemplate = (id) => {
    const onSuccess = () => {
      getAllDesignTemplate();
      message.success('Delete template success!');
    };
    const onFail = (err) => {
      message.error(err);
    };
    deleteDesignTemplate(id, onSuccess, onFail);
  };

  return (
    <div>
      <Button type="primary ml-auto block" onClick={() => setShowModal(true)}>
        Thêm template
      </Button>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex gap-2 items-center">
          <input type="checkbox" onChange={handleCheckAllChange} checked={isAllChecked} className="w-6 h-6" />{' '}
          <p className="font-semibold">Selected all</p>
        </div>
        <div>
          Total: <span className="font-semibold">{designTemplates ? designTemplates.length : 0} templates</span>
        </div>
      </div>
      <div className="flex gap-3 bg-[#F7F8F9] p-3 mt-3 flex-wrap ">
        {designTemplates && designTemplates.length
          ? designTemplates.map((item) => (
              <div
                key={item.id}
                className="bg-white relative rounded-lg overflow-hidden shadow-lg hover:shadow-md hover:shadow-blue-300 h-full"
              >
                <Image src={item.content.src} alt="template" width={150} height={150} />
                <p className="line-clamp-1 p-2" title={item.content.name}>
                  {item.content.name}
                </p>
                <div className="flex gap-1 p-2 justify-between">
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={!!checkedItems[item.id]}
                    onChange={handleCheckChange}
                    className="top-2 left-2 cursor-pointer w-6 h-6"
                  />
                  <p
                    className=" top-2 right-2 cursor-pointer text-red-500 text-[16px] h-7 w-7 flex justify-center items-center bg-gray-100 rounded-md hover:bg-slate-200"
                    onClick={() => handleDeleteTemplate(item.id)}
                  >
                    <Tooltip title="Xóa" placement="top">
                      <DeleteOutlined />
                    </Tooltip>
                  </p>
                </div>
              </div>
          ))
          : null}
      </div>
      {isShowModal && <ModalTemplateForm isShowModal={isShowModal} setShowModal={setShowModal} />}
    </div>
  );
}
