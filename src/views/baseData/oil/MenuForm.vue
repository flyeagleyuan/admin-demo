<template>
  <Dialog v-model="dialogVisible" title="油站详情">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="100px">
      <el-form-item label="油站大图">
        <div>
          <img :src="imgUrl" alt="" style="width: 200px; height: 200px" />
        </div>
      </el-form-item>
      <el-form-item label="油站鸟瞰图">
        <div id="container" style="width: 500px; height: 500px"> </div>
      </el-form-item>
    </el-form>
    <ContentWrap>
      <el-table :data="list" row-key="id">
        <el-table-column label="油号" align="center" prop="oilCode" width="120" />
        <el-table-column align="center" label="国家价" prop="countryPrice" width="250" />
        <el-table-column label="油站挂牌价" align="center" prop="stationPrice" width="150" />
        <el-table-column label="优惠价" align="center" prop="discountPrice" width="150" />
        <el-table-column label="油枪编号" align="center" prop="oilgunCodes" width="150" />
      </el-table>
    </ContentWrap>
  </Dialog>
</template>
<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import { CommonStatusEnum, SystemMenuTypeEnum } from '@/utils/constants'
import dingwei from '@/assets/dingwei.png'
import * as oilApi from '@/api/oil/index'
//@ts-expect-error
window._AMapSecurityConfig = {
  securityJsCode: '101a41339aa8e7be7909da6af6d98e8b'
}
defineOptions({ name: 'SystemMenuForm' })
const imgUrl = ref(
  ''
)

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: 0,
  name: '',
  permission: '',
  type: SystemMenuTypeEnum.DIR,
  sort: Number(undefined),
  parentId: 0,
  path: '',
  icon: '',
  component: '',
  componentName: '',
  status: CommonStatusEnum.ENABLE,
  visible: true,
  keepAlive: true,
  alwaysShow: true
})

const list = ref([
  {
    id: 0,
    content: '国家价',
    i92: '6.28',
    i95: '6.28',
    i98: '6.28',
    i0: '111'
  },
  {
    id: 1,
    content: '油站挂牌价',
    i92: '7.00',
    i95: '7.00',
    i98: '7.00',
    i0: '7.00'
  },
  {
    id: 2,
    content: '优惠价',
    i92: '7.00',
    i95: '7.00',
    i98: '7.00',
    i0: '0.11'
  },
  {
    id: 3,
    content: '油枪编号',
    i92: '10、12、13、14',
    i95: '10、12、13、14',
    i98: '10、12、13、14',
    i0: '10、12、13、14'
  }
])

let mapPosition = reactive([121.46578788757326, 31.15932801940427]) as any

/** 打开弹窗 */
const open = async (type: string, id?: number, parentId?: number) => {
  dialogVisible.value = true
  console.log(type, 'typee')
  oilApi.getOilStationInfo({ id: type }).then((res) => {
    console.log(res, 'res')
    imgUrl.value = res.stationBannerPic
    list.value = res.prices
    mapPosition = res.baiduLocation
    renderMap(map.value)
  })
  // 获得菜单列表
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const renderMap = (AMap:any) => {
  const marker = new AMap.Marker({
    position: new AMap.LngLat(mapPosition[0], mapPosition[1]),
    icon: new AMap.Icon({
      // 自定义图标
      size: new AMap.Size(30, 30), // 图标大小
      image: dingwei,
      imageSize: new AMap.Size(30, 30) // 图片大小（同icon的size）
    }),
    offset: new AMap.Pixel(-10, -20) // 相对于标注点的偏移量
  })
  new AMap.Map('container', {
    center: mapPosition,
    // center: [116.397428, 39.90923] ,
    zoom: 16
  }).add(marker)
}
const map = ref(null) as any

watch(dialogVisible, (newValue) => {
  if (newValue) {
    if ('geolocation' in navigator) {
      AMapLoader.load({
        key: 'c288b570f8b96d037920769a2ba75577', //申请好的 Web 端开发者 Key，首次调用 load 时必填
        version: '1.4.15', //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale'] //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['AMap.Scale','...','...']
      })
        .then((AMap) => {
          console.log(AMap, '地图实例')
          renderMap(AMap)
          map.value = AMap
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      // geolocation is not supported
      console.log('Geolocation is not supported by this browser.')
    }
  }
})
</script>

<style scoped lang="scss">
:deep(.amap-logo) {
  display: none !important;
}
:deep(.amap-copyright) {
  display: none !important;
}
</style>
