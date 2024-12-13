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
      <el-form-item label="渠道名称" prop="name">
        <el-input v-model="ruleForm.name" clearable />
      </el-form-item>
      <el-form-item label="渠道编号" prop="code">
        <el-input v-model="ruleForm.code" clearable />
      </el-form-item>
      <el-form-item label="银行账户" prop="cardNo">
        <el-input v-model="ruleForm.cardNo" clearable />
      </el-form-item>
      <el-form-item label="银行账户名" prop="accountName">
        <el-input v-model="ruleForm.accountName" clearable />
      </el-form-item>
      <el-form-item label="开户行行号" prop="bankCode">
        <el-input v-model="ruleForm.bankCode" clearable />
      </el-form-item>
      <el-form-item label="开户行名称（银行名称）" prop="bank">
        <el-input v-model="ruleForm.bank" clearable />
      </el-form-item>
      <el-form-item label="开户行名称（支行名称）" prop="bankBranch">
        <el-input v-model="ruleForm.bankBranch" clearable />
      </el-form-item>
      <el-form-item label="收款账户开户省市" prop="areaId">
        <!-- @vue-ignore -->
        <el-cascader
          v-model="ruleForm.areaId"
          :options="areaList"
          :props="defaultProps"
          ref="addSort"
          @change="handleChange"
          clearable
        />
      </el-form-item>
      <el-form-item label="财务联系人姓名" prop="treasurerName">
        <el-input v-model="ruleForm.treasurerName" clearable />
      </el-form-item>
      <el-form-item label="财务联系人手机号" prop="treasurerPhone ">
        <el-input v-model="ruleForm.treasurerPhone" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" clearable  maxlength="20"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          {{ '确定' }}
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script lang="ts" setup>
//@ts-ignore
import { provinceAndCityData } from 'element-china-area-data'
defineOptions({ name: 'SystemMenuForm' })
import { defaultProps } from '@/utils/tree'
import { getAreaTree } from '@/api/system/area'
import * as channelApi from '@/api/channel/index'
const title = ref('')
const dialogVisible = ref(false) // 弹窗的是否展示
const formType = ref(false)
const formSize = ref<any>('default')
const ruleFormRef = ref<any>()
let ruleForm = reactive<any>({
  id: '',
  name: '',
  code: '',
  cardNo: '',
  accountName: '',
  bankCode: '',
  bank: '',
  bankBranch: '',
  cityCode: '',
  cityName: '',
  provinceCode: '',
  provinceName: '',
  treasurerName: '',
  treasurerPhone: '',
  remark: '',
  areaId: ''
})

const areaList = ref([])
const emit = defineEmits<{
  close: any
}>()
const handleChange = (e) => {
  areaList.value.forEach((item: any) => {
    item.children.forEach((child: any) => {
      if (child.id === e) {
        ruleForm.provinceCode = item.id
        ruleForm.cityCode = child.id
        ruleForm.provinceName = item.name
        ruleForm.cityName = child.name
      }
    })
  })
}
const resetForm2 = () => {
  ruleForm.id = ''
  ruleForm.name = ''
  ruleForm.code = ''
  ruleForm.cardNo = ''
  ruleForm.accountName = ''
  ruleForm.bankCode = ''
  ruleForm.bankBranch = ''
  ruleForm.bank = ''
  ruleForm.cityCode = ''
  ruleForm.cityName = ''
  ruleForm.provinceCode = ''
  ruleForm.provinceName = ''
  ruleForm.treasurerName = ''
  ruleForm.remark = ''
  ruleForm.treasurerPhone = ''
  ruleForm.areaId = ''
}
const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      if (formType.value) {
      } else {
        delete ruleForm.id
      }
      channelApi.addChannel(ruleForm).then((res) => {
        console.log(res, 'ress')
        if (res) {
          dialogVisible.value = false
          emit('close', res)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const rules = reactive<any>({
  name: [{ required: true, message: '请填写渠道名称', trigger: 'blur' }],
  code: [
    {
      required: true,
      message: '请填写渠道编号',
      trigger: 'change'
    }
  ],
  cardNo: [
    {
      required: true,
      message: '请填写银行账户',
      trigger: 'change'
    },
    { max: 32, message: '最大长度32', trigger: 'blur' }
  ],
  accountName: [
    {
      required: true,
      message: '请填写银行账户名',
      trigger: 'change'
    },
    { max: 60, message: '最大长度60', trigger: 'blur' }
  ],
  bankCode: [
    {
      required: true,
      message: '请填写开户行行号',
      trigger: 'change'
    },
    { max: 12, message: '最大长度12', trigger: 'blur' }
  ],
  bank: [
    {
      required: true,
      message: '请填写开户行名称',
      trigger: 'change'
    },
    { max: 20, message: '最大长度20', trigger: 'blur' }
  ],
  bankBranch: [
    {
      required: true,
      message: '请填写开户行支行名称',
      trigger: 'change'
    },
    { max: 60, message: '最大长度60', trigger: 'blur' }
  ],
  areaId: [{ required: true, message: '请选择省市', trigger: 'blur' }]
})
const resetForm = (formEl: any | undefined) => {
  resetForm2()
  dialogVisible.value = false
}

/** 打开弹窗 */
const rows = ref(null) as any
const open = async (type: string, id?: number, row?: any) => {
  if (id && row) {
    rows.value = { ...row }
    ruleForm.id = id
    ruleForm = rows.value
    console.log(rows.value.cityCode)
    ruleForm.areaId = Number(rows.value.cityCode)
  }
  if (type === 'update') {
    formType.value = true
    title.value = '修改渠道'
  } else {
    formType.value = false
    title.value = '新增渠道'
  }
  dialogVisible.value = true

  // 获得菜单列表
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
function removeThirdLevelChildren(data) {
  data.forEach((item) => {
    // 删除当前项（第一级）的children（如果存在）
    // 但在这个例子中，我们实际上不需要这么做，因为目标是第三级

    // 检查是否有children（第二级）
    if (item.children && item.children.length > 0) {
      item.children.forEach((child,index) => {
        // 删除第二级项的children（即第三级）
        if (child.name.includes('行政区划')) {
          item.children = item.children.concat(child.children)
          item.children.splice(index, 1); 
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
watch(dialogVisible, async (newValue) => {
  if (newValue) {
    areaList.value = removeThirdLevelChildren(await getAreaTree())
  } else {
    resetForm2()
  }
})
</script>

<style scoped lang="scss"></style>
