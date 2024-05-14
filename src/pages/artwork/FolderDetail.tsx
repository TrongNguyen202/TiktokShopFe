import { Button, Modal, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFolderImageStore } from '../../store/artworkStore';
import Scrollbars from 'react-custom-scrollbars';

export default function FolderDetail({ id, isUpload }: { id: number, isUpload: boolean }) {
  const { getAllFromFolder, loading, images,resetImages } = useFolderImageStore();
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isAllPagesLoaded, setIsAllPagesLoaded] = useState(false);

 

  useEffect(() => {
    const onSuccess = (data:any) => {
      if(data.next_page ==null){
        setIsAllPagesLoaded(true);
        message.error("bạn đã load đủ số trang")
        

      }
    };

    const onFail = (error: string) => {
      message.error(error);
    };

    getAllFromFolder(onSuccess, onFail, id, page);
  }, [id, isUpload, page]);

  useEffect (()=>{
  resetImages ()
  setPage(1)
  },[id])
  useEffect(() => {
    if (!isFetching) return;

    setPage((prevPage) => prevPage + 1);
    setIsFetching(false);
    const onSuccess = () => {
      // Handle success if needed
    };

    const onFail = (error: string) => {
      message.error(error);
    };
    getAllFromFolder(onSuccess, onFail, id, page);
  }, [isFetching]);

const handleFetchingData =()=>{
  setIsFetching(!isFetching)
}

  return (
    <Scrollbars
      style={{ height: '500px', overflowY: 'hidden', background: '#f5f5f5' }}
      
      renderThumbVertical={({ style, ...props }) => (
        <div {...props} style={{ ...style, backgroundColor: '#ccc' }} />
      )}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
        <div className="grid grid-cols-5 gap-4">
          {images.map((image: any) => (
            <div
              key={image.id}
              className="p-4 border rounded-md flex flex-col gap-1 items-center bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md hover:shadow-blue-400 duration-300 cursor-pointer"
            >
              <img src={image.image_url} alt={image.image_name} className="w-full h-auto rounded-md" />
              <p className="font-semibold line-clamp-1 px-3 mb-2 hover:shadow-md hover:text-blue-400 duration-300 cursor-pointer">
                {image.image_name}
              </p>
            </div>
          ))}
        </div>
        <div
  className='text-center font-serif hover:shadow-md hover:text-blue-400 duration-300 cursor-pointer text-4xl'
  onClick={() => handleFetchingData()}
  aria-disabled={isAllPagesLoaded ? "true" : "false"}
>
  Load more
</div>

        </div>
      )}
    </Scrollbars>
  );
}
