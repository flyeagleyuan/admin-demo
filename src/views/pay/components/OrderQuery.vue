<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="项目名称" prop="oemId">
        <el-select
          clearable
          v-model="queryParams.oemId"
          placeholder="请选择应用信息"
          class="!w-240px"
        >
          <el-option v-for="dict in projects" :key="dict.id" :label="dict.label" :value="dict.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称" prop="spId">
        <el-select
          v-model="queryParams.spId"
          placeholder="请选择支付渠道"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in channelList"
            :key="dict.spId"
            :label="dict.name"
            :value="dict.spId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户下单手机号" prop="orderMobile">
        <el-input
          v-model="queryParams.orderMobile"
          placeholder="请输入用户下单手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择支付状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in statusDicts"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="芯安微订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入芯安微订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="渠道订单编号" prop="outTradeNo">
        <el-input
          v-model="queryParams.outTradeNo"
          placeholder="请输入渠道单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
       -->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="!w-240px"
          :disabled-date="disabledDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="[props.exportPermi]"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script setup lang="ts">
import { getChannelList } from '@/api/channel/index'
import { getProjectList } from '@/api/project/index'
import { type OrderPageReqVO, exportOrder } from '@/api/pay/order'
import { exportRefund } from '@/api/pay/refund'
import download from '@/utils/download'
import { type NumberDictDataType } from '@/utils/dict'

const message = useMessage() // 消息弹窗

// !订单列表以及退款列表拥有相同的搜索条件
defineOptions({ name: 'OrderQuery' })

const props = defineProps<{
  exportPermi?: string
  statusDicts: NumberDictDataType[]
  pageName: string
}>()

const emits = defineEmits<{
  (e: 'getList', queryParams: OrderPageReqVO): void
}>()

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now() || time.getTime() < Date.now() - 365 * 24 * 60 * 60 * 1000
}

const queryFormRef = ref() // 搜索的表单
const queryParams = reactive<OrderPageReqVO>({
  oemId: '',
  spId: '',
  orderMobile: '',
  orderNo: '',
  orderStatus: '',
  outTradeNo: '',
  startCreateDate: '',
  endCreateDate: '',
  createTime: []
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  emits('getList', queryParams)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const exportLoading = ref(false) // 导出等待

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    queryParams.startCreateDate = queryParams.createTime[0]
    queryParams.endCreateDate = queryParams.createTime[1]
    console.log(queryParams, 'quer')
    const data =
      props.pageName === 'order' ? await exportOrder(queryParams) : await exportRefund(queryParams)
    // debugger
    console.log(data)

    download.excel(data, '支付订单.xls')
  } catch (e) {
    // debugger
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

const projects = ref<
  Array<{
    id: number
    label: string
  }>
>([]) // 支付应用列表集合
//获取项目列表
const getProjects = async () => {
  try {
    const res = await getProjectList({
      pageNo: 1,
      pageSize: 100
    })
    projects.value = res.list.map(({ id, name }) => {
      return {
        id,
        label: name
      }
    })
  } catch (err) {}
}

const channelList = ref<
  {
    spId: number
    name: string
  }[]
>([])

const getChannels = async () => {
  try {
    const res = await getChannelList({
      pageNo: 1,
      pageSize: 100
    })
    channelList.value = res?.list || []
  } catch (e) {}
}

defineExpose({
  queryParams
})

onMounted(async () => {
  await getProjects()
  await getChannels()
})
</script>

<style scoped></style>
