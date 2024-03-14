// tạo url api thêm sửa xoá template
import { callApi } from '../apis';

const getAllTemplate = () => {
  return callApi('/templates', 'get');
};

const createTemplate = (data) => {
  return callApi('/templates', 'post', data);
};

const updateTemplate = (id, data) => {
  return callApi(`/templates/${id}`, 'put', data);
};

const deleteTemplate = (id) => {
  return callApi(`/templates/${id}`, 'delete');
};
export const template = {
  getAllTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
