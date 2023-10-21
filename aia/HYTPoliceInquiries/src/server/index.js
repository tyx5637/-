// 引入 axios
import axios from 'axios';
if (process.env.NODE_ENV === 'development') {

}

/**
 * 获取字典列表数据
 * @param {*} params
 * @returns
 */
export const getDictList = (params = {}) => {
  const { systemCode = 'SYS_CODE_PUBLIC', dictType = '' } = params;
  return axios({
    url: `/aia-alarm-service/generalQuery/listByDictCode/${systemCode}/${dictType}`,
    method: 'get',
    headers: {
      Languagecode: localStorage.getItem('language') || 'zh-CN',
      Authorization: localStorage.getItem('Authorization')
    }
  });
};

/*
 * 列表-excel导出
 */
export const onDownLoadExcel = (data) => {
  return axios({
    url:`/aia-alarm-service/caseQuery/export`,
    method: 'post',
    data,
    responseType: 'blob',
    headers: {
      Languagecode: localStorage.getItem('language') || 'zh-CN',
      Authorization: localStorage.getItem('Authorization')
    }
  });
};
  