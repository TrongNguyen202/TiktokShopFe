import { callApi } from '../apis';

const getAllImage = (id:number,page:number)=>{
  return callApi(`/get-all-folder/${id}?page=${page}`, 'get');
}
const getAllParentFolder = ()=>{
  return callApi(`/folder-images`,'get');
}
const createParentFolder = (body:any) =>{
  return callApi(`/folder-images`,'post', body)
}
const createImage = (id:number,body:any)=>{
  return callApi(`/upload-folder-images/${id}`, 'post',body)
}

export const artwork = {
  getAllImage,
  getAllParentFolder,
  createParentFolder,
  createImage
};
