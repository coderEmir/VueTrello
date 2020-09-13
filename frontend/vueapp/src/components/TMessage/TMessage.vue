<template>
  <transition name="message-fade">
      <div :class="[
        'message', 
        'message-' + type, 
        center ? 'is-center' : '']"
        :style="{top: offset + 'px'}"
        v-if="isShow"
      >
        <p class="message-content">提示信息：{{message}}</p>
        <i class="icon icon-close"></i>
      </div>
  </transition>
</template>

<script>
export default {
  name: "TMessage",
  data() {
    return {
      message: "默认信息111",
      type: "info",
      center: true,
      offset: 20,
      isShow: true,
      // 显示时间 1s
      duration: 1000,
      timer: null,
      onClose: null
    };
  },
  mounted() {
      this.timer = setTimeout(() => {
          if (this.isShow) {
              this.close()
          }
      }, this.duration);
  },
  methods: {
      close() {
          this.isShow = false
          if (typeof this.onClose === 'function') {
                    this.onClose();
              }
      }
  },
};
</script>