import request from '@/config/axios'

export interface OrderVO {
  id: number
  merchantId: number
  appId: number
  channelId: number
  channelCode: string
  merchantOrderId: string
  subject: string
  body: string
  notifyUrl: string
  notifyStatus: number
  amount: number
  channelFeeRate: number
  channelFeeAmount: number
  status: number
  userIp: string
  expireTime: Date
  successTime: Date
  notifyTime: Date
  successExtensionId: number
  refundStatus: number
  refundTimes: number
  refundAmount: number
  channelUserId: string
  channelOrderNo: string
  createTime: Date
  orderNo: string
  spOrderNo: string
  amountTotal: number
}

export interface OrderPageReqVO extends PageParam {
  /**
   * 创建结束时间
   */
  endCreateDate?: string
  /**
   * 项目ID
   */
  oemId?: string
  /**
   * 用户下单手机号码
   */
  orderMobile?: string
  /**
   * 芯安微订单编号
   */
  orderNo?: string
  /**
   * 订单状态
   */
  orderStatus?: string
  /**
   * 渠道订单编号
   */
  outTradeNo?: string
  /**
   * 渠道ID
   */
  spId?: string
  /**
   * 创建起始时间
   */
  startCreateDate?: string
  [property: string]: any
}

export interface OrderExportReqVO {
  merchantId?: number
  appId?: number
  channelId?: number
  channelCode?: string
  merchantOrderId?: string
  subject?: string
  body?: string
  notifyUrl?: string
  notifyStatus?: number
  amount?: number
  channelFeeRate?: number
  channelFeeAmount?: number
  status?: number
  expireTime?: Date[]
  successTime?: Date[]
  notifyTime?: Date[]
  successExtensionId?: number
  refundStatus?: number
  refundTimes?: number
  channelUserId?: string
  channelOrderNo?: string
  createTime?: Date[]
}
//查询订单总数据
export const getOrderAggregateData = async (params: any) => {
  return await request.get({ url: '', params })
}

// 查询列表支付订单
export const getOrderPage = async (params: OrderPageReqVO) => {
  // return await request.get({ url: '/pay/order/page', params })
  return await request.get({ url: '/oil/order', params })
}

//  // 查询详情支付订单
// export const getOrder = async (orderId: number) => {
//   return await request.get({ url: `/oil/order/${orderId}` })
// }

// 获得支付订单的明细
export const getOrderDetail = async (orderId: number) => {
  return await request.get({ url: `/oil/order/${orderId}` })
}

//订单退款
export const refundOrder = (orderId: number, applyMemo: string) => {
  return request.post({
    url: `/oil/refund/createRefund`,
    data: {
      orderId,
      applyMemo
    }
  })
}

// 提交支付订单
export const submitOrder = async (data: any) => {
  return await request.post({ url: '/pay/order/submit', data })
}

// 导出支付订单
export const exportOrder = async (params: OrderExportReqVO) => {
  return await request.download({
    url: '/oil/order/export',
    params
  })
}

//订单统计

export interface AggregateDataVO {
  tradeCount: number
  refundCount: number
  amount: number
  serviceFee: number
  charges: number
  spDiscount: number
}
export const getAggregateData = (params: { startDate: string; endDate: string }) => {
  return request.get({ url: '/oil/order/sum', params })
}
