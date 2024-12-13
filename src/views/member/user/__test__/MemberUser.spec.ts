/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi, expectTypeOf, afterEach } from 'vitest'
import MemberUser from '../index.vue'
import { RouterLinkStub, config, flushPromises, mount } from '@vue/test-utils'
import { Icon } from '@/components/Icon/index'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap/index'
import { DictTag } from '@/components/DictTag'
import { ElTag } from 'element-plus'
import { ElButton } from 'element-plus'
import { ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ElTableColumn } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import { DictDataType, getDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import dayjs from 'dayjs'
import axios from "axios"

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
  ElDropdownItem
}
config.global.mocks = {}
config.global.plugins = [dayjs]

config.global.renderStubDefaultSlot = true
config.global.directives = {
  hasPermi: () => true
}
// @ts-ignore
const total = Math.floor(Math.random(0, 1) * 10000)
const users = [
  {
    mobile: '15312255526',
    status: 0,
    nickname: '用户567414',
    avatar:
      'http://192.168.11.204:21000/admin-api/infra/file/4/get/fd2f910b06f0709c0dd332f2f845d88f8a60f10748d9aee0deb9946759d3f40d.jpg',
    name: '',
    sex: 2,
    areaId: null,
    areaName: null,
    birthday: null,
    mark: null,
    tagIds: null,
    levelId: null,
    groupId: null,
    id: 302,
    registerIp: '192.168.13.198',
    loginIp: '192.168.13.198',
    loginDate: 1709104513000,
    createTime: 1709104513000,
    point: 0,
    totalPoint: null,
    tagNames: [],
    levelName: null,
    groupName: null,
    experience: 0
  },
  {
    mobile: '18737513268',
    status: 0,
    nickname: '用户616808',
    avatar:
      'http://192.168.11.204:21000/admin-api/infra/file/4/get/60c9f9705f5b752ae3f0bb9223f59ec2dd5140590fb63b5a99b19a5d6b3373e1.jpg',
    name: '',
    sex: 1,
    areaId: null,
    areaName: null,
    birthday: null,
    mark: null,
    tagIds: null,
    levelId: null,
    groupId: null,
    id: 301,
    registerIp: '192.168.12.108',
    loginIp: '192.168.12.108',
    loginDate: 1709005044000,
    createTime: 1709005044000,
    point: 0,
    totalPoint: null,
    tagNames: [],
    levelName: null,
    groupName: null,
    experience: 0
  },
  {
    mobile: '19912341234',
    status: 0,
    nickname: '用户287584',
    avatar:
      'http://192.168.11.204:21000/admin-api/infra/file/4/get/fd2f910b06f0709c0dd332f2f845d88f8a60f10748d9aee0deb9946759d3f40d.jpg',
    name: '',
    sex: 0,
    areaId: 220202,
    areaName: '吉林省 吉林市 昌邑区',
    birthday: 1711468800000,
    mark: null,
    tagIds: [1],
    levelId: null,
    groupId: null,
    id: 297,
    registerIp: '192.168.12.125',
    loginIp: '192.168.13.93',
    loginDate: 1709605706000,
    createTime: 1708672249000,
    point: 0,
    totalPoint: null,
    tagNames: ['绿色'],
    levelName: null,
    groupName: null,
    experience: 0
  },
  {
    mobile: '15601691399',
    status: 0,
    nickname: '啦啦啦',
    avatar:
      'http://192.168.11.204:21000/admin-api/infra/file/4/get/8be5f3a86487f1bb7dd18cf19f3418f93ace9ee5cf133c3f9d8d4f3b6a8a6c21.jpg',
    name: '啦啦啦',
    sex: 2,
    areaId: 130102,
    areaName: '河北省 石家庄市 长安区',
    birthday: 1693152000000,
    mark: '备注3213123',
    tagIds: [1, 2],
    levelId: 3,
    groupId: 1,
    id: 247,
    registerIp: '127.0.0.1',
    loginIp: '127.0.0.1',
    loginDate: 1705450114000,
    createTime: 1697340188000,
    point: 32776,
    totalPoint: null,
    tagNames: ['绿色', '黄色'],
    levelName: '黄金',
    groupName: '哈哈哈',
    experience: 6688618
  }
].sort((a, b) => b.id - a.id)

const getUserPage = vi.spyOn(UserApi, 'getUserPage').mockResolvedValue({ list: users, total })
// const getUserPageRequest = vi.spyOn(UserApi, 'getUserPage').mockImplementation((data) => {
//   // 这里可以通过断言来验证请求的参数 config
//   // 例如：expect(config.params).toEqual({ key: 'value' });
//   console.log(data, '参数')
//   expect(data).toEqual(wrapper.emitted().data[0][0]);
// });
describe('test MemeberUser', async () => {
  const wrapper = mount(MemberUser, {
    global: {
      mocks: {
        dateFormatter
      },
      plugins: [dateFormatter]
    },
    stubs: {},
    shallow: false
  })


  await wrapper.vm.$nextTick() // 等待 Vue 更新 DOM

  // vi.spyOn(UserApi, 'getUserPage').mockImplementation((data) => {
  //   // 这里可以通过断言来验证请求的参数 config
  //   // 例如：expect(config.params).toEqual({ key: 'value' });
  //   console.log(data, '参数')
  //   expect(data).toEqual(wrapper.emitted().data[0][0]);
  //   Promise.resolve({ list: users, total })
  // });

  beforeEach(async () => {
    await wrapper.vm.getList()
    await flushPromises()
    // console.log(111, getDictOptions('DICT_TYPE.COMMON_STATUS'))

  })
  // vi.spyOn('/home/data','test').mockImplementation(res=>{
  //   console.log(res,'res')
  // })
  // const queryFormVm = wrapper.findComponent({ ref: 'queryFormRef' })
  const tableVm = wrapper.findComponent({ ref: 'tableRef' })
  // const tableColumnVm = wrapper.findAllComponents(ElTableCloumn)
  const paginationVm = wrapper.findComponent({ ref: 'paginationRef' })

  //获取到用户模拟的数据
  // @ts-ignore
  const queryForm = wrapper.emitted().data[0][0]
  const s = vi.spyOn(UserApi, 'getUserPage').mockImplementation((req) => {
    //断言用户模拟的请求是否和axios中的一致
    expect(queryForm).toEqual(req);
    return Promise.resolve({ list: users, total });
  })
  test('test memeberUser queryForm', async () => {
    // console.log(queryFormVm.vm.model)
    // console.log(queryFormVm.findAllComponents());
    expect(s).toHaveBeenCalled()
  })

  test('test memberuser tableList', async () => {
    /**
     * 1.首先判断方法是否调用
     */
    expect(getUserPage).toHaveBeenCalled()
    // expect(getUserPage).toHaveBeenCalledTimes(2)

    //获取table中的数据json
    expect(tableVm.vm.data.length).toEqual(users.length)
    //mock数据与组建渲染数据一致
    expect(tableVm.vm.data).toEqual(users)

    /**
     * 2.判断tableColumn的属性的值prop，user是否包含
     * （table中的prop值必须时user中存在的，如不存在检查是前端写错或者后端没给）
     */
    const tableColumnVm = wrapper.findAllComponents({ name: 'ElTableColumn' })
    const tableColumnProps = new Map()
    tableColumnVm.forEach((cloVm, index) => tableColumnProps.set(index, cloVm.vm.prop))
    const tableObj = users[0]
    tableColumnProps.forEach((key) => {
      key ? expect(tableObj.hasOwnProperty(key)).toEqual(true) : void 0
    })

    /**
     * 3. 检查渲染数据是否正确
     */

    const trEleMap = []
    const trEles = wrapper.findAll('.el-table__body-wrapper tr')

    //数据的长度等于tr的长度
    expect(users.length).toEqual(trEles.length)

    const dataLength = users.length

    for (let i = 0; i < dataLength; i++) {
      const user = users[i]
      const tdEles = trEles[i].findAll('.cell')

      tableColumnProps.forEach((key, index) => {
        const userValue = user[key]
        const td = tdEles[index]
        const tdText = td.text()
        expect(tdText).not.toBeNull() //td中拿到的文字
        // @ts-ignore
        expectTypeOf(tdText).toBeString()

        switch (key) {
          case 'undefined':
            expect(userValue).toEqual(undefined)
            expect(tdText).toEqual('')
            break
          case 'id':
          case 'point':
            expect(userValue).toBeTypeOf('number')
            expect(userValue.toString()).toEqual(tdText)
            break
          case 'avatar':
            expect(userValue).toBeTypeOf('string')
            expect(userValue).toEqual(td.find('img').attributes('src'))
            break
          case 'mobile':
          case 'nickname':
          case 'levelName':
          case 'groupName':
            if (userValue !== null) {
              expect(userValue).toEqual(tdText)
            } else {
              expect(tdText).toEqual('')
            }
            break
          case 'tagNames':
            // @ts-ignore
            expectTypeOf(userValue).toBeArray()
            expect(userValue.join('')).toEqual(tdText)
            break
          case 'status':
            // expect(userValue).toBeTypeOf('number')
            // expect([0, 1].includes(userValue)).toBeTruthy()
            break
          case 'loginDate':
          case 'createTime':
            expect(userValue).toBeTypeOf('number')
            expect(tdText).toBeTypeOf('string')
            if (userValue) {
              // console.log(userValue, '---', dateFormatter())
              // expect(dateFormatter(userValue)).toBe(tdText)
            }
            break
        }

        // console.log(tdEles[key].text(), '----', user[value])
      })
    }
  })

  test('test memeberUser pagnitation', () => {
    // console.log(paginationVm.vm)
    expect(paginationVm.vm.props.total).toBe(total)
  })
  // @ts-ignore
  test('test', () => {
    const trEles = wrapper.findAll('.el-table__body-wrapper tr')
    expect(users.length).toEqual(trEles.length)
    expect(tableVm.vm.data.length).toEqual(users.length)
    //mock数据与组建渲染数据一致
    expect(tableVm.vm.data).toEqual(users)

    /**
     * 2.判断tableColumn的属性的值prop，user是否包含
     * （table中的prop值必须时user中存在的，如不存在检查是前端写错或者后端没给）
     */
    const tableColumnVm = wrapper.findAllComponents({ name: 'ElTableColumn' })

    const tableColumnProps = new Map()
    tableColumnVm.forEach((cloVm, index) => tableColumnProps.set(index, cloVm.vm.prop))

    const tableObj = users[0]
    tableColumnProps.forEach((key) => {
      key ? expect(tableObj.hasOwnProperty(key)).toEqual(true) : void 0
    })

    const expectTable = (users, table, trs, data) => {
      const dataLength = users.length
      // console.log(table, 'table')
      for (let i = 0; i < dataLength; i++) {
        const user = users[i]
        const tdEles = trs[i].findAll('.cell')

        table.forEach((key, index) => {
          //处理string类型的数据
          data.string.forEach((item) => {
            if (item == key) {
              const userValue = user[item].toString()
              const td = tdEles[index]
              const tdText = td.text()
              expect(tdText).not.toBeNull() //td中拿到的文字
              if (userValue !== null) {
                expect(userValue).toEqual(tdText)
              } else {
                expect(tdText).toEqual('')
              }
            }
          })
          data.number.forEach((item) => {
            if (item == key) {
              const userValue = user[item]
              const td = tdEles[index]
              const tdText = Number(td.text())
              expect(tdText).not.toBeNull() //td中拿到的文字
              expect(tdText).toBeTypeOf('number')
              if (userValue !== null && tdText) {
                expect(userValue).toEqual(tdText)
              } else {
                expect(tdText).toEqual(0)
              }
            }
          })
          data.image.forEach((item, i) => {
            if (item == key) {
              const userValue = user[item]
              const td = tdEles[index]
              const tdText = td.text()
              console.log(userValue,tdText,'--')
              expect(userValue).toBeTypeOf('string')
              expect(userValue).toEqual(td.find('img').attributes('src'))
            }

          })
          // const userValue = user[key]
          // const td = tdEles[index]
          // const tdText = td.text()
          // expect(tdText).not.toBeNull() //td中拿到的文字
          // expectTypeOf(tdText).toBeString()

          // switch (key) {
          //   case 'undefined':
          //     expect(userValue).toEqual(undefined)
          //     expect(tdText).toEqual('')
          //     break
          //   case 'id':
          //   case 'point':
          //     expect(userValue).toBeTypeOf('number')
          //     expect(userValue.toString()).toEqual(tdText)
          //     break
          //   case 'avatar':
          //     expect(userValue).toBeTypeOf('string')
          //     expect(userValue).toEqual(td.find('img').attributes('src'))
          //     break
          //   case 'mobile':
          //   case 'nickname':
          //   case 'levelName':
          //   case 'groupName':
          //     if (userValue !== null) {
          //       expect(userValue).toEqual(tdText)
          //     } else {
          //       expect(tdText).toEqual('')
          //     }
          //     break
          //   case 'tagNames':
          //     expectTypeOf(userValue).toBeArray()
          //     expect(userValue.join('')).toEqual(tdText)
          //     break
          //   case 'status':
          //     // expect(userValue).toBeTypeOf('number')
          //     // expect([0, 1].includes(userValue)).toBeTruthy()
          //     break
          //   case 'loginDate':
          //   case 'createTime':
          //     expect(userValue).toBeTypeOf('number')
          //     expect(tdText).toBeTypeOf('string')
          //     if (userValue) {
          //       // console.log(userValue, '---', dateFormatter())
          //       // expect(dateFormatter(userValue)).toBe(tdText)
          //     }
          //     break
          // }

          // console.log(tdEles[key].text(), '----', user[value])
        })
      }
    }
    const data = {
      string: ["mobile", "nickname", "name", "registerIp", "loginIp", "areaName", "mark", "id"],
      number: ["sex", "status", "areaId", "levelId", "groupId", "point", "totalPoint", "experience"],
      image: ["avatar"],
      date: [{ "loginDate,birthday,createTime": "yyyy-mm-dd" }, {}],
      array: ["tagIds"],
    }
    expectTable(users, tableColumnProps, trEles, data)
  })

})
