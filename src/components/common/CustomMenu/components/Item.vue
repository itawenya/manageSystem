<!-- 
* @description: 菜单中的每一项具体内容 处理点击事件
* @fileName: Item.vue
* @author:刘世博 文洋
* @date: 2024-01-11
* @version: 
!-->
<template>
  <li @click="chooseItem">
    <slot></slot>
  </li>
</template>

<script>
import { getCurrentInstance, inject } from 'vue'
import systemEventBus from '@/utils/systemEventBus'

export default {
  props: {
    value: String,
    type:Number,
  },
  setup(props) {
    const chooseItem = () => {
      systemEventBus.$emit('chooseItem', props.value, props.type, token)
    }

    // 获取实例
    const page = getCurrentInstance();
    // 接收token
    const token = inject('token');
    // 缓存token
    page.token = token

    return {
      chooseItem
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  padding: 6px 20px;
  color: #FFFFFFFF;
}
li:nth-of-type(odd){ background: #6B7EE4FF;}
li:nth-of-type(even){ background:#8190e2FF;}

li:hover {
  color: black;
  // background-color: rgb(200, 207, 213);
  background-color: rgb(246,248,254);
  transition: all .2s;
}
</style>