<template>
  <div class="aggregate-header">
    <el-date-picker
      v-model="timeRange"
      value-format="YYYY-MM-DD"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      class="!w-280px"
      :disabled-date="disabledDate"
      style="max-width: 220px; margin-right: 10px"
    />

    <el-button @click="getData"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>

    <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
  </div>

  <div class="data-content">
    <div class="data">
      <span>总交易笔数</span>
      <span>{{ aggregateData?.tradeCount || 0 }}</span>
    </div>
    <div class="data">
      <span>退款笔数</span>
      <span>{{ aggregateData?.refundCount || 0 }}</span>
    </div>
    <div class="data">
      <span>总交易金额</span>
      <span>{{ ((aggregateData?.amount || 0) / 100).toFixed(2) }}</span>
    </div>
    <div class="data">
      <span>服务费金额</span>
      <span>{{ ((aggregateData?.serviceFee || 0) / 100).toFixed(2) }}</span>
    </div>
    <div class="data">
      <span>手续费金额</span>
      <span>{{ ((aggregateData?.charges || 0) / 100).toFixed(2) }}</span>
    </div>
    <div class="data">
      <span>应付渠道商</span>
      <span>{{ ((aggregateData?.spDiscount || 0) / 100).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAggregateData, type AggregateDataVO } from '@/api/pay/order'
defineExpose({
  name: 'AggregateData'
})

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now() || time.getTime() < Date.now() - 365 * 24 * 60 * 60 * 1000
}

const year = new Date().getFullYear()
const month = new Date().getMonth()
const date = new Date().getDate()
const formatOption: any = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}
const start = new Date(year, month, date).toLocaleString('zh-CN', formatOption).replaceAll('/', '-')
const end = new Date(year, month, date).toLocaleString('zh-CN', formatOption).replaceAll('/', '-')

const timeRange = ref<string[]>([start, end])

//重置
const resetQuery = () => {
  timeRange.value = [start, end]
  getData()
}
// console.log(2222, timeRange.value)

const aggregateData = ref<AggregateDataVO>()

const getData = async () => {
  const [startDate = '', endDate = ''] = timeRange.value
  console.log(startDate, endDate)

  try {
    const res = await getAggregateData({
      startDate,
      endDate
    })
    aggregateData.value = res
  } catch (e) {}
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.aggregate-header {
  display: flex;
}

.data-content,
.data {
  display: flex;
}
.data-content {
  width: 100%;
  flex-wrap: wrap;
}
.data {
  min-width: 100px;
  height: 80px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  margin: 20px 10px 20px 0;
  padding: 12px;
}
.data > span:nth-child(1) {
  font-size: 14px;
  color: #909399;
}
.data > span:nth-child(2) {
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;
}
</style>
