export type contractListVO = {
  pageNo: number
  pageSize: number
  name?: string
  startTime?: string
  endTime?: string
}
export interface addContractVO {
  id?: number
  code: string
  name: string
  content: string
}
export interface historyContractVO {
  pageNo: number
  pageSize: number
  name: string
  startTime: string
  endTime: string
  code: string
}
