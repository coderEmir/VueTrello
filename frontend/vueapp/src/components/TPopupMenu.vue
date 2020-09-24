<template>
  <ul class="popup-menu-list">
    <li
      v-for="item of items"
      :key="item.name"
      :class="{separator: item.separator}"
      @click="command(item.command)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: "TPopMenu",
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
      command(e) {
          this.$emit('command',e)
      }
  },
};
</script>

<style lang="scss" scoped>
</style>