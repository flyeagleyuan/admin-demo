<template>
  <Dialog v-model="dialogVisible" :title="title">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="30" clearable />
      </el-form-item>
      <el-form-item label="关联渠道名称" required>
        <el-select
          v-model="spIds"
          multiple
          placeholder="请选择关联渠道名称"
          @change="handleChangeSpList"
        >
          <el-option
            v-for="dict in channelList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="item.spName + ' 渠道费率'"
        v-for="item in arrList"
        :key="item.id"
        required
      >
        <!-- <el-input v-model="item.feeRatio" /> -->
        <!-- <el-input-number
          v-model="item.feeRatio"
          :min="0"
          :max="30"
          @change="handleChangeNumberInput"
          step="5"
        />&nbsp; % -->
        <el-select v-model="item.feeRatio" placeholder="请选择渠道费率">
          <el-option
            v-for="dict in feeRatioList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        &nbsp; %
      </el-form-item>
      <!-- <el-form-item label="渠道1服务费费率" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="渠道1服务费费率" prop="region">
        <el-input v-model="ruleForm.region" />
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" maxlength="20"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          {{ '确定' }}
        </el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script lang="ts" setup>
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
defineOptions({ name: 'SystemMenuForm' })
import * as channelApi from '@/api/channel/index'
import * as projectApi from '@/api/project/index'
import { ElMessage } from 'element-plus'
const emit = defineEmits<{
  close: any
}>()
const props = defineProps<{
  row?: any
}>()
const title = ref('')
const dialogVisible = ref(false) // 弹窗的是否展示
const feeRatioList = reactive([
  {
    label: 0,
    value: 0
  },
  {
    label: 5,
    value: 5
  },
  {
    label: 10,
    value: 10
  },
  {
    label: 15,
    value: 15
  },
  {
    label: 20,
    value: 20
  },
  {
    label: 25,
    value: 25
  },
  {
    label: 30,
    value: 30
  }
])
const formSize = ref<any>('default')
const ruleFormRef = ref<any>()
let ruleForm = reactive<any>({
  name: '',
  id: '',
  spIds: [],
  remark: '',
  spList: []
})
const formType = ref(false)
const submitForm = async (formEl: any | undefined) => {
  let flag = false
  arrList.value.forEach((item) => {
    if (item.feeRatio === '') {
      flag = false
    } else {
      flag = true
    }
  })
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(ruleForm.spIds,'ss')
      if (!flag || ruleForm.spIds.length === 0) {
        return ElMessage({
          message: '关联渠道或手续费不能为空',
          type: 'error'
        })
      }
      ruleForm.spList = arrList.value
      projectApi.addProject(ruleForm).then((res) => {
        console.log(res, 'res')
        if (res) {
          dialogVisible.value = false
          emit('close')
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const handleChangeNumberInput = () => {}
const channelList = ref([]) as any
const spList = ref([]) as any
const spIds = ref([]) as any
const rules = reactive<any>({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
})
const resetForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const arrList = ref([]) as any
const handleChangeSpList = (e: any) => {
  // spList.value = ruleForm.spList.filter((item) => {
  //   return e.includes(item.spId)
  // })
  console.log(e, 'e')
  ruleForm.spIds = e
  let arr = e.map((item) => {
    return {
      spId: item,
      spName: channelList.value.find((i) => i.value == item).label,
      feeRatio: arrList.value.find((i) => i.spId === item)?.feeRatio ?? 0
    }
  })
  console.log(arr, 'e')
  arrList.value = arr
}

const getChannelList = async () => {
  try {
    const data = await channelApi.getChannelList({ pageNo: 1, pageSize: 99 })
    if (data) {
      channelList.value = data.list.map((item) => {
        return {
          value: item.spId,
          label: item.name
        }
      })
    }
  } catch {}
}
const handleClose = () => {
  dialogVisible.value = false
}
const rows = ref(null) as any
/** 打开弹窗 */
const open = async (type: string, id?: number, row?: any) => {
  getChannelList()
  console.log(type, id, props.row, 'params')
  if (type === 'update') {
    rows.value = { ...row }
    formType.value = true
    title.value = '修改项目'
    ruleForm = rows.value
    spIds.value = JSON.parse(JSON.stringify(row.spIds))
    arrList.value = JSON.parse(JSON.stringify(row.spList))
  } else {
    formType.value = false
    title.value = '新增项目'
  }
  dialogVisible.value = true

  // 获得菜单列表
}
watch(dialogVisible, (newValue) => {
  if (!newValue) {
    ruleForm.name = ''
    arrList.value = []
    ruleForm.spIds = []
    spIds.value = []
    ruleForm.remark = ''
  } else {
    console.log(props.row)
  }
})
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss"></style>
