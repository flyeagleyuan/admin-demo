<template>
  <!-- 搜索工作栏 -->
  <OrderQuery
    ref="queryParamsRef"
    page-name="refund"
    @get-list="getList"
    export-permi="pay:refund:export"
    :status-dicts="getIntDictOptions(DICT_TYPE.PAY_REFUND_STATUS)"
  />

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="项目名称" align="center" prop="oemName" />
      <el-table-column label="渠道名称" align="center" prop="spName" />
      <el-table-column label="芯安微订单编号" width="180" align="center" prop="orderNo" />
      <el-table-column label="渠道订单编号" width="180" align="center" prop="spOrderNo" />
      <el-table-column label="下单用户手机号" width="140" align="center" prop="orderMobile" />
      <el-table-column label="订单状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PAY_REFUND_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="芯安微订单总金额" align="center" prop="amountTotal" width="100">
        <template #default="scope"> ￥{{ (scope.row.amountTotal / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="芯安微订单实付金额" align="center" prop="amount" width="100">
        <template #default="scope"> ￥{{ (scope.row.amount / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="渠道订单总金额" align="center" prop="amountOri" width="100">
        <template #default="scope"> ￥{{ (scope.row.amountOri / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="渠道订单实付金额" align="center" prop="spAmount" width="100">
        <template #default="scope"> ￥{{ (scope.row.spAmount / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="油站名称" align="center" prop="spName" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />
      <!-- <el-table-column label="退款原因" align="center" prop="remark" /> -->
      <el-table-column label="审核人" align="center" prop="checkUser" width="100" />
      <el-table-column label="备注" align="center" prop="remark" width="150" />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="openDetail(scope.row)"
            v-if="scope.row.status == 1"
            v-hasPermi="['pay:refund:agree']"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryPagination.pageNo"
      v-model:limit="queryPagination.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：预览 -->
  <RefundAudit ref="refundAuditRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as RefundApi from '@/api/pay/refund'
import RefundAudit from './RefundAudit.vue'
import OrderQuery from '../components/OrderQuery.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'PayRefund' })

const loading = ref(false) // 列表遮罩层
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryPagination = reactive({
  pageNo: 1,
  pageSize: 10
})

const queryParamsRef = ref(null)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  const queryParams = queryParamsRef?.value?.queryParams || {}
  const [startCreateDate = '', endCreateDate = ''] = queryParams.createTime
  const params = {
    ...(queryParams || {}),
    ...queryPagination,
    startCreateDate,
    endCreateDate
  }
  delete params.createTime
  try {
    const data = await RefundApi.getRefundPage(params)
    console.log(data)

    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 退款审核 */
const refundAuditRef = ref()
//没有给我详情接口，这里我直接订单数据
const openDetail = (refundOrder: number) => {
  refundAuditRef.value.open(refundOrder)
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
<style>
.order-font {
  padding: 2px 0;
  font-size: 12px;
}
</style>
