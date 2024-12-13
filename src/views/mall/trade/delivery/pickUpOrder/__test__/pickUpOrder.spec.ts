// 快递公司单元测试
import { ElInput } from 'element-plus'
import { beforeEach, describe, expect, test, vi, expectTypeOf, afterEach } from 'vitest'
import Express from '../index.vue'
import ExpressForm from '../ExpressForm.vue'
import { RouterLinkStub, config, flushPromises, mount } from '@vue/test-utils'
import { Icon } from '@/components/Icon/index'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap/index'
import { DictTag } from '@/components/DictTag'
import { ElTag } from 'element-plus'
import { ElButton, ElUpload } from 'element-plus'
import { ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ElTableColumn } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import { DictDataType, getDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import * as TradeOrderApi from '@/api/mall/trade/order'
import dayjs from 'dayjs'
import { expectTable } from '@/utils/test'
config.global.stubs = {
  RouterLink: RouterLinkStub,
  Icon,
  Dialog,
  'el-tag': ElTag,
  ContentWrap,
  'dict-tag': DictTag,
  Pagination,
  ElButton,
  ElDropdownMenu,
  ElDropdownItem,
  ElUpload
}
config.global.mocks = {}
// @ts-ignore
config.global.plugins = [dayjs]

config.global.renderStubDefaultSlot = true
config.global.directives = {
  hasPermi: () => true
}

const companyList = [
  {
    id: 1024,
    no: '1146347329394184195',
    createTime: '2019-08-24T14:15:22Z',
    type: 1,
    terminal: 1,
    userId: 2048,
    userIp: '127.0.0.1',
    userRemark: '你猜',
    status: 1,
    productCount: 10,
    finishTime: '2019-08-24T14:15:22Z',
    cancelTime: '2019-08-24T14:15:22Z',
    cancelType: 10,
    remark: '你猜一下',
    payOrderId: 1024,
    payStatus: true,
    payTime: '2019-08-24T14:15:22Z',
    payChannelCode: 'wx_lite',
    totalPrice: 1000,
    discountPrice: 100,
    deliveryPrice: 100,
    adjustPrice: 100,
    payPrice: 1000,
    deliveryType: 10,
    pickUpStoreId: 10,
    pickUpVerifyCode: 10,
    deliveryTemplateId: 1024,
    logisticsId: 1024,
    logisticsNo: '1024',
    deliveryTime: '2019-08-24T14:15:22Z',
    receiveTime: '2019-08-24T14:15:22Z',
    receiverName: '张三',
    receiverMobile: '13800138000',
    receiverAreaId: 110000,
    receiverDetailAddress: '中关村大街 1 号',
    afterSaleStatus: 1,
    refundPrice: 100,
    couponId: 1024,
    couponPrice: 100,
    pointPrice: 100,
    vipPrice: 888,
    brokerageUserId: 1,
    receiverAreaName: '上海 上海市 普陀区',
    items: [
      {
        id: 1024,
        incrCount: 100
      }
    ],
    user: {
      mobile: '15601691300',
      status: 'Mg==',
      nickname: '李四',
      avatar: 'https://www.iocoder.cn/x.png',
      name: '李四',
      sex: 'MQ==',
      areaId: 4371,
      areaName: '上海上海市普陀区',
      birthday: '2019-08-24T14:15:22Z',
      mark: '我是小备注',
      tagIds: [1, 2],
      levelId: 1,
      groupId: 1,
      id: 23788,
      registerIp: '127.0.0.1',
      loginIp: '127.0.0.1',
      loginDate: '2019-08-24T14:15:22Z',
      createTime: '2019-08-24T14:15:22Z',
      point: 100,
      totalPoint: 2000,
      tagNames: '[红色, 快乐]',
      levelName: '黄金会员',
      groupName: '购物达人',
      experience: 200
    },
    brokerageUser: {
      mobile: '15601691300',
      status: 'Mg==',
      nickname: '李四',
      avatar: 'https://www.iocoder.cn/x.png',
      name: '李四',
      sex: 'MQ==',
      areaId: 4371,
      areaName: '上海上海市普陀区',
      birthday: '2019-08-24T14:15:22Z',
      mark: '我是小备注',
      tagIds: [1, 2],
      levelId: 1,
      groupId: 1,
      id: 23788,
      registerIp: '127.0.0.1',
      loginIp: '127.0.0.1',
      loginDate: '2019-08-24T14:15:22Z',
      createTime: '2019-08-24T14:15:22Z',
      point: 100,
      totalPoint: 2000,
      tagNames: '[红色, 快乐]',
      levelName: '黄金会员',
      groupName: '购物达人',
      experience: 200
    }
  }
]
const summeryList = [
  {
    orderCount: 1024,
    orderPayPrice: 1024,
    afterSaleCount: 1024,
    afterSalePrice: 1024
  }
]
const data = {
  number: ['id', 'sort', 'chargeMode'],
  string: ['name'],
  date: ['createTime']
}
const getDeliveryExpressPage = vi
  .spyOn(TradeOrderApi, 'getOrderPage')
  .mockResolvedValue({ list: companyList } as any)
const getSummeryList = vi
  .spyOn(TradeOrderApi, 'getOrderSummary')
  .mockResolvedValue({ list: summeryList } as any)
describe('test express', async () => {
  const wrapper = mount(Express, {
    global: {
      mocks: {
        dateFormatter
      },
      plugins: [dateFormatter]
    },
    stubs: {},
    shallow: false
  })
  await flushPromises()
  beforeEach(async () => {
    //@ts-ignore
    await wrapper.vm.getList()
    await flushPromises()
  })
  await flushPromises()
  const tableVm = wrapper.findComponent({ ref: 'tableRef' })
  const codeInput = wrapper.findComponent({ ref: 'code' })
  const nameInput = wrapper.findComponent({ ref: 'name' })
  const searchBtn = wrapper.findComponent({ ref: 'searchBtn' })
  const addBtn = wrapper.findComponent({ ref: 'addBtn' })
  const formRef = wrapper.findComponent({ ref: 'formRef' })

  // 测试table渲染
  test('test table', () => {
    // 1.判断接口是否被调用
    expect(getDeliveryExpressPage).toHaveBeenCalled()
    expect(getSummeryList).toHaveBeenCalled()
    //获取table中的数据json
    const trEles = wrapper.findAll('.el-table__body-wrapper tr')
    // console.log(companyList.length,trEles.length,'length')
    expect(companyList.length).toEqual(trEles.length)
    expect(tableVm.vm.data.length).toEqual(companyList.length)
    //mock数据与组建渲染数据一致
    expect(tableVm.vm.data).toEqual(companyList)

    /**
     * 2.判断tableColumn的属性的值prop，companyList是否包含
     * （table中的prop值必须时companyList中存在的，如不存在检查是前端写错或者后端没给）
     */
    const tableColumnVm = wrapper.findAllComponents({ name: 'ElTableColumn' })
    const tableColumnProps = new Map()
    tableColumnVm.forEach((cloVm, index) => tableColumnProps.set(index, cloVm.vm.prop))
    const tableObj = companyList[0]
    tableColumnProps.forEach((key) => {
      if(key.includes('.')) key = key.substring(0,key.indexOf('.'))
      console.log(key,'key')
      key ? expect(tableObj.hasOwnProperty(key)).toEqual(true) : void 0
    })
    expectTable(companyList, tableColumnProps, trEles, data)
  })
  // 测试form表单提交
  test('test search-form-submit', async () => {
    vi.spyOn(TradeOrderApi, 'getOrderPage').mockImplementation((req) => {
      //断言用户模拟的请求是否和axios中的一致
      // @ts-ignore
      const bodyReq = wrapper.emitted().data[0][0]
      //断言用户模拟的请求是否和axios中的一致
      expect(bodyReq).toEqual(req)

      return Promise.resolve({ list: companyList })
    })
    // 设置codeInput的值
    await codeInput.setValue('SF')
    // 设置公司名称的值
    await nameInput.setValue('顺丰快递')
    await searchBtn.trigger('click')
    await flushPromises()
  })
  // 测试form表单重置
  test('test search-form-reset', async () => {
    vi.spyOn(TradeOrderApi, 'getOrderPage').mockImplementation((req) => {
      //断言用户模拟的请求是否和axios中的一致
      // @ts-ignore
      const bodyReq = wrapper.emitted().data[0][0]
      //断言用户模拟的请求是否和axios中的一致
      expect(bodyReq).toEqual(req)

      return Promise.resolve({ list: companyList })
    })
    // 设置codeInput的值
    await codeInput.setValue('')
    // 设置公司名称的值
    await nameInput.setValue('')
    await searchBtn.trigger('click')
    await flushPromises()
  })
  // 测试新增按钮
  test('test add-btn', async () => {
    await addBtn.trigger('click')
    // console.log(formRef.vm.dialogVisible)
    //断言弹窗已经打开
    expect(formRef.vm.dialogVisible).toEqual(true)
  })
  // 测试新增的form表单确定按钮
  const responseData = {
    code: 200,
    data: 0,
    msg: 'string'
  }
  // vi.spyOn(TradeOrderApi, 'createDeliveryExpressTemplate').mockImplementation((req) => {
  //   //断言用户模拟的请求是否和axios中的一致
  //   // @ts-ignore
  //   const bodyReq = wrapper.emitted().data[0][0]
  //   //断言用户模拟的请求是否和axios中的一致
  //   expect(bodyReq).toEqual(req)

  //   return Promise.resolve(responseData)
  // })

  // test('test add-form-submit', async () => {
  //   await addBtn.trigger('click')
  //   // 新增的form表单选项
  //   expect(formRef.vm.dialogVisible).toEqual(true)
  //   await flushPromises()
  //   const addCode = formRef.findComponent({ ref: 'addCode' })
  //   const addName = formRef.findComponent({ ref: 'addName' })
  //   // const addLogo = formRef.findComponent({ ref: 'addLogo' })
  //   // const uploadImage = addLogo.findComponent({ref:'uploadRef'})
  //   const addSort = formRef.findComponent({ ref: 'addSort' })
  //   // const addStatus = formRef.findComponent({ ref: 'addStatus' })
  //   await addCode.setValue('AA')
  //   await addName.setValue('AA快递')
  //   // await uploadImage.setValue(
  //   //   'http://192.168.11.204:21000/admin-api/infra/file/4/get/99fc3d58605c47a8af688a0dd2f19ea5679a8089917f1e17a5a83a2dda001b5c.jpeg'
  //   // )
  //   await addSort.setValue(10)
  //   // await addStatus.setValue(0)
  // })
})
