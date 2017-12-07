<!-- src/components/Hello.vue -->
<template>
    <div class="hello">
        <div class="greeting">Hello {{name}} {{count}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component
  export default class Hello extends Vue {
    name: string = 'friend'
    count: number = 0
    increment() {
      this.count++
    }
    decrement() {
      this.count--
    }
  }
</script>

<style style lang="less">
.hello {
  width: 20%;
  min-width: 300px;
  margin: auto;

  .greeting {
    font-size: 20px;
    text-align: center;
    display: inline-block;
  }
}
</style>

