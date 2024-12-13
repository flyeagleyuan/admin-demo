export type oilListVO = {
  pageNo: string
  pageSize: string
  stationName: string
  provinceName?: string
  cityName?: string
  stationTypes?: any
  status?: number
  spStatus?: number
  oilCode?: string
}

export type putStatusVO = {
  ids: number
  status: number
}

export type oilStationVO = {
  id: string
}
