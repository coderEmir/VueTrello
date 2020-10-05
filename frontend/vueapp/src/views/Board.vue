<template>
    <div id="mainBoard">
        <!--头部-->
        <t-header />
        <!--正文-->
        <h2 v-if="board">
                {{board.name}}
                <!-- test
                <span class="btn btn-icon">
                    邀请
                </span> -->
            </h2>
        <main id="board">
            <!--面板容器-->
            <div class="board">
                <!--面板列表容器-->
                
                <t-list 
                class="board-list"
                @dragStart="dragStart"
                @dragMove="dragMove"
                @dragEnd="dragEnd"
                v-for="item in lists" :key="item.id" :listData="item"/>
                <!--无内容列表容器-->
                <div class="list-wrap no-content" :class="{'list-adding':isAdding}">
                    <div class="list-add" @click="showListAdding">
                        <span class="icon icon-add"></span>
                        <span>添加另一个列表</span>
                    </div>

                    <div class="list">
                        <div class="list-cards">
                            <div class="list-card-add-form">
                                <input class="form-field-input" placeholder="为这张卡片添加标题……"  ref="inputListName"/>
                            </div>
                        </div>

                        <div class="list-footer">
                            <div class="list-add-confirm">
                                <button class="btn btn-success" @click="addingList">添加列表</button>
                                <span class="icon icon-close" @click="hiddenListAdding"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <router-view></router-view>
    </div>
</template>

<script>
import THeader from '@/components/THeader.vue'
import TList from '@/components/TList.vue'
export default {
    name: "Board",
    components: {
        THeader,
        TList
    },

    created() {
        if (!this.board) {
            this.$store.dispatch('board/getBoard',this.$route.params.id)
        }
        if (!this.lists || this.lists.length === 0) {
            this.$store.dispatch('list/getLists',this.$route.params.id)
        }
    },

    data() {
        return {
            isAdding: false
        }
    },
    computed: {
        board() {          
            // 获取面板
            return this.$store.getters["board/getBoard"](parseInt(this.$route.params.id))
        },
        lists() {
            // 获取列表详情
            return this.$store.getters["list/getLists"](parseInt(this.$route.params.id))
        }
    },
    methods: {
        showListAdding() {
            this.isAdding = true
            this.$nextTick(()=>{
                this.$refs.inputListName.focus()
            })
        },
        hiddenListAdding() {
            this.isAdding = false
        },
        addingList() {
            let listName = this.$refs.inputListName.value || ""
            if (listName.trim()) {
                this.$store.dispatch("list/addList",{name: listName,boardListId: parseInt(this.$route.params.id)})
                this.$message.success("列表添加成功！")
                this.isAdding = false
                this.$refs.inputListName.value = ""
            }
            else
            {
                this.$refs.inputListName.focus()
            }
        },
        // 拖拽
        dragStart(e) {
            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.board-list')];
            el._index = lists.findIndex(list => list === el);
        },
        dragMove(e) {
            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.board-list')];
            let currentIndex = lists.findIndex( list => list === el );
            
            lists.forEach((list, index) => {
                if ( index !== currentIndex ) {
                    let clientRect = list.getBoundingClientRect();
                    if (
                        e.x >= clientRect.left
                        &&
                        e.x <= clientRect.right
                        &&
                        e.y >= clientRect.top
                        &&
                        e.y <= clientRect.bottom
                    ) {
                        if (currentIndex < index) {
                            board.insertBefore(el, list.nextElementSibling);
                        } else {
                            board.insertBefore(el, list);
                        }
                    }
                }
            } );
        },
        async dragEnd(e) {

            let el = e.component.$el;
            let board = el.parentNode;
            let lists = [...board.querySelectorAll('.board-list')];
            let currentIndex = lists.findIndex(list => list === el);

            // 判断一下当前这个元素是否移动了
            // console.log(el._index, currentIndex);
            if (el._index !== currentIndex) {

                let newOrder;

                // 获取当前所在位置的上一个列表和下一个列表的order值
                let prevOrder = this.lists[currentIndex - 1] && parseFloat( this.lists[currentIndex - 1].order );
                let nextOrder = this.lists[currentIndex + 1] && parseFloat( this.lists[currentIndex + 1].order );

                if (currentIndex === 0) {
                    newOrder = nextOrder / 2;
                } else if (currentIndex === lists.length - 1) {
                    newOrder = prevOrder + 65535;
                } else {
                    newOrder = prevOrder + (nextOrder - prevOrder) / 2;
                }
                console.log(newOrder);
                await this.$store.dispatch('list/editList', {
                    boardId: this.board.id,
                    id: e.component.listData.id,
                    order: newOrder
                })

            }

        }
    },
}
</script>