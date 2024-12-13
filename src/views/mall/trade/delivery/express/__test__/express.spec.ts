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
import * as expressApi from '@/api/mall/trade/delivery/express/index'
import dayjs from 'dayjs'
import { expectTable ,expectForm} from '@/utils/test'
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
// 1.mock列表返回的数据 从apiFox文档直接赋值 or 界面接口返回值复制
const companyList = [
  {
    code: 'aVRwetteh@！￥#@%#……%*&……（*&',
    createTime: 1684942213000,
    id: 1,
    logo: 'http://192.168.11.204:21000/admin-api/infra/file/4/get/99fc3d58605c47a8af688a0dd2f19ea5679a8089917f1e17a5a83a2dda001b5c.jpeg',
    name: '申通快递',
    sort: 1,
    status: 0
  },
  {
    code: 'SF',
    createTime: 1684942314000,
    id: 2,
    logo: 'http://127.0.0.1:48080/admin-api/infra/file/4/get/ec8418d431f69a86dbd24b40dfab79536aff614f0d20613cb59c90ddb6fe57c5.png',
    name: '顺丰速运',
    sort: 2,
    status: 0
  },
  {
    code: 'SF',
    createTime: 1684942314000,
    id: 2,
    logo: 'http://127.0.0.1:48080/admin-api/infra/file/4/get/ec8418d431f69a86dbd24b40dfab79536aff614f0d20613cb59c90ddb6fe57c5.png',
    name: '顺丰速运',
    sort: 2,
    status: 0
  },
  {
    code: 'YD',
    createTime: 1684942371000,
    id: 4,
    logo: 'http://127.0.0.1:48080/admin-api/infra/file/4/get/92ae41aa2c007cd4544162cd53966b5cc8557696927d9ff2d5e5970519ee0cbe.png',
    name: '韵达快递',
    sort: 85,
    status: 0
  }
]
// 2.根据列表返回的key：value的key数据类型来定义一个对象
const data = {
  number: ['id', 'sort', 'status'],
  string: ['code', 'name'],
  image: ['logo'],
  date: ['createTime']
}
const getDeliveryExpressPage = vi
  .spyOn(expressApi, 'getDeliveryExpressPage')
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

  const searchBtn = wrapper.findComponent({ ref: 'searchBtn' })
  const resetBtn = wrapper.findComponent({ ref: 'resetBtn' })
  const addBtn = wrapper.findComponent({ ref: 'addBtn' })
  const formRef = wrapper.findComponent({ ref: 'formRef' })

  // 测试table渲染
  test('test table', () => {
    // 1.判断接口是否被调用
    expect(getDeliveryExpressPage).toHaveBeenCalled()
    //获取table中的数据json
    const trEles = wrapper.findAll('.el-table__body-wrapper tr')
    expect(companyList.length).toEqual(trEles.length)
    expect(tableVm.vm.data.length).toEqual(companyList.length)
    //mock数据与组建渲染数据一致
    expect(tableVm.vm.data).toEqual(companyList)

    /**
     * 2.判断tableColumn的属性的值prop，companyList是否包含
     * （table中的prop值必须时companyList中存在的，如不存在检查是前端写错或者后端没给）
     */
    const tableColumnVm = wrapper.findAllComponents({ name: 'ElTableColumn' })

    expectTable(companyList, tableColumnVm, trEles, data)
  })
  // 测试form表单提交
  test('test search-form-submit', async () => {
    // 1.构建测试数据
    const formTestData = {
      code: 'SF',
      name: '顺丰快递'
    }
    vi.spyOn(expressApi, 'getDeliveryExpressPage').mockImplementation((req) => {
      //断言用户模拟的请求是否和axios中的一致
      // @ts-ignore
      const testReq = {...formTestData,pageNo:1,pageSize:10} //3.在
      console.log(req, testReq,'formTestData')
      //断言用户模拟的请求是否和axios中的一致
      expect(testReq).toEqual(req)

      return Promise.resolve({ list: companyList })
    })
    // 2.遍历找到测试数据对应的form表单
    expectForm(wrapper,formTestData)
    await searchBtn.trigger('click')
    await flushPromises()
  })
  // 测试form表单重置
  // test('test search-form-reset', async () => {
  //   const formResetData = {
  //     code: '',
  //     name: '',
  //   }
  //   vi.spyOn(expressApi, 'getDeliveryExpressPage').mockImplementation((req) => {
  //     //断言用户模拟的请求是否和axios中的一致
  //     // @ts-ignore
  //     //断言用户模拟的请求是否和axios中的一致
  //     expect(formResetData).toEqual(req)

  //     return Promise.resolve({ list: companyList })
  //   })
  //   // 设置codeInput的值
  //   for (const key in formResetData) {
  //     await wrapper.findComponent({ ref: key }).setValue(formResetData[key])
  //   }
  //   await resetBtn.trigger('click')
  //   await flushPromises()
  // })
  // 测试新增按钮
  test('test add-btn', async () => {
    await addBtn.trigger('click')
    // console.log(formRef.vm.dialogVisible)
    //断言弹窗已经打开
    expect(formRef.vm.dialogVisible).toEqual(true)
  })
  // 测试新增的form表单确定按钮
  const responseData = {
    code: 0,
    data: 0,
    msg: 'string'
  }
  //1.构造测试数据的testData
  const testData = {
    code: 'AA',
    name: 'AA快递',
    sort: 10,
    status: 0
    // logo: 'xxx'
  } as any
  vi.spyOn(expressApi, 'createDeliveryExpress').mockImplementation((req) => {
    //断言用户模拟的请求是否和axios中的一致
    console.log(req, 'req')
    // @ts-ignore
    const testReq = { ...testData, logo: 'xxx' }
    //断言用户模拟的请求是否和axios中的一致
    expect(testReq).toEqual(req)

    return Promise.resolve(responseData)
  })

  test('test add-form-submit', async () => {
    await addBtn.trigger('click')
    // 新增的form表单选项
    expect(formRef.vm.dialogVisible).toEqual(true)
    await flushPromises()
    // 2.遍历
    // @ts-ignore
    for (const keys in testData) {
      console.log(keys, 'keys')
      await formRef.findComponent({ ref: keys }).setValue(testData[keys])
    }
    const submitBtn = formRef.findComponent({ ref: 'submitBtn' })
    await submitBtn.trigger('click')
  })
  const editBtn = wrapper.findComponent({ ref: 'editBtn' })
  const mockDetailData = {
    code: 'aVRwetteh@！￥#@%#……%*&……（*&',
    createTime: 1684942213000,
    id: 1,
    logo: 'http://192.168.11.204:21000/admin-api/infra/file/4/get/99fc3d58605c47a8af688a0dd2f19ea5679a8089917f1e17a5a83a2dda001b5c.jpeg',
    name: '申通快递',
    sort: 1,
    status: 0
  }
  const mockDeatilDataType = {
    number:['id','sort','status'],
    date:['createTime'],
    image:['logo'],
    string:['name','code']
  }
  test('test editBtn-click', async () => {
    await editBtn.trigger('click')
    expect(formRef.vm.dialogVisible).toEqual(true)
    await flushPromises()
    vi.spyOn(expressApi, 'getDeliveryExpress').mockResolvedValue({ list: mockDetailData })
    const form = formRef.findAll('input')
    console.log(form[1].text(),'form')
    const formItemVm = wrapper.findAllComponents({ name: 'ElFormItem' })
    const formColumnProps = new Map()
    formItemVm.forEach((cloVm, index) => formColumnProps.set(index, cloVm.vm.prop))
    formColumnProps.forEach((item,i)=>{
      if(item){

      }
    })
  })
})
