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
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入项目名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道名称" prop="spId">
        <el-select v-model="queryParams.spId" placeholder="请选择渠道名称" clearable>
          <el-option
            v-for="dict in channelList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="list"
      :default-expand-all="isExpandAll"
      row-key="id"
    >
      <el-table-column align="center" label="项目名称" prop="name" width="250" />
      <el-table-column label="渠道" prop="id" align="center">
        <template #default="scope">
          <div>
            <el-table :data="scope.row.spList">
              <el-table-column align="center" label="渠道名称" prop="spName" />
              <el-table-column align="center" label="手续费" prop="feeRatio">
                <template #default="scope">
                  {{ scope.row.feeRatio + '%' }}
                </template>
              </el-table-column>
              <el-table-column label="渠道状态" prop="status" align="center">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #eee"
                    :active-value="1"
                    :inactive-value="2"
                    @click="handleSwitchChange(scope.row.status, scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center">
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

          <el-popconfirm title="确定要删除吗？" @confirm="deleteProject(scope.row.id)">
            <template #reference>
              <el-button v-hasPermi="['system:menu:update']" link type="primary"> 删除 </el-button>
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
  <MenuForm ref="formRef" @success="getList" @close="handleClose" :row="row" />
</template>
<script lang="ts" setup>
import * as projectApi from '@/api/project/index'
import * as channelApi from '@/api/channel/index'
import MenuForm from './MenuForm.vue'
import { formatDateToYYYYMMDDHHMMSS } from '@/utils/index'
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
defineOptions({ name: 'SystemMenu' })
const formRef = ref()
const value1 = ref([]) as any
const loading = ref(true) // 列表的加载中
const list = ref<any>() // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  beginUpdateTime: '',
  endUpdateTime: '',
  spId: ''
})
const row = ref(null) as any
const total = ref(0)
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态
const channelList = ref([]) as any
const deleteProject = (id: number) => {
  projectApi.deleteProject(id).then((res) => {
    if (res) {
      getList()
    }
  })
}
/** 查询列表 */
const getList = async () => {
  console.log(queryParams, '参数')
  loading.value = true
  try {
    const data = await projectApi.getProjectList(queryParams)
    if (data) {
      list.value = data.list
      total.value = data.total
    }
    // list.value = handleTree(data)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}
// const handleSelectionChange = (e: any) => {
//   console.log(e, 'eee')
// }
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.beginUpdateTime = ''
  queryParams.endUpdateTime = ''
  value1.value = []

  handleQuery()
}
const openForm = (type: string, id?: number, row?: any) => {
  nextTick(() => {
    formRef.value.open(type, id, row)
  })
}
const getChannelList = () => {
  const param = {
    pageNo: 1,
    pageSize: 99
  }
  channelApi.getChannelList(param).then((res) => {
    channelList.value = res.list.map((item) => {
      return {
        value: item.spId,
        label: item.name
      }
    })
  })
}
const handleClose = () => {
  getList()
}
const handleSwitchChange = (status: number, row: any) => {
  let params = null
  list.value.forEach((item) => {
    if (item.id === row.projectId) {
      params = item
    }
  })
  projectApi.addProject(params).then((res) => {
    if (res) {
      getList()
    }
  })
}
const handleChangeTime = () => {
  console.log(value1.value, 'asd')
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
/** 初始化 **/
onMounted(() => {
  getList()
  getChannelList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  width: 120px !important;
}
</style>
