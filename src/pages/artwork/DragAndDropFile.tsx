import React, { useCallback, useState } from 'react';
import { Spin, message } from 'antd';
import { useDropzone } from 'react-dropzone';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { AxiosResponse } from 'axios';

import { RepositoryRemote } from '../../services';
import { handleAxiosError } from '../../utils/handleAxiosError';
import { resolve } from 'path';
import { rejects } from 'assert';
import FolderDetail from './FolderDetail';

export default function DragAndDropFile({
  onFinish,
  id
}: {
  onFinish: any;
  id:number
}) {
  const [isLoading, setLoading] = useState(false);
  const [isUpload,setIsUpload] = useState(false)
  const onSendMultipleFile = useCallback(async (files: Blob[]) => {
    if (!files?.length) return;
    const uploadPromises = files.map((file:any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64:any = reader.result?.toString().split(',')[1]; 
                console.log("hehe",file)
                if (base64) {
                   
                    resolve(base64);
                } else {
                    reject(new Error("Failed to read file as base64."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); 
        }).then((base64:any) => {
            
            let data:any = {}
            const image_data  =[{
              name:file?.name,
              base_64:base64
            }]
            data ={
              image_data:image_data
            }
           
              
            
            return RepositoryRemote.artwork.createImage(id, data);
        });
    });
    try {
        setLoading(true);
        const response = await Promise.all(uploadPromises);
        message.success('Upload successfully');
        onFinish(response);
        setIsUpload(!isUpload)
    } catch (error) {
        message.error(`${handleAxiosError(error)}`);
    } finally {
        setLoading(false);
    }
}, [onFinish, handleAxiosError]);

  const handleSplitFile = useCallback((acceptedFiles: Blob[]) => {
    const largeFiles = [];
    const smallFiles: Blob[] = [];
    acceptedFiles.forEach((file) => {
      if (file.size > 100 * 1024 * 1024) {
        largeFiles.push(file);
      } else {
        smallFiles.push(file);
      }
    });
    if (largeFiles.length > 0) {
      message.warning(`There are ${largeFiles.length} files exceeding 40MB`);
    }
    if (smallFiles.length) onSendMultipleFile(smallFiles);
  }, [onSendMultipleFile]);



  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    handleSplitFile(acceptedFiles);
  }, [handleSplitFile]);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
  });

  return (
    <div>
      <Spin spinning={isLoading}>
        <div
          {...getRootProps({ className: `dropzone` })}
          className="h-[150px] w-full bg-white border-dashed border-[1px] border-gray-300 rounded-md flex justify-center items-center relative flex-col gap-2 mb-3"
        >
          {isDragActive && (
            <div className="dropzone--isActive bg-blue-200 border-dashed border-[1px] border-primary h-[150px] w-full rounded-md absolute inset-0 opacity-50" />
          )}
          <CloudUploadOutlined className="text-primary text-[36px]" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <p className="text-[#172b4d] font-semibold">Click to upload or drag and drop</p>
          <div className="text-red-500 text-[12px]">
            <p>
              Only <strong>JPG</strong> is supported up to a max file size of <strong>40MB</strong>
            </p>
            <p>
              Limit: <strong>4MB</strong>
            </p>
          </div>
        </div>
        <div>
          <FolderDetail id={id} isUpload ={isUpload} />
        </div>
      </Spin>
    </div>
  );
}
