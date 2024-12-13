<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="渠道名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入渠道名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道编号" prop="code">
        <el-input
          v-model="queryParams.code"
          class="!w-240px"
          clearable
          placeholder="请输入渠道编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="收款人开户省市" prop="areaId">
        <el-cascader
          v-model="queryParams.areaId"
          :options="areaList"
          :props="defaultProps"
          ref="addSort"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="收款人账户" prop="cardNo">
        <el-input
          v-model="queryParams.cardNo"
          class="!w-240px"
          clearable
          placeholder="请输入收款账户"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="更新时间" prop="startTime">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
          @change="handleChangeTime"
        />
      </el-form-item>
      <br />
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-form-item>
      <el-button @click="openForm('add')" type="default"> 新增 </el-button>
    </el-form-item>
    <el-table v-if="refreshTable" v-loading="loading" :data="list" row-key="id">
      <el-table-column align="center" label="渠道名称" prop="name" width="250" />
      <el-table-column label="渠道编号" prop="code" width="120" align="center" />
      <el-table-column label="收款人开户行行号" align="center" prop="bankCode" width="150" />
      <el-table-column label="收款人账户" align="center" prop="cardNo" width="150" />
      <el-table-column label="收款人账户户名" align="center" prop="accountName" width="220" />
      <el-table-column label="收款人开户行名称" prop="bank" width="150" align="center" />
      <el-table-column label="省份" prop="provinceName" width="150" align="center" />
      <el-table-column label="城市" prop="cityName" width="150" align="center" />
      <el-table-column label="更新时间" prop="updateTime" width="200" align="center">
        <template #default="scope">
          {{ formatDateToYYYYMMDDHHMMSS(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            v-hasPermi="['system:menu:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id, scope.row)"
          >
            修改
          </el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="deleteChannel(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
  <Pagination
    :total="total"
    v-model:page="queryParams.pageNo"
    v-model:limit="queryParams.pageSize"
    @pagination="getList"
  />
  <!-- 表单弹窗：添加/修改 -->
  <MenuForm ref="formRef" @success="getList" @close="handleClose" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getAreaTree } from '@/api/system/area'
import * as channelApi from '@/api/channel/index'
import MenuForm from './MenuForm.vue'
import { formatDateToYYYYMMDDHHMMSS } from '@/utils/index'
import { defaultProps } from '@/utils/tree'
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
defineOptions({ name: 'SystemMenu' })
const formRef = ref()
const handleChange = (e) => {
  console.log(e, 'eee')
  areaList.value.forEach((item: any) => {
    item.children.forEach((child: any) => {
      if (child.id === e) {
        console.log(child, item)
        queryParams.provinceCode = item.id
        queryParams.cityCode = child.id
      }
    })
  })
}

const areaList = ref([])
const value1 = ref([])
const total = ref(0)
const loading = ref(true) // 列表的加载中
const list = ref<any>([
  {
    id: 1,
    channelName: '芯安微众（上海）微电子技术有限公司',
    xawOilStationId: 1,
    channelId: '99',
    oilName: '芯安微众（上海）微电子技术有限公司加油站',
    provience: '黑龙江',
    city: '哈尔滨市',
    address: '黑龙江省哈尔滨市高新区冰雪镇辛福小区98号1602',
    num: '',
    phone: '',
    oilStationType: '',
    isWxPay: true,
    xawStatus: 1,
    channelStatus: 1,
    oilNum1: '92#',
    oilPrice1: '6.62',
    oilNum2: '95#',
    oilPrice2: '7.19',
    oilNum3: '0#',
    oilPrice3: '8.08',
    oilNum4: '98#',
    oilPrice4: '6.44',
    fixTime: '2024-07-01 13:30:00'
  }
]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  code: '',
  cardNo: '',
  provinceCode: '',
  cityCode: '',
  beginUpdateTime: '',
  endUpdateTime: '',
  areaId: ''
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

/** 查询列表 */
const getList = async () => {
  console.log(queryParams, '参数')
  loading.value = true
  try {
    const data = await channelApi.getChannelList(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}
const resetQueryParams = () => {
  queryParams.beginUpdateTime = ''
  queryParams.endUpdateTime = ''
  queryParams.name = ''
  queryParams.code = ''
  queryParams.provinceCode = ''
  queryParams.cardNo = ''
  queryParams.cityCode = ''
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  resetQueryParams()
  value1.value = []
  handleQuery()
}
const deleteChannel = (id: number) => {
  channelApi.deleteChannel(id).then((res) => {
    console.log(res, 'res')
    if (res) {
      getList()
    }
  })
}
const openForm = (type: string, id?: number, row?: any) => {
  console.log('openForm')
  formRef.value.open(type, id, row)
}
const handleChangeTime = () => {
  if (!value1.value) {
    queryParams.beginUpdateTime = ''
    queryParams.endUpdateTime = ''
    return
  }
  const newArr = value1.value.map((item) => {
    return formatDateToYYYYMMDDHHMMSS(item)
  })
  queryParams.beginUpdateTime = newArr[0]
  queryParams.endUpdateTime = newArr[1]
}
function removeThirdLevelChildren(data) {
  data.forEach((item) => {
    // 删除当前项（第一级）的children（如果存在）
    // 但在这个例子中，我们实际上不需要这么做，因为目标是第三级

    // 检查是否有children（第二级）
    if (item.children && item.children.length > 0) {
      item.children.forEach((child, index) => {
        // 删除第二级项的children（即第三级）
        if (child.name.includes('行政区划')) {
          item.children = item.children.concat(child.children)
          item.children.splice(index, 1)
        }
        if (child.children) {
          delete child.children // 删除第三级的children
        }
        // 注意：这里不需要递归更深，因为数据只到第三级
      })
    }
  })
  console.log(data, 'ass')
  return data
}
const getAreaList = async () => {
  areaList.value = removeThirdLevelChildren(await getAreaTree())
}
watch(
  () => queryParams.areaId,
  (newValue) => {
    if (!newValue) {
      queryParams.provinceCode = ''
      queryParams.cityCode = ''
    }
  }
)
const handleClose = () => {
  getList()
}
/** 初始化 **/
onMounted(() => {
  getList()
  getAreaList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  width: 120px !important;
}
</style>
