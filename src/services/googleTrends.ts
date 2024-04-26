import { callApi } from '../apis';

const getGoogleTrendOptions = () => {
  return callApi(`/ggtrend/options`, 'get');
};

const getGoogleTrendData = (query: string) => {
  return callApi(`/ggtrend/query${query || ''}`, 'get');
};

export const googleTrends = {
  getGoogleTrendOptions,
  getGoogleTrendData,
};
