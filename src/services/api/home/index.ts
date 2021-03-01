import axiosInstance from '@src/services/axios';

// 获取盒子/相机列表
export const getBoxCameraList = () => axiosInstance.get('/box-camera/list');

// 新增盒子
export const postBoxAdd = data => axiosInstance.post('/box/add', data);

// 删除盒子
export const postBoxDelete = data => axiosInstance.post('/box/delete', data);

// 修改盒子
export const postBoxUpdate = data => axiosInstance.post('/box/update', data);

// 新增相机
export const postCameraAdd = data => axiosInstance.post('/camera/add', data);

// 删除相机
export const postCameraDelete = data =>
  axiosInstance.post('/camera/delete', data);

// 修改相机
export const postCameraUpdate = data =>
  axiosInstance.post('/camera/update', data);

// 获取拍摄流列表
export const getProcessList = () => axiosInstance.get('/process/list');

// 新增拍摄流
export const postProcessAdd = cams => axiosInstance.post('/process/add', cams);

// 拍摄
export const actionShoot = () => axiosInstance.post('/action/shoot');
