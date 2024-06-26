<!-- 
* @description: 内机监控操作部分（按钮） 【改变弹窗显隐，触发对应事件并在monitoring中响应】
* @fileName: Monitor_display_control.vue
* @author:刘世博 文洋
* @date: 2024-01-09
* @version: 
!-->
<template>
  <div class="Monitor_display_control">
    <el-button class="btn" @click="fetchData">状态刷新</el-button>
    <el-button class="btn" @click="changeDialogVisible">实时控制</el-button>
    <el-button class="btn" @click="intelligentControlDialogVisible">智能控制</el-button>
    <el-input v-model="search" placeholder="Please input" class="input-with-select" @keydown.enter="handleSearch">
      <template #append>
        <el-button :icon="Search" @click="handleSearch" />
      </template>
    </el-input>
  </div>
</template>
  
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessage } from "element-plus";
import { Search, Stopwatch } from '@element-plus/icons-vue'
import { post } from "@/api/http.js";
import { dataFlattenById } from '@/utils/treeArr.js'
import { useCustomStore } from '@/store'; // 引入pinia

const store = useCustomStore()
const props = defineProps(['dialogVisible', 'control_dialogValue', 'intelligent_controlValue'])
const emit = defineEmits()

const search = ref('')

function handleSearch() {
  if (search.value === "") {
    ElMessage({
      showClose: true,
      message: "输入的内容不能为空！",
      type: "error",
      offset: 100
    })
  } else {
    store.filterMonitorTableData(search.value.trim())
  }
}

const handleNodeClick = (data) => {
    store.lastTreeNode = data
    let dataFlattenByIdResult = dataFlattenById(data.id, airconditionNodeArray.value) //将有层级的节点数组扁平化
    store.setMonitorTableData(dataFlattenByIdResult)   //将结果交由pinia 在table中展示
    store.setMonitorHead({ label: data.label, length: dataFlattenByIdResult.length })
}

const airconditionNodeArray = ref([])

async function InitalAirconditionState() {
  const res = await post('/machinestate', {
    id: "16"
  }, {
    baseURL: 'http://lab.zhongyaohui.club/'
  })
  airconditionNodeArray.value = res.data
  let dataFlattenByIdResult = dataFlattenById("16", airconditionNodeArray.value) //将有层级的节点数组扁平化
  store.setMonitorTableData(dataFlattenByIdResult)   //将结果交由pinia 在table中展示
  handleNodeClick(store.lastTreeNode)
}

async function getTreeArr() {
    const res = await post('/leftbar', null, {
        baseURL: 'http://lab.zhongyaohui.club/'
    })
    // console.log('左侧树节点===================》', res.data[0].children);
    store.setLeftTreeData(res.data[0].children)
    // console.log(store.leftTreeData);
}

const fetchData = async () => {
  try {
    store.airconditionNodeArrayLoading = true
    // 执行获取数据的逻辑，例如重新调用 InitalAirconditionState 方法
    await InitalAirconditionState();
    await getTreeArr();
    store.airconditionNodeArrayLoading = false
    ElMessage({
      showClose: true,
      message: "已成功更新数据！",
      type: "success",
      offset: 120
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: `数据更新失败: ${error.message}`,
      type: "error",
      offset: 120
    });
  }
};

const DialogVisible = ref(props.dialogVisible)
const Control_dialogValue = ref(props.control_dialogValue)
const intelligent_controlValue = ref(props.intelligent_controlValue)

function changeDialogVisible() {
  DialogVisible.value = true
  Control_dialogValue.value = true
  emit('updateDialogVisible', DialogVisible.value)
  emit('updateControl_dialogValue', Control_dialogValue.value)
}

function intelligentControlDialogVisible() {
  DialogVisible.value = true
  intelligent_controlValue.value = true
  emit('updateDialogVisible', DialogVisible.value)
  emit('updateIntelligent_controlValue', intelligent_controlValue.value)
}



</script>
  
<style lang="scss" scoped>
.Monitor_display_control {
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .input-with-select {
    width: 200px;
    margin-left: 20px;
  }

  .btn {
    margin: auto 10px;
  }
}
</style>