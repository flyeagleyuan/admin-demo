<template>
  <Dialog v-model="dialogVisible" title="协议历史记录">
    <div class="dialogs">
      <el-table :data="list" row-key="id">
        <el-table-column align="center" label="协议版本号" prop="version" />
        <el-table-column label="更新账户" prop="name" width="240" align="center" />
        <el-table-column label="更新时间" align="center" prop="createTimeStr" />
      </el-table>
      <div class="page">
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import * as contractApi from '@/api/contract/index'
//@ts-ignore

defineOptions({ name: 'SystemMenuForm' })
const dialogVisible = ref(false) // 弹窗的是否展示
const total = ref(10)
const emit = defineEmits<{
  close: any
}>()
let list = reactive([])
let queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  startTime: '',
  endTime: '',
  code: ''
})
const getList = async () => {
  try {
    let data = await contractApi.getHistoryContract(queryParams)
    console.log(data)
    if (data) {
      list = data.list
      total.value = data.total
    }
  } catch {}
}
/** 打开弹窗 */
const open = async (row?: any) => {
  dialogVisible.value = true
  queryParams.code = row.code
  getList()
  // 获得菜单列表
}
watch(dialogVisible, (newValue) => {
  if (!newValue) {
  }
})
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
.dialogs {
  display: flex;
  flex-direction: column;
  .page {
    margin-top: 20px;
  }
}
</style>
