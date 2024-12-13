<template>
  <OrderQuery
    ref="queryParamsRef"
    page-name="order"
    export-permi="pay:order:export"
    @get-list="getList"
    :status-dicts="getIntDictOptions(DICT_TYPE.PAY_ORDER_STATUS)"
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
          <dict-tag :type="DICT_TYPE.PAY_ORDER_STATUS" :value="scope.row.status" />
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
      <el-table-column label="总优惠金额" align="center" prop="spDiscount" width="100">
        <template #default="scope"> ￥{{ (scope.row.spDiscount / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="芯安微服务费" align="center" prop="serviceFee" width="100">
        <template #default="scope"> ￥{{ (scope.row.serviceFee / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="渠道服务费" align="center" prop="spServiceFee" width="100">
        <template #default="scope"> ￥{{ (scope.row.spServiceFee / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column label="油站名称" align="center" prop="spName" width="auto" />
      <el-table-column label="油抢号" align="center" prop="oilGun" width="80" />
      <el-table-column label="油量" align="center" prop="oilMass" width="100">
        <template #default="scope"> {{ Number(scope.row.oilMass).toFixed(2) }} L</template>
      </el-table-column>
      <el-table-column
        label="订单创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="订单更新时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />

      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            type="danger"
            link
            @click="openRefund(scope.row.id)"
            v-if="scope.row.status == 2"
            v-hasPermi="['pay:order:refund']"
          >
            退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryPagination.pageNo"
      v-model:limit="queryPagination.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：预览 -->
  <OrderRefund ref="refundRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as OrderApi from '@/api/pay/order'
import OrderRefund from './OrderRefund.vue'
import OrderQuery from '../components/OrderQuery.vue'

defineOptions({ name: 'PayOrder' })

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

const queryPagination = reactive({
  pageNo: 1,
  pageSize: 10
})

const queryParamsRef = ref<{
  queryParams: any
}>()

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
    const data = await OrderApi.getOrderPage(params)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 预览详情 */
const refundRef = ref<{
  open: (id: number) => void
}>()
const openRefund = (id: number) => {
  refundRef?.value?.open(id)
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
