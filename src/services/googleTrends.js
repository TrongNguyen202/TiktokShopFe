import { callApi } from '../apis';

const getGoogleTrendOptions = () => {
  return callApi(`/ggtrend/options`, 'get');
};

export const googleTrends = {
  getGoogleTrendOptions,
};
