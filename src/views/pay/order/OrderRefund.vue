<template>
  <Dialog v-model="dialogVisible" title="申请退款" width="400px">
    <el-descriptions :column="1" label-class-name="desc-label">
      <el-descriptions-item label="芯安微订单号">
        {{ detailData?.orderNo || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="渠道订单号">
        {{ detailData?.spOrderNo || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="芯安微订单金额">
        ¥{{ ((detailData?.amountTotal || 0) / 100).toFixed(2) || 0 }}
      </el-descriptions-item>
      <el-descriptions-item label="退款原因">
        <el-input
          v-model="remark"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="请输入退款原因"
        />
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleRefund" :loading="refundLoading">提交</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getOrderDetail, refundOrder, type OrderVO } from '@/api/pay/order'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'OrderRefund' })

const emits = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<OrderVO>()
const remark = ref('')

/** 打开弹窗 */
const orderId = ref()
const open = async (id: number) => {
  remark.value = ''
  orderId.value = id

  // 设置数据
  detailLoading.value = true
  try {
    detailData.value = await getOrderDetail(id)
    dialogVisible.value = true
  } finally {
    detailLoading.value = false
  }
}

const refundLoading = ref(false)
const handleRefund = async () => {
  if (!remark.value) return ElMessage.error('请输入退款原因')
  refundLoading.value = true
  try {
    await refundOrder(orderId.value, remark.value)
    ElMessage.success('退款申请提交成功！')
    refundLoading.value = false
    detailLoading.value = false
    dialogVisible.value = false
    emits('success')
  } catch {
    dialogVisible.value = false
    refundLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
<style>
.tag-purple {
  color: #722ed1;
  background: #f9f0ff;
  border-color: #d3adf7;
}

.tag-pink {
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
</style>
