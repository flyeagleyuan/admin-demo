import request from '@/config/axios'
import { projectVO } from './types'
// 获得地区树
export const getProjectList = async (params: projectVO) => {
  return await request.get({ url: '/oil/project/page', params })
}
export const addProject = async (data: any) => {
  return await request.post({ url: '/oil/project/save', data })
}
export const deleteProject = async (data: any) => {
  return await request.post({ url: `/oil/project/delete/${data}` })
}
