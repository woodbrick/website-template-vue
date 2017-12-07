<style>
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 300px;
    background-color: red;
    text-align: center;
    line-height: 20rem;
  }
  .swiper-inner {
    margin: auto;
    width: 800px;
    height: 400px;
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .swiper-container-3d .swiper-slide-shadow-right {
    background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, 0)));
    background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: -moz-linear-gradient(right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: -o-linear-gradient(right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
  }
  .swiper-container-3d .swiper-slide-shadow-left {
    background-image: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, 0.3)), to(rgba(0, 0, 0, 0)));
    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
  }
</style>
<template>
  <div class="swiper-inner">
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
      <!-- slides -->
      <swiper-slide>I'm Slide 1</swiper-slide>
      <swiper-slide>I'm Slide 2</swiper-slide>
      <swiper-slide>I'm Slide 3</swiper-slide>
      <swiper-slide>I'm Slide 4</swiper-slide>
      <swiper-slide>I'm Slide 5</swiper-slide>
      <swiper-slide>I'm Slide 6</swiper-slide>
      <swiper-slide>I'm Slide 7</swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
//  require('swiper/dist/css/swiper.css')

  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  // swiper options example:
  export default {
    name: 'carrousel',
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          effect: 'coverflow',
          coverflow: {
            rotate: -30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }
        }
      }
    },
    // you can find current swiper instance object like this, while the notNextTick property value must be true
    // 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted() {
      // you can use current swiper instance object to do something(swiper methods)
      // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
      console.log('this is current swiper instance object', this.swiper)
      this.swiper.slideTo(3, 1000, false)
    }
  }
</script>