<template>
    <div id="home">
        <!--头部-->
        <t-header/>
        <main>
            <h2>
                <span class="icon icon-board"></span>
                我的看板
            </h2>
            <ul class="board-items">
                <li 
                    class="board-item"
                    v-for="item in boards" :key="item.id"
                    @click="showBoardDetail(item)"
                >
                    <span class="title">{{item.name}}</span>
                </li>
                <li  class="board-item create-new-board">
                    <!-- blur失去焦点时触发事件 -->
                    <textarea class="title form-field-input" placeholder="创建新看板" @blur="newBoard" ref="newBoardName"></textarea>
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
import THeader from '@/components/THeader.vue'
import { mapState } from 'vuex'
export default {
    created() {
        if (this.isInitStore) {
            // dispatch 一个 action（要注明命名空间和action名称），获取boards
            this.$store.dispatch('board/getBoards')
        }
    },
    components: {
        THeader
    },
    computed: {
        ...mapState("board",{
            boards: state => state.boards,
            isInitStore: state => state.isInitStore
        })
    },
    methods: {
        newBoard() {
            let value = this.$refs.newBoardName.value
            if (value.replace(/[\s\n\t]+$/g, "").length > 0) {
                this.$store.dispatch('board/addBoard', value)    
                this.$message.success('面板创建成功');
            }
            this.$refs.newBoardName.value = ""
        },
        showBoardDetail(item) {
            this.$router.push('board/'+item.id)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>