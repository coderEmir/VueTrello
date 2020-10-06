<template>
  <div>
    <div class="list-wrap" :class="{ 'list-adding': true }">
      <div class="list-placeholder" ref="listPlaceholder"></div>

      <div class="list" ref="list" v-if="listData">
        <div class="list-header" ref="listHeader">
          <textarea class="form-field-input" v-model="listData.name"></textarea>
          <div class="extras-menu">
            <span class="icon icon-more"></span>
          </div>
        </div>
        <div class="list-cards" v-if="cards">
          <t-card v-for="card of cards" :data="card" :key="card.id" :listName="listData.name"/>

          <div class="list-card-add-form" ref="addCardForm">
            <textarea
              class="form-field-input"
              placeholder="为这张卡片添加标题……"
              ref="newListName"
            ></textarea>
          </div>
        </div>
        <div class="list-footer">
          <div class="list-card-add" 
          ref="cardAdd"
          @click="showListCardAddForm">
            <span class="icon icon-add"></span>
            <span>添加另一张卡片</span>
          </div>
          <div class="list-add-confirm" ref="addCardConfirm">
            <button class="btn btn-success" @click="addNewCard">添加卡片</button>
            <span class="icon icon-close" @click="hideListCardAddForm"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TCard from "@/components/TCard";
export default {
  name: "TList",

  components: {
    TCard,
  },
  props: {
    listData: Object,
  },
  data() {
    return {
      drag: {
        isDown: false,
        isDrag: false,
        downClientX: 0,
        downClientY: 0,
        downElementX: 0,
        downElementY: 0,
      }
    };
  },
  computed: {
    cards() {
      return this.$store.getters["card/getCards"](this.listData.id);
    },
  },

  async created() {
    if (!this.cards.length) {
      await this.$store.dispatch("card/getCards", this.listData.id);
    }
  },

  mounted() {
    this.hideListCardAddForm()
    this.$refs.listHeader.addEventListener("mousedown", this.dragDown);
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragUp);
  },

  methods: {
    dragDown(e) {
      this.drag.isDown = true;
      this.drag.downClientX = e.clientX;
      this.drag.downClientY = e.clientY;
      let pos = this.$refs.list.getBoundingClientRect();
      this.drag.downElementX = pos.x;
      this.drag.downElementY = pos.y;
      this.$refs.listPlaceholder.style.display = "inline-block";
    },

    dragMove(e) {
      if (this.drag.isDown) {
        let listElement = this.$refs.list;
        let x = e.clientX - this.drag.downClientX;
        let y = e.clientY - this.drag.downClientY;
        let conditionX = Math.abs(x)
        let conditionY = Math.abs(y)
        // 触发拖拽的条件
        if ( conditionX || conditionY > 10) {
          if (!this.drag.isDrag) {
            this.drag.isDrag = true;
            this.$refs.listPlaceholder.style.height =
            listElement.offsetHeight + "px";
            listElement.style.position = "absolute";
            listElement.style.zIndex = 99999;
            listElement.style.transform = "rotate(3deg)";
            document.body.appendChild(listElement);

            this.$emit("dragStart", {
              component: this,
            });
          }
          listElement.style.left = this.drag.downElementX + x + "px";
          listElement.style.top = this.drag.downElementY + y + "px";

          this.$emit("dragMove", {
            component: this,
            x: e.clientX,
            y: e.clientY,
          });
        }
      }
    },

    dragUp(e) {
      if (this.drag.isDown) {
        this.drag.isDown = false
        if (this.drag.isDrag) {
          let listElement = this.$refs.list;
          
          this.$refs.listPlaceholder.style.display = "none";
          listElement.style.position = "relative";
          listElement.style.zIndex = 0;
          listElement.style.left = 0;
          listElement.style.top = 0;
          listElement.style.transform = "rotate(0deg)";
          listElement.style.width = "260px"
          this.$el.appendChild(listElement);

          this.$emit("dragEnd", {
            component: this,
          });
        } 
        this.drag.isDrag = false;
      }else {
          if (e.path.includes(this.$refs.newBoardListName)) {
            this.$refs.newBoardListName.select();
          }
        }
    },

    async editListName() {
      let { value, innerHTML } = this.$refs.newBoardListName;
      if (value !== innerHTML) {
        await this.$store.dispatch("list/editList", {
          boardId: this.listData.boardId,
          id: this.listData.id,
          name: value,
        });
      }
    },

    // 添加列表
    showListCardAddForm() {
      this.$refs.addCardForm.style.display = "block";
      this.$refs.addCardConfirm.style.display = "block";
      this.$refs.cardAdd.style.display = "none";
      // e.target.parentNode.style.display = "none";
      this.$nextTick(() => {
        this.$refs.newListName.focus();
      });
    },

    hideListCardAddForm() {
      
      this.$refs.addCardForm.style.display = "none";
      this.$refs.addCardConfirm.style.display = "none";
      this.$refs.cardAdd.style.display = "block";
      this.$refs.newListName.value = "";
    },

    addNewCard() {
      let { value } = this.$refs.newListName;

      if (value.trim() !== "") {
        
          this.$store.dispatch("card/postCard", {
            boardListId: this.listData.id,
            name: value,
          });
          this.$refs.newListName.value = ""
          this.$message.success("添加成功");
        
      } else {
        this.$refs.newListName.focus();
      }
    },
  },
};
</script>