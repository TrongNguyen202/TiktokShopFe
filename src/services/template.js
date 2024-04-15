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

const getAllDesignTemplate = () => {
  return callApi('/template-design', 'get');
};

const createDesignTemplate = (data) => {
  return callApi('/template-design', 'post', data);
};

const updateDesignTemplate = (id, data) => {
  return callApi(`/template-design/${id}`, 'put', data);
};

const deleteDesignTemplate = (id) => {
  return callApi(`/template-design/${id}`, 'delete');
};

export const template = {
  getAllTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllDesignTemplate,
  createDesignTemplate,
  updateDesignTemplate,
  deleteDesignTemplate,
};
