import { Button, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useGoogleTrendStore } from '../../store/googleTrendStore';

const initDataKeyword = [
  {
    label: 'poster',
    value: 'poster',
  },
  {
    label: 't shirt',
    value: 't shirt',
  },
  {
    label: 'sweater',
    value: 'sweater',
  },
  {
    label: 'hoodie',
    value: 'hoodie',
  },
  {
    label: 'blanket',
    value: 'blanket',
  },
  {
    label: 'shirt',
    value: 'shirt',
  },
  {
    label: 'sticker',
    value: 'sticker',
  },
  {
    label: 'mug',
    value: 'mug',
  },
  {
    label: 'sweatshirt',
    value: 'sweatshirt',
  },
  {
    label: 'hat',
    value: 'hat',
  },
  {
    label: 'coffee mug',
    value: 'coffee mug',
  },
];

const initDataTimes = [
  {
    label: '1_hour',
    value: '1_hour',
  },
  {
    label: '4_hours',
    value: '4_hours',
  },
  {
    label: '1_day',
    value: '1_day',
  },
  {
    label: '7_days',
    value: '7_days',
  },
];

const initTrendData = {
  keyword: 'shirt',
  time_frame: '1_day',
  data: [
    {
      crawled_at: '22/03/2024 ---- 11:08:49',
      content: '11111111111111111111',
    },
    {
      crawled_at: '22/03/2024 ---- 10:20:30',
      content: '2222222222222222',
    },
  ],
};

export default function GoogleTrends() {
  const { getGoogleTrendOptions, googleTrendsOptions, loading } = useGoogleTrendStore();

  const [keywordOptions, setKeywordOptions] = useState(initDataKeyword);
  const [timeOptions, setTimeOptions] = useState(initDataTimes);
  const [trendsData, setTrendsData] = useState(initTrendData);

  const [params, setParams] = useState({
    keyword: 'poster',
    time_frame: '1_hour',
  });

  const convertDataOptions = (data) => {
    return data.map((item) => {
      return {
        label: item,
        value: item,
      };
    });
  };

  useEffect(() => {
    const onSuccess = (data) => {
      setKeywordOptions(convertDataOptions(data?.keywords));
      setTimeOptions(convertDataOptions(data?.time_frames));
      setParams({
        keyword: data?.keywords[0],
        time_frame: data?.time_frames[0],
      });
    };
    const onFail = (error) => {
      message.error(error);
    };
    getGoogleTrendOptions(onSuccess, onFail);
  }, []);

  const onSubmit = () => {
    // const onSuccess = (data) => {
    //   setTrendsData(data);
    // }
    // const onFail = (error) => {
    //   message.error(error);
    // }
    // getGoogleTrendOptions(params, onSuccess, onFail);
    console.log('params: ', params);
  };

  const { keyword, time_frame, data } = trendsData ?? {};
  return (
    <div className="p-10">
      <div className="flex gap-3 items-end ">
        <div className="flex flex-col gap-1">
          <label>Keywords</label>
          <Select
            value={params.keyword}
            style={{
              width: 220,
            }}
            loading={loading}
            onChange={(value) => setParams((prev) => ({ ...prev, keyword: value }))}
            options={keywordOptions}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Time frame</label>
          <Select
            value={params.time_frame}
            style={{
              width: 220,
            }}
            loading={loading}
            onChange={(value) => setParams((prev) => ({ ...prev, time_frame: value }))}
            options={timeOptions}
          />
        </div>
        <Button type="primary" onClick={onSubmit}>
          Xem dữ liệu
        </Button>
      </div>

      <div>
        <p className="text-[22px] mt-10">
          Dữ liệu cho keyword: <span className="font-semibold">{keyword}</span>, timeframe:{' '}
          <span className="font-semibold">{time_frame}</span>
        </p>

        {data && data.length ? (
          data.map((item, index) => {
            return (
              <div
                key={index}
                className="border-solid border-gray-300 py-3 mt-3 border-t-0 border-r-0 border-l-0 border-[1px]"
              >
                <p>
                  Cào lúc: <span className="font-semibold">{item.crawled_at}</span>
                </p>
                <p className="p-5 rounded-md bg-[#F8F9FB] mt-2">{item.content}</p>
              </div>
            );
          })
        ) : (
          <p>Không lấy được dữ liệu</p>
        )}
      </div>
    </div>
  );
}
