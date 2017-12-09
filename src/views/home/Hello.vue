<!-- src/components/Hello.vue -->
<template>
    <div class="hello">
        <div class="greeting">Hello {{name}} <span class="number">{{count}}</span></div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
        <ul>
          <li v-for="view in routes" :key="view.link">
            <a :href="view.link">{{view.name}}</a>
          </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
@Component
export default class Hello extends Vue {
  name: string = 'friend'
  count: number = 1
  routes: Array<Object> = [
    {
      name: 'home',
      link: '/home'
    },
    {
      name: 'backstage',
      link: '/backstage'
    },
    {
      name: 'login',
      link: '/login'
    }
  ]
  increment() {
    this.count++
  }
  decrement() {
    this.count--
    this.count = this.count < 1 ? 1 : this.count
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
    margin-right: 1rem;
  }
  .number {
    width: 2rem;
    display: inline-block;
    text-align: right;
  }
}
</style>

