<template>
  <Dialog v-model="dialogVisible" :title="title">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="协议名称" prop="name">
        <el-input v-model="ruleForm.name" :disabled="formType" />
      </el-form-item>

      <el-form-item label="版本号" prop="version">
        <el-input v-model="ruleForm.version" :disabled="true" />
      </el-form-item>
      <el-form-item label="版本唯一标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="formType" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Editor v-model="ruleForm.content" :editor-config="editorConfig" />
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
import { Editor } from '@/components/Editor'
import { createEditorConfig } from './editor-config'
import * as contractApi from '@/api/contract/index'
//@ts-ignore

defineOptions({ name: 'SystemMenuForm' })
const UPLOAD_URL = import.meta.env.VITE_BASE_URL + '/admin-api/mp/material/upload-permanent' // 上传永久素材的地址
const title = ref('')
const editorConfig = createEditorConfig(UPLOAD_URL, 1)
const dialogVisible = ref(false) // 弹窗的是否展示
const emit = defineEmits<{
  close: any
}>()
const formType = ref(false)
const formSize = ref<any>('default')
const ruleFormRef = ref<any>()
let ruleForm = reactive<any>({
  name: '',
  content: '',
  version: '',
  id: '',
  code: ''
})
const resetForm1 = () => {
  ruleForm.name = ''
  ruleForm.content = ''
  ruleForm.version = ''
  ruleForm.code = ''
  delete ruleForm.id
  delete ruleForm.createTimeStr
  delete ruleForm.createTime
}
const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      if (!formType.value) {
        contractApi.addContract(ruleForm).then((res) => {
          if (res) {
            dialogVisible.value = false
            emit('close')
          }
        })
      } else {
        contractApi.updateContract(ruleForm).then((res) => {
          if (res) {
            dialogVisible.value = false
            emit('close')
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const rules = reactive<any>({
  name: [{ required: true, message: '请填写协议名称', trigger: 'blur' }],
  version: [
    {
      required: false,
      message: '请填写版本号',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '请填写版本号唯一标识',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请填写内容',
      trigger: 'change'
    }
  ]
})
const resetForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}

/** 打开弹窗 */
const rows = ref(null) as any
const open = async (type: string, id?: number, row?: any) => {
  console.log(type, id, row, 'params')
  if (type === 'update') {
    rows.value = { ...row }
    title.value = '修改协议'
    ruleForm = rows.value
    formType.value = true
  } else {
    title.value = '新增协议'
    formType.value = false
  }
  dialogVisible.value = true

  // 获得菜单列表
}
watch(dialogVisible, (newValue) => {
  if (!newValue) {
    resetForm1()
  }
})
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss"></style>
