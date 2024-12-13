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
      <el-form-item label="油站名称" prop="name">
        <el-input
          v-model="queryParams.stationName"
          class="!w-240px"
          clearable
          placeholder="请输入油站名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省市" prop="provinceName">
        <!-- @vue-ignore -->
        <el-cascader
          clearable
          v-model="queryParams.cityValue"
          :options="areaList"
          :props="defaultProps"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="油站类型" prop="stationTypes">
        <el-select
          v-model="queryParams.stationTypes"
          multiple
          placeholder="请选择油站类型"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.OILSTATION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="油号" prop="oilCode">
        <el-select
          v-model="queryParams.oilCode"
          class="!w-240px"
          clearable
          placeholder="请选择油号"
          @clear="handleClear"
          @change="handleChangeOilCode"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.OILCODE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="芯安微上架状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择上架状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.OILSTATION_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道上架状态" prop="spStatus">
        <el-select
          v-model="queryParams.spStatus"
          class="!w-240px"
          clearable
          placeholder="请选择上架状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SP_STATUS)"
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
        <el-popconfirm title="确定要批量上架吗？" @confirm="handleUp">
          <template #reference>
            <el-button plain type="primary"> 上架 </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm title="确定要批量下架吗？" @confirm="handleDown">
          <template #reference>
            <el-button plain type="danger"> 下架 </el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm title="确定要导出吗？" @confirm="handleExport">
          <template #reference>
            <el-button plain type="default"> 导出 </el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      :default-expand-all="isExpandAll"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" align="center" width="66">
        <template #default="scope">
          {{ scope.$index + 1 }}
          <!-- 或者使用 scope.row.index 如果你的数据已经包含了索引 -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="渠道名称" prop="spStation.spName" width="250" />
      <el-table-column label="芯安微油站ID" align="center" prop="stationId" width="230" />
      <el-table-column label="渠道油站ID" align="center" prop="spStation.spStationId" width="150" />
      <el-table-column label="油站名称" align="center" prop="stationName" width="220" />
      <el-table-column label="省份" prop="provinceName" width="150" align="center" />
      <el-table-column label="城市" prop="cityName" width="150" align="center" />
      <el-table-column label="地址" prop="address" width="200" align="center" />
      <el-table-column label="油站类型" prop="stationType" align="center">
        <template #default="scope">
          {{
            //@ts-ignore
            getIntDictOptions(DICT_TYPE.OILSTATION_TYPE).find(
              (item) => item.value === scope.row.stationType
            ).label
          }}
        </template>
      </el-table-column>
      <el-table-column label="更新日期" prop="updateTime" width="200" align="center">
        <template #default="scope">
          {{ formatDateToYYYYMMDDHHMMSS(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="芯安微上下架" prop="status" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #eee"
            :active-value="1"
            :inactive-value="0"
            @click="handleSwitchChange(scope.row.status, scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="渠道上下架" prop="spStation.spStationStatus" align="center">
        <template #default="scope">
          <!-- <el-switch
            v-model="scope.row.channelStatus"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #eee"
            active-value="1"
            inactive-value="0"
          /> -->
          {{ scope.row.spStation?.spStationStatus == 0 ? '下架' : '上架' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            v-hasPermi="['system:menu:update']"
            link
            type="primary"
            @click="openForm(scope.row.id)"
          >
            详情
          </el-button>
          <!-- <el-button
            v-hasPermi="['system:menu:create']"
            link
            type="primary"
            @click="openForm('create', undefined, scope.row.id)"
          >
            新增
          </el-button> -->
          <!-- <el-button
            v-hasPermi="['system:menu:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button> -->
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
  <MenuForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import axios from 'axios'
import { defaultProps } from '@/utils/tree'
import * as oilApi from '@/api/oil/index'
import MenuForm from './MenuForm.vue'
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
import { ElMessage } from 'element-plus'
import { formatDateToYYYYMMDDHHMMSS } from '@/utils'
import { getAccessToken, getRefreshToken, setToken } from '@/utils/auth'
defineOptions({ name: 'SystemMenu' })
const handleChange = (e) => {
  areaList.value.forEach((item: any) => {
    item.children.forEach((child: any) => {
      if (child.id === e) {
        console.log(child, item)
        queryParams.provinceName = item.name
        queryParams.cityName = child.name
      }
    })
  })
}

const total = ref(0)
const value1 = ref([]) as any
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据
const channelList = ref([]) as any
import * as channelApi from '@/api/channel/index'
import { getAreaTree } from '@/api/system/area'
const queryParams = reactive({
  pageNo: 1,
  pageSize: 50,
  stationName: '',
  provinceName: '',
  cityName: '',
  stationTypes: [],
  status: '',
  spStatus: '',
  oilCode: '',
  beginUpdateTime: '',
  endUpdateTime: '',
  cityValue: ''
}) as any

const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态
const formRef = ref(null) as any
const areaList = ref([])
/** 查询列表 */
const handleChangeOilCode = (e) => {
  console.log(e, 'ee')
  if (!e.toString().includes('#')) {
    queryParams.oilCode = queryParams.oilCode + '#'
  }
}
const getList = async () => {
  console.log(queryParams.oilCode, 'ass')
  // if (queryParams && !queryParams.oilCode.includes('#')) {
  //   queryParams.oilCode = queryParams.oilCode + '#'
  // }
  // if (!queryParams.oilCode.includes('#') && queryParams.oilCode != '') {
  //   console.log('sa')
  // }
  loading.value = true
  try {
    const data = await oilApi.getOilList(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const openForm = (id: number) => {
  formRef.value.open(id)
}
/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}
const paramsArr = ref([]) as any
const handleSelectionChange = (e: any) => {
  paramsArr.value = e.map((item) => {
    return item.id
  })
}
function stringToBinaryArray(str) {
  let binaryArray = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    binaryArray[i] = str.charCodeAt(i)
  }
  return binaryArray
}
const refreshToken = async () => {
  return await axios.post(
    'http://192.168.11.204:21011/admin-api/admin' +
      '/system/auth/refresh-token?refreshToken=' +
      getRefreshToken()
  )
}
const handleExport = async () => {
  oilApi.exportExcel(queryParams).then((res) => {
    console.log(res, 'res')
    const blob = new Blob([res], {
      type: 'application/vnd.ms-excel'
    })
    //27d0ff635e9746b0a0c21543bcee0730
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${'油站' + new Date().getTime() + '_.xls'}`
    downloadLink.click()
  })

  // // // stringToBinaryArray(data.data)
  // console.log(data,'datas')
  // if (data) {
  //   download.excel(data, '111.xls')
  // }
  // // // console.log(data, 'data')
  // let encoder = new TextEncoder();
  // let uint8array = encoder.encode(data.data);

  // const blob = new Blob(uint8array, {
  //   type: 'application/vnd.ms-excel'
  // })
  // const downloadLink = document.createElement('a')
  // downloadLink.href = URL.createObjectURL(blob)
  // downloadLink.download = `${'油站' + new Date().getTime() + '_.xls'}`
  // downloadLink.click()
  // axios({
  //   url: 'http://192.168.11.204:31011/admin-api/admin/oil/station/export',
  //   method: 'post',
  //   responseType: 'blob',
  //   data: {
  //     pageNo: 1,
  //     pageSize: 10
  //   },
  //   headers: {
  //     'tenant-id': 1,
  //     'tenant-type': 'BP',
  //     responseType: 'blob',
  //     'Content-Type': 'multipart/form-data',
  //     Authorization: 'Bearer ' + getAccessToken()
  //   }
  // }).then(async (res) => {
  //   if (res.data.type.includes('json')) {
  //     const refreshTokenRes = await refreshToken()
  //     // 2.1 刷新成功，则回放队列的请求 + 当前请求
  //     setToken((await refreshTokenRes).data.data)

  //     return handleExport()
  //   }
  //   const blob = new Blob([res.data], {
  //     type: 'application/vnd.ms-excel'
  //   })

  //   //27d0ff635e9746b0a0c21543bcee0730
  //   const downloadLink = document.createElement('a')
  //   downloadLink.href = URL.createObjectURL(blob)
  //   downloadLink.download = `${'油站' + new Date().getTime() + '_.xls'}`
  //   downloadLink.click()
  //   // 使用FileSaver保存文件
  // })
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
const handleUp = async () => {
  if (paramsArr.value.length === 0) {
    return ElMessage.error('请先选择油站')
  }
  const params = {
    ids: paramsArr.value,
    status: 1
  }
  const data = await oilApi.putOilStatus(params)
  if (data) {
    getList()
  }
}
const handleDown = async () => {
  if (paramsArr.value.length === 0) {
    return ElMessage.error('请先选择油站')
  }
  const params = {
    ids: paramsArr.value,
    status: 0
  }
  const data = await oilApi.putOilStatus(params)
  if (data) {
    getList()
  }
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
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.stationName = ''
  queryParams.cityValue = ''
  queryParams.provinceName = ''
  queryParams.cityName = ''
  queryParams.beginUpdateTime = ''
  queryParams.endUpdateTime = ''
  value1.value = []
  handleQuery()
}
const handleSwitchChange = async (status: number, scope: any) => {
  const arr = [] as any
  arr.push(scope.id)
  const params = {
    ids: arr,
    status: status
  }
  try {
    const data = await oilApi.putOilStatus(params)
    if (data) {
      getList()
    }
  } catch {}
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
  console.log(areaList, 'asd')
}
const handleClear = () => {
  queryParams.oilCode = ''
}
watch(
  () => queryParams.cityValue,
  (newValue) => {
    console.log(newValue, 'asd')
    if (!newValue) {
      queryParams.provinceName = ''
      queryParams.cityName = ''
    }
  }
)
/** 初始化 **/
onMounted(() => {
  getList()
  getChannelList()
  getAreaList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  width: 120px !important;
}
</style>
