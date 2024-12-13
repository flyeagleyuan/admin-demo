<template>
  <Dialog v-model="dialogVisible" title="详情" width="700px">
    <el-descriptions :column="1" label-class-name="desc-label">
      <el-descriptions-item label="芯安微订单号">
        {{ refundDetail?.orderNo || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="渠道订单号">
        {{ refundDetail?.spOrderNo || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="芯安微订单金额">
        {{ ((refundDetail?.amountTotal || 0) / 100).toFixed(2) }}
      </el-descriptions-item>
      <el-descriptions-item label="审核备注">
        <el-input
          v-model="remark"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button
        type="primary"
        @click="handleRefund(1)"
        :disabled="refundLoading.get(0) || refundLoading.get(1)"
        :loading="refundLoading.get(1)"
        >同意退款</el-button
      >
      <el-button
        @click="handleRefund(0)"
        :disabled="refundLoading.get(0) || refundLoading.get(1)"
        :loading="refundLoading.get(0)"
        >拒绝退款</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { auditRefund } from '@/api/pay/refund'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'RefundAudit' })

const emits = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false) // 弹窗的是否展示
// const detailLoading = ref(false) // 表单的加载中
const refundDetail = ref({})
const remark = ref('')
// const refundId = ref('')
const refundLoading = ref(new Map().set(1, false).set(0, false))

/** 打开弹窗 */
const open = async (refundOrder: any) => {
  refundDetail.value = refundOrder
  dialogVisible.value = true
  remark.value = ''
  // // 设置数据
  // detailLoading.value = true
  // try {
  //   refundDetail.value = await getRefund(id)
  // } finally {
  //   detailLoading.value = false
  // }
}

const handleRefund = async (status) => {
  if (!remark.value) return ElMessage.warning('请输入审核备注！')
  try {
    const data = {
      refundId: refundDetail.value.id,
      applyMemo: '',
      approveMemo: remark.value,
      status
    }
    refundLoading.value.set(status, true)
    await auditRefund(data)
    ElMessage.success('退款审核通过')
    dialogVisible.value = false
    emits('success')
  } catch (err) {
    console.log(err)
    dialogVisible.value = false
    refundLoading.value.set(status, false)
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
