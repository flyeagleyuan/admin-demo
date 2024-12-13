import request from '@/config/axios'
import type { contractListVO, addContractVO, historyContractVO } from './types'
export const getContractList = (params: contractListVO) => {
  return request.post({ url: '/common/agreement/pageQuery', data: params })
}
export const addContract = (params: addContractVO) => {
  return request.post({ url: '/common/agreement/save', data: params })
}

export const updateContract = (params: addContractVO) => {
  return request.post({ url: '/common/agreement/update', data: params })
}
export const getHistoryContract = (params: historyContractVO) => {
  return request.post({ url: '/common/agreement/updateHistoryQuery', data: params })
}
export const delOneContract = (id: number) => {
  return request.post({ url: `/common/agreement/delist/${id}` })
}
export const delAllContract = (data: any) => {
  return request.post({ url: `/common/agreement/batchDelist`, data })
}
