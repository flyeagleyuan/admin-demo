import request from '@/config/axios'
import { ChannelVO } from './types'
// 获得地区树
export const getChannelList = async (params: ChannelVO) => {
  return await request.get({ url: '/common/oil/page', params })
}
export const addChannel = async (data: any) => {
  return await request.post({ url: '/common/oil/save', data })
}
export const deleteChannel = async (data: any) => {
  return await request.post({ url: `/common/oil/delete/${data}` })
}
