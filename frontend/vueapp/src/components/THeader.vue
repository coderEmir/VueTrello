<template>
  <header>
    <div class="left">
      <router-link :to="{name: 'Home'}" class="btn btn-icon">
        <i class="icon icon-home"></i>
      </router-link>
      <router-link :to="{name: 'Home'}" class="btn btn-icon">
        <i class="icon icon-board"></i>
        <span class="txt">看板</span>
      </router-link>
    </div>
    <router-link :to="{name: 'Home'}" class="logo"></router-link>
    <div class="right">
      <a href class="btn btn-icon">
        <i class="icon icon-add"></i>
      </a>
      <t-popup :title="userInfo.name" ref="tPopup">
        <button class="avatar">
          <span>{{userInfo.name[0].toUpperCase()}}</span>
        </button>
        <t-popup-menu :items="menuItems" @command="execute" slot="content"/>
      </t-popup>
    </div>
    <slot/>
  </header>
</template>

<script>
import TPopup from "@/components/TPopup";
import TPopupMenu from "@/components/TPopupMenu";
import { mapState } from 'vuex'
export default {
  name: "THeader",
  components: {
    TPopup,
    TPopupMenu,
  },
  data() {
    return {
      menuItems: [{ name: "退出", command: "logout" }],
    };
  },
  methods: {
    execute(command) {
      switch (command) {
        case 'logout':
            this.logout()
          break;
      
        default:
          break;
      }
    },
    
    logout() {
      this.$store.dispatch('user/logout')
      // this.$store.dispatch('board/cleanBoardMemory')
      this.$router.push({name:"Login"})
      this.$refs.tPopup.close()
    }
  },
  computed: {
            ...mapState('user', {
                userInfo: state => state.userInfo
            })
        }
};
</script>