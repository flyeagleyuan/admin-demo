import request from '@/config/axios'
import { getRefreshToken } from '@/utils/auth'
import type { oilListVO, putStatusVO, oilStationVO } from './types'
export const getOilList = (params: oilListVO) => {
  return request.get({ url: '/oil/station/page', params })
}
export const putOilStatus = (data: putStatusVO) => {
  return request.post({ url: '/oil/station/updateStatus', data })
}
export const getOilStationInfo = (params: oilStationVO) => {
  return request.get({ url: '/oil/station/getStationById', params })
}
export const exportExcel = (params: oilListVO) => {
  return request.post({ url: '/oil/station/export', data:params})
}
