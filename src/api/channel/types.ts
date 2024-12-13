export type ChannelVO = {
  pageNo: number
  pageSize: number
  name?: string
  code?: string
  cardNo?: string
  provinceCode?: any
  cityCode?: string
  beginUpdateTime?: string
  endUpdateTime?: string
}

export type putStatusVO = {
  ids: number
  status: number
}

export type oilStationVO = {
  id: string
}
