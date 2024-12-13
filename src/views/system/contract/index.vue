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
      <el-form-item label="协议名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入协议名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建时间" prop="startTime">
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
      <el-button @click="delAll" type="danger"> 删除 </el-button>
    </el-form-item>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      :default-expand-all="isExpandAll"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="协议名称" prop="name" />
      <el-table-column label="版本号" prop="version" width="120" align="center" />
      <el-table-column label="创建时间" align="center" prop="createTimeStr" />
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
          <el-popconfirm title="确定要下架吗？" @confirm="deleteContract(scope.row.id)">
            <template #reference>
              <el-button type="primary" link>下架</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-hasPermi="['system:menu:update']"
            link
            type="primary"
            @click="openHistoryForm(scope.row)"
          >
            记录
          </el-button>
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
  <HistoryForm ref="historyFormRef" @success="getList" @close="handleClose" />
</template>
<script lang="ts" setup>
import * as contractApi from '@/api/contract/index'
import MenuForm from './MenuForm.vue'
import HistoryForm from './HistoryForm.vue'
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
import { ElMessage } from 'element-plus'
import { formatDateToYYYYMMDDHHMMSS } from '@/utils'
defineOptions({ name: 'SystemMenu' })
const formRef = ref()
const historyFormRef = ref()
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
  startTime: '',
  endTime: ''
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

/** 查询列表 */
const getList = async () => {
  console.log(queryParams, '参数')
  loading.value = true
  try {
    const data = await contractApi.getContractList(queryParams)
    if (data) {
      total.value = data.total
      list.value = data.list
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}
const allList = ref([])
const handleSelectionChange = (e: any) => {
  allList.value = e.map((item) => {
    return item.id
  })
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.endTime = ''
  queryParams.startTime = ''
  value1.value = []
  handleQuery()
}
const openForm = (type: string, id?: number, row?: any) => {
  formRef.value.open(type, id, row)
}
const handleClose = () => {
  getList()
}
const openHistoryForm = (row: any) => {
  historyFormRef.value.open(row)
}
const handleChangeTime = () => {
  console.log(value1.value, 'asd')
  if (!value1.value) {
    queryParams.startTime = ''
    queryParams.endTime = ''
    return
  }
  const newArr = value1.value.map((item) => {
    return formatDateToYYYYMMDDHHMMSS(item)
  })
  queryParams.startTime = newArr[0]
  queryParams.endTime = newArr[1]
}
const deleteContract = (id: number) => {
  contractApi.delOneContract(id).then((res) => {
    if (res) {
      ElMessage({
        message: '下架成功',
        type: 'success'
      })
      return getList()
    }
  })
}
const delAll = () => {
  if (allList.value.length === 0) {
    return ElMessage({
      message: '请先选择要下架的协议',
      type: 'warning'
    })
  } else {
    contractApi.delAllContract(allList.value).then((res) => {
      if (res) {
        ElMessage({
          message: '下架成功',
          type: 'success'
        })
        return getList()
      }
    })
  }
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  width: 120px !important;
}
</style>
