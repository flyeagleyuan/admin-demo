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
import * as DeliveryPickUpStoreApi from '@/api/mall/trade/delivery/pickUpStore'
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
    name: '李四',
    introduction: '我是门店简介',
    phone: '15601892312',
    areaId: 18733,
    detailAddress: '复旦大学路 188 号',
    logo: 'https://www.iocoder.cn/1.png',
    openingTime:"08:30",
    closingTime:"23:12",
    latitude: 5.88,
    longitude: 6.99,
    status: 1,
    id: 23128,
    createTime: '2019-08-24T14:15:22Z'
  },
  {
    name: '李四',
    introduction: '我是门店简介',
    phone: '15601892312',
    areaId: 18733,
    detailAddress: '复旦大学路 188 号',
    logo: 'https://www.iocoder.cn/1.png',
    openingTime:"08:30",
    closingTime:"23:12",
    latitude: 5.88,
    longitude: 6.99,
    status: 1,
    id: 23128,
    createTime: '2019-08-24T14:15:22Z'
  },
  {
    name: '李四',
    introduction: '我是门店简介',
    phone: '15601892312',
    areaId: 18733,
    detailAddress: '复旦大学路 188 号',
    logo: 'https://www.iocoder.cn/1.png',
    openingTime:"08:30",
    closingTime:"23:12",
    latitude: 5.88,
    longitude: 6.99,
    status: 1,
    id: 23128,
    createTime: '2019-08-24T14:15:22Z'
  }
]
const data = {
  number: ['areaId', 'id', 'latitude','longitude','status'],
  string: ['name','openingTime','phone','detailAddress','closingTime'],
  date: ['createTime'],
  image:['logo']
}
const getDeliveryExpressPage = vi
  .spyOn(DeliveryPickUpStoreApi, 'getDeliveryPickUpStorePage')
  .mockResolvedValue({ list: companyList })

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
    console.log(tableColumnVm, 'adasd')
    const tableColumnProps = new Map()
    tableColumnVm.forEach((cloVm, index) => tableColumnProps.set(index, cloVm.vm.prop))
    const tableObj = companyList[0]
    tableColumnProps.forEach((key) => {
      console.log(key, 'key')
      key ? expect(tableObj.hasOwnProperty(key)).toEqual(true) : void 0
    })
    expectTable(companyList, tableColumnProps, trEles, data)
  })
  // 测试form表单提交
  test('test search-form-submit', async () => {
    vi.spyOn(DeliveryPickUpStoreApi, 'getDeliveryPickUpStorePage').mockImplementation((req) => {
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
    vi.spyOn(DeliveryPickUpStoreApi, 'getDeliveryPickUpStorePage').mockImplementation((req) => {
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
  vi.spyOn(DeliveryPickUpStoreApi, 'createDeliveryPickUpStore').mockImplementation((req) => {
    //断言用户模拟的请求是否和axios中的一致
    // @ts-ignore
    const bodyReq = wrapper.emitted().data[0][0]
    //断言用户模拟的请求是否和axios中的一致
    expect(bodyReq).toEqual(req)

    return Promise.resolve(responseData)
  })

  test('test add-form-submit', async () => {
    await addBtn.trigger('click')
    // 新增的form表单选项
    expect(formRef.vm.dialogVisible).toEqual(true)
    await flushPromises()
    const addCode = formRef.findComponent({ ref: 'addCode' })
    const addName = formRef.findComponent({ ref: 'addName' })
    // const addLogo = formRef.findComponent({ ref: 'addLogo' })
    // const uploadImage = addLogo.findComponent({ref:'uploadRef'})
    const addSort = formRef.findComponent({ ref: 'addSort' })
    // const addStatus = formRef.findComponent({ ref: 'addStatus' })
    await addCode.setValue('AA')
    await addName.setValue('AA快递')
    // await uploadImage.setValue(
    //   'http://192.168.11.204:21000/admin-api/infra/file/4/get/99fc3d58605c47a8af688a0dd2f19ea5679a8089917f1e17a5a83a2dda001b5c.jpeg'
    // )
    await addSort.setValue(10)
    // await addStatus.setValue(0)
  })
})
