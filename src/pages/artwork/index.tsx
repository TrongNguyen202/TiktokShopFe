import React, { useEffect, useState } from 'react';
import { useFolderImageStore } from '../../store/artworkStore';
import { message, Input, Modal } from 'antd';
import { FolderAddOutlined, FolderOpenFilled } from '@ant-design/icons';
import Draggable from 'react-draggable';
import DragAndDropFile from './DragAndDropFile';



const Artwork = () => {
  const { getAllParentFolders, folders, loading, createParentFolders } = useFolderImageStore();
  const [newFolderName, setNewFolderName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [messageApi, contextHolder] = message.useMessage();
  const [isModelDetail,setIsModelDetail] = useState(false);
  const [selectIdFolder,setSelectIdFolder] = useState(10000000)
  useEffect(() => {
    const onSuccess = () => {
      // Handle success if needed
    };

    const onFail = (error:string) => {
      message.error(error);
    };

    getAllParentFolders(onSuccess, onFail);
  }, []);

  const handleCreateFolder = () => {
  
  
    setNewFolderName(""); 
    setIsModalVisible(false); 
    const onSuccess = (res:any) => {
      messageApi.success("upload thanh cong")
      getAllParentFolders();
    };


    const onFail = (error:string) => {
      message.error(error);
    };
    console.log("payload", newFolderName)
    let data = {
      name:newFolderName
    }
    
   createParentFolders(onSuccess,onFail,data)
  };

  const handleDrag = (e:any, ui:any) => {
    const { x, y } = position;
    setPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const handleFolderDetail =(id:number)=>{
    setIsModelDetail(true)
    setSelectIdFolder(id)


  }

const handleUploadImage =()=>{
  
}

  return (
    <div className='flex flex-wrap p-4'>
      {contextHolder}
      {Object.values(folders).map((folder:any, index) => (
        <div key={index} className='w-1/4 p-2 cursor-pointer'> 
          <div className='bg-gray-200 p-4 rounded-lg shadow-md'>
            <div className='flex items-center' onClick={()=>handleFolderDetail(folder.id)}>
              
              <div className='mr-5'><FolderOpenFilled onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/></div>
              <div className='truncate'>{folder.name}</div>
            </div>
          </div>
        </div>
      ))}
      <Draggable position={position} onDrag={handleDrag}>
                <div className='cursor-pointer'>
                  <FolderAddOutlined 
            onClick={() => setIsModalVisible(true)}
            style={{ cursor: 'pointer', fontSize: 100 }} 
            onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
                </div>
              </Draggable>
      <Modal
        title="Create New Folder"
        visible={isModalVisible}
        onOk={handleCreateFolder}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input 
          placeholder="Enter folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
      </Modal>

      <Modal  title = "Images"
      visible = {isModelDetail}
      onCancel={() => setIsModelDetail(false)}
      width={5000}

      >
      <DragAndDropFile id={selectIdFolder}  onFinish={() => handleUploadImage()} />
      
      
      
      </Modal>
     
      

    </div>
  );
};

export default Artwork;
