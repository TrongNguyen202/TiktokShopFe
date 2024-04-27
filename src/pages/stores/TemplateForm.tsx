import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Col, Form, Input, Modal, Row, Spin, Upload, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactQuill from 'react-quill';
import CustomSelect from './CustomSelect';
import EditPriceForm from './EditPriceForm';
import { useCategoriesStore } from '../../store/categoriesStore';
import { buildNestedArraysMenu, getPathByIndex } from '../../utils';
import { useTemplateStore } from '../../store/templateStore';
import 'react-quill/dist/quill.snow.css';
// import { useShopsBrand } from '../../store/brandStore';

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function DraggableUploadListItem({ originNode, file }: { originNode: any; file: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'is-dragging h-[100%] w-[100%]' : ' h-[100%] w-[100%]'}
      {...attributes}
      {...listeners}
    >
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
}

const initColorOptions = [
  {
    label: 'Black',
    value: 'Black',
  },
  {
    label: 'Red',
    value: 'Red',
  },
  {
    label: 'Yellow',
    value: 'Yellow',
  },
  {
    label: 'White',
    value: 'White',
  },
  {
    label: 'Navy',
    value: 'Navy',
  },
  {
    label: 'Grey',
    value: 'Grey',
  },
  {
    label: 'Light Pink',
    value: 'Light Pink',
  },
];

const initSizeOptions = [
  {
    label: 'S',
    value: 'S',
  },
  {
    label: 'M',
    value: 'M',
  },
  {
    label: 'L',
    value: 'L',
  },
  {
    label: 'XL',
    value: 'XL',
  },
  {
    label: '2XL',
    value: '2XL',
  },
  {
    label: '3XL',
    value: '3XL',
  },
  {
    label: '4XL',
    value: '4XL',
  },
  {
    label: '5XL',
    value: '5XL',
  },
];

const initBadWordOptions = [
  {
    label: 'Tiktok',
    value: 'Tiktok',
  },
  {
    label: 'Test',
    value: 'Test',
  },
  {
    label: 'Demo',
    value: 'Demo',
  },
];

type TemplateFormProps = {
  onSaveTemplate: (data: any) => void;
  setShowModalAddTemplate: (value: boolean) => void;
  templateJson: any;
};

export default function TemplateForm({ onSaveTemplate, setShowModalAddTemplate, templateJson }: TemplateFormProps) {
  console.log('templateJson: ', templateJson);
  // const { getAllBrand, brands } = useShopsBrand();
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore();
  const { createTemplate, loading, getAllTemplate, updateTemplate } = useTemplateStore();
  const shopId = getPathByIndex(2);

  const [selectedColor, setSelectedColor] = useState(templateJson?.id ? templateJson.colors : []);
  const [selectedSize, setSelectedSize] = useState(templateJson?.id ? templateJson.sizes : []);
  const [selectedType, setSelectedType] = useState(templateJson?.id ? templateJson.type : []);
  const [selectedBadWord, setSelectedBadWord] = useState(templateJson?.id ? templateJson.badWords : []);
  const [isShowModalPrice, setShowModalPrice] = useState(false);
  const [sizeChart, setSizeChart] = useState(
    templateJson?.id && templateJson.size_chart
      ? [
          {
            uid: templateJson.size_chart?.id || 123,
            status: 'done',
            thumbUrl: `data:image/jpeg;base64,${templateJson.size_chart}`,
          },
        ]
      : [],
  );
  const [fixedImages, setFixedImages] = useState(
    templateJson?.id && Array.isArray(templateJson.fixed_images)
      ? templateJson.fixed_images.map((item, index) => {
          return {
            uid: index,
            status: 'done',
            thumbUrl: `data:image/jpeg;base64,${item}`,
          };
        })
      : [],
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [dataPriceState, setDataPriceState] = useState([]);
  const [description, setDescription] = useState('');

  const dataPrice = useRef(templateJson?.id ? templateJson.types : null);

  // const optionsBranch = brands?.brand_list?.map((item) => ({
  //   value: item.id,
  //   label: item.name,
  // }));
  const categoriesData = buildNestedArraysMenu(categoriesIsLeaf, '0');

  useEffect(() => {
    getAllCategoriesIsLeaf();
    if (templateJson?.id) {
      setDescription(templateJson.description);
    }
  }, []);

  useEffect(() => {
    // if (!templateJson?.id) {
    //   dataPrice.current = convertDataTable(selectedType, selectedSize);
    // }
    // dataPrice.current = convertDataTable(selectedType, selectedSize);
    setDataPriceState(convertDataTable(selectedType, selectedSize));
  }, [selectedSize, selectedType]);

  // const convertDataCategory = (data) => {
  //   const result = [];
  //   data.forEach((item) => {
  //     result.push({
  //       label: item.local_display_name,
  //       value: item.id,
  //     });
  //   });
  //   return result;
  // };

  const onSubmit = (value) => {
    const {
      template,
      colors,
      sizes,
      type,
      category,
      warehouse,
      is_cod_open,
      package_height,
      package_length,
      package_weight,
      package_width,
      bad_word,
      // brand_id,
      suffix_title,
    } = value;

    const dataSubmit = {
      name: template,
      colors,
      sizes,
      type,
      types: dataPrice.current,
      description,
      category_id: category,
      warehouse_id: warehouse,
      is_cod_open: is_cod_open || false,
      package_height,
      package_length,
      package_weight,
      package_width,
      badWords: bad_word,
      suffixTitle: suffix_title,
      size_chart: sizeChart[0]?.thumbUrl?.replace(/^data:image\/(png|jpg|jpeg);base64,/, '') || '',
      fixed_images: fixedImages.map((item) => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')),
      // brand_id: brand_id,
    };

    const onSuccess = () => {
      message.success('Thành công');
      getAllTemplate(shopId);
      setShowModalAddTemplate(false);
    };
    const onFail = (err: string) => {
      message.error(err);
    };
    // eslint-disable-next-line no-unused-expressions
    templateJson?.id && !templateJson?.isFromFile
      ? updateTemplate(templateJson?.id, dataSubmit, onSuccess, onFail)
      : createTemplate(dataSubmit, onSuccess, onFail);
    onSaveTemplate(dataSubmit);
    console.log('dataSubmit: ', dataSubmit);
  };

  function sortByType(arr, selectedType) {
    return arr.sort((a, b) => {
      return selectedType.indexOf(a.type) - selectedType.indexOf(b.type);
    });
  }

  const convertDataTable = (selectedType, selectedSize) => {
    const newData = [];
    const currentData = templateJson?.id ? [...templateJson.types] : [...dataPriceState];
    const resultData = [];

    if (!selectedType || !selectedType.length) return [];

    for (let i = 0; i < selectedSize.length; i++) {
      for (let j = 0; j < selectedType.length; j++) {
        newData.push({
          id: `${selectedType[j]}-${selectedSize[i]}`,
          size: selectedSize[i],
          type: selectedType[j],
          quantity: '',
          price: '',
        });
      }
    }

    newData.forEach((item) => {
      const index = currentData.findIndex((el) => el.id === item.id);
      if (index === -1) {
        resultData.push(item);
      } else {
        resultData.push(currentData[index]);
      }
    });
    return sortByType(resultData, selectedType);
  };

  const onSavePrice = (value) => {
    dataPrice.current = value;
    setDataPriceState(value);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    // setPreviewTitle(
    //   file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    // );
  };

  const onChangeSizeChart = ({ fileList: newFileList }) => {
    setSizeChart(newFileList);
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFixedImages((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleChangeFixedImages = ({ fileList: newFileList }) => {
    setFixedImages(newFileList);
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        className="mt-2"
      >
        <Spin spinning={loading}>
          <Form.Item
            label="Tên template"
            name="template"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên template!',
              },
            ]}
            sx={{ justifyContent: 'space-between' }}
            className="w-full"
            initialValue={templateJson?.id ? templateJson.name : ''}
          >
            <Input placeholder="Nhập tên template" />
          </Form.Item>
          <div className="flex gap-20">
            <div className="flex-1">
              <p className="font-semibold text-[#0e2482] text-[16px]">1. Các thông số chung</p>

              <Form.Item
                label="Danh mục:"
                name="category"
                rules={[{ required: true, message: 'Danh mục không được để trống' }]}
                initialValue={templateJson?.id ? templateJson.category_id : ''}
                // initialValue={["824328", "839944", "601226"]}
              >
                <Cascader
                  options={categoriesData}
                  // onChange={handleChangeCategories}
                  placeholder="Chọn danh mục"
                  showSearch={(input, options) => {
                    return (
                      options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onSearch={(value) => console.log(value)}
                />
              </Form.Item>

              <div className="block mt-3 mb-5">
                <span className="text-red-500">* </span>Mô tả:
                <ReactQuill theme="snow" value={description} onChange={setDescription} />
              </div>

              <div className="mb-3">
                <Form.Item
                  name="package_weight"
                  label="Cân nặng"
                  labelAlign="left"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập cân nặng!',
                    },
                  ]}
                  initialValue={templateJson?.id ? templateJson.package_weight : ''}
                >
                  <Input
                    placeholder="nhập vào(pound)"
                    type="number"
                    className="w-[300px] "
                    max={220}
                    suffix={
                      <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-2 my-1">
                        pound
                      </span>
                    }
                  />
                </Form.Item>

                <Row gutter={[15, 15]} className="items-center gap-2 justify-start break-words flex-nowrap">
                  <Col>
                    <div className="flex justify-between items-center h-[30px]">
                      <Form.Item
                        name="package_width"
                        className="break-words flex-nowrap mb-0"
                        initialValue={templateJson?.id ? templateJson.package_width : ''}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập chiều rộng!',
                          },
                        ]}
                      >
                        <Input
                          style={{ height: '30px', width: '150px' }}
                          placeholder="Width"
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              inch
                            </span>
                          }
                          max={393}
                          type="number"
                        />
                      </Form.Item>
                      <p className="mx-2 text-[#ccc]">X</p>
                      <Form.Item
                        name="package_length"
                        className="break-words flex-nowrap mb-0"
                        initialValue={templateJson?.id ? templateJson.package_length : ''}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập chiều dài!',
                          },
                        ]}
                      >
                        <Input
                          style={{ height: '30px', width: '150px' }}
                          placeholder="Length"
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              inch
                            </span>
                          }
                          max={393}
                          type="number"
                        />
                      </Form.Item>
                      <p className="mx-2 text-[#ccc]">X</p>
                      <Form.Item
                        name="package_height"
                        className="break-words flex-nowrap mb-0"
                        initialValue={templateJson?.id ? templateJson.package_height : ''}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập chiều cao!',
                          },
                        ]}
                      >
                        <Input
                          style={{ height: '30px', width: '150px' }}
                          placeholder="height"
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              inch
                            </span>
                          }
                          max={393}
                          type="number"
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Form.Item name="sizeChart" label="Ảnh Size Chart" className="mt-3">
                  <Upload
                    listType="picture-card"
                    fileList={sizeChart}
                    onPreview={handlePreview}
                    onChange={onChangeSizeChart}
                    beforeUpload={() => false}
                    previewFile={getBase64}
                    // multiple
                    // itemRender={(originNode, file) => (
                    //   <DraggableUploadListItem originNode={originNode} file={file} />
                    // )}
                  >
                    {sizeChart.length ? null : (
                      <button style={{ border: 0, background: 'none' }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}> Upload</div>
                      </button>
                    )}
                  </Upload>
                  {/* <input type='file'/> */}
                  <Modal open={previewOpen} title="" footer={null} onCancel={() => setPreviewOpen(false)}>
                    <img alt="" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Form.Item>

                <Form.Item name="fixedImages" label="Ảnh cố định" className="mt-3">
                  <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                    <SortableContext items={fixedImages?.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
                      <Upload
                        listType="picture-card"
                        fileList={fixedImages}
                        onPreview={handlePreview}
                        onChange={handleChangeFixedImages}
                        beforeUpload={() => false}
                        previewFile={getBase64}
                        multiple
                        // eslint-disable-next-line react/no-unstable-nested-components
                        itemRender={(originNode, file) => (
                          <DraggableUploadListItem originNode={originNode} file={file} />
                        )}
                      >
                        {fixedImages?.length >= 2 ? null : (
                          <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}> Upload</div>
                          </button>
                        )}
                      </Upload>
                    </SortableContext>
                  </DndContext>
                  {/* <input type='file'/> */}
                  <Modal open={previewOpen} title="" footer={null} onCancel={() => setPreviewOpen(false)}>
                    <img alt="" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Form.Item>
              </div>

              {/* <Form.Item
                label="Bật COD"
                name="is_cod_open"
                labelAlign="left"
                sx={{
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                }}
                layout="horizontal"
                initialValue={
                  templateJson?.id ? templateJson.is_cod_open : false
                }
              >
                <Switch
                  // checked={input}
                  defaultChecked={templateJson?.id ? templateJson.is_cod_open : false}
                  checkedChildren="Bật"
                  unCheckedChildren="Tắt"
                // onChange={() => {
                //   setInput(!input);
                // }}
                />
              </Form.Item> */}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#0e2482] text-[16px]">2. Các thông số riêng cho mỗi hàng</p>
              <Form.Item
                label="Màu"
                name="colors"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng lựa chọn màu!',
                  },
                ]}
                sx={{ justifyContent: 'space-between' }}
                initialValue={selectedColor}
              >
                <CustomSelect
                  optionsSelect={initColorOptions}
                  type="màu"
                  onChange={setSelectedColor}
                  selectedDefault={selectedColor}
                />
              </Form.Item>

              <Form.Item
                label="Size"
                name="sizes"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn size!',
                  },
                ]}
                initialValue={selectedSize}
              >
                <CustomSelect
                  optionsSelect={initSizeOptions}
                  type="size"
                  onChange={setSelectedSize}
                  selectedDefault={selectedSize}
                />
              </Form.Item>

              <Form.Item
                label="Loại"
                name="type"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn size!',
                  },
                ]}
                initialValue={selectedType}
              >
                <CustomSelect
                  optionsSelect={[]}
                  type="loại"
                  onChange={setSelectedType}
                  selectedDefault={selectedType}
                />
              </Form.Item>

              <Form.Item
                label="Bad word"
                name="bad_word"
                labelAlign="left"
                initialValue={templateJson?.id ? templateJson.badWords : []}
              >
                <CustomSelect
                  optionsSelect={initBadWordOptions}
                  type="bad word"
                  selectedDefault={selectedBadWord}
                  onChange={setSelectedBadWord}
                />
              </Form.Item>

              <Form.Item
                label="Suffix of product title"
                name="suffix_title"
                labelAlign="left"
                initialValue={templateJson?.id ? templateJson.suffixTitle : ''}
              >
                <Input placeholder="Thêm suffix" />
              </Form.Item>

              <Button
                type="primary"
                ghost
                onClick={() => setShowModalPrice(true)}
                icon={<EditOutlined />}
                className="block ml-auto mt-9"
              >
                Chỉnh sửa giá
              </Button>

              {isShowModalPrice && (
                <Modal
                  title="Chỉnh sửa giá"
                  open={isShowModalPrice}
                  // onOk={onRefuse}
                  onCancel={() => {
                    setShowModalPrice(false);
                  }}
                  footer={null}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  width={1000}
                  centered
                  maskClosable={false}
                >
                  <EditPriceForm
                    selectedSize={selectedSize}
                    setShowModalPrice={(value) => setShowModalPrice(value)}
                    onSavePrice={onSavePrice}
                    dataPrice={
                      // dataPrice.current ||
                      // convertDataTable(
                      //   selectedType,
                      //   selectedSize,
                      //   selectedColor
                      // )
                      dataPriceState
                    }
                  />
                </Modal>
              )}
            </div>
          </div>
          <div className="w-[400px] mx-auto">
            <Button className="mt-4 w-[200px]" block type="primary" htmlType="submit">
              {templateJson?.id && !templateJson?.isFromFile ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
}
