<template>
  <div class="popup-container">
    <div @click="open">
      <slot></slot>
    </div>
    <div class="popup" v-show="isShow" ref="popup">
      <div class="popup-header">
        <span class="popup-title">{{title}}</span>
        <a class="popup-header-close">
          <i @click="close" class="icon icon-close" ref="close"></i>
        </a>
      </div>

      <div class="popup-content">
        <slot name="content"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TPopup",
  props: {
      title: {
          type: String,
          default: "菜单"
      }
  },
  data() {
    return {
      isShow: false,
      tipViewLeft: 0,
    };
  },
  methods: {
    close(e) {
      // e.path -> 事件冒泡的路径
      
        if (!e || e.path.includes(this.$refs.close) || !e.path.includes(this.$el)) {
            this.isShow = false;
            this.$emit('close')
            window.removeEventListener('click',this.close)
        }
    },

    open() {
      window.addEventListener('click',this.close)
      this.isShow = true;
      let $popup = this.$refs.popup;


      let tipViewLeft = 0
    //   注意，这里要重置left
      $popup.style.left = tipViewLeft + "px";
      // 获取界面更新后的数据
      this.$nextTick(() => {

        let $popupReact = $popup.getBoundingClientRect();
        if ($popupReact.right > window.innerWidth) {
          tipViewLeft = -$popupReact.width + this.$el.offsetWidth;
        }

        $popup.style.left = tipViewLeft + "px";

        this.$emit('open')
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>