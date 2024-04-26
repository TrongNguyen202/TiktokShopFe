// tạo url api thêm sửa xoá template
import { callApi } from '../apis';

const getAllTemplate = () => {
  return callApi('/templates', 'get');
};

const createTemplate = (data: Record<string, unknown>) => {
  return callApi('/templates', 'post', data);
};

const updateTemplate = (id: string, data: Record<string, unknown>) => {
  return callApi(`/templates/${id}`, 'put', data);
};

const deleteTemplate = (id: string) => {
  return callApi(`/templates/${id}`, 'delete');
};

const getAllDesignTemplate = () => {
  return callApi('/template-design', 'get');
};

const createDesignTemplate = (data: Record<string, unknown>) => {
  return callApi('/template-design', 'post', data);
};

const updateDesignTemplate = (id: string, data: Record<string, unknown>) => {
  return callApi(`/template-design/${id}`, 'put', data);
};

const deleteDesignTemplate = (id: string) => {
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
