<template>
  <!--遮罩层-->
  <div class="window-overlay" style="display: block">
    <!--弹出式窗口-->
    <div class="popup">
      <div class="popup-header">
        <div class="popup-title">
          <div class="popup-title-icon">
            <span class="icon icon-card"></span>
          </div>
          <div class="popup-title-text">
            <textarea class="form-field-input">平台规划</textarea>
          </div>
          <div class="popup-title-detail">在列表 {{ currentListName }} 中</div>
        </div>
        <router-link class="popup-header-close" to>
          <i class="icon icon-close" @click="$router.go(-1)"></i>
        </router-link>
      </div>

      <div class="popup-content">
        <!--描述-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <span class="icon icon-description"></span>
            </div>
            <div class="title-text">
              <h3>描述</h3>
              <button class="btn btn-edit">编辑</button>
            </div>
          </div>

          <p class="description">
            <textarea class="form-field-input">To Do</textarea>
          </p>
        </div>

        <!--附件-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <i class="icon icon-attachment"></i>
            </div>
            <div class="title-text">
              <h3>附件</h3>
            </div>
          </div>

          <ul class="attachments" v-if="card">
            <li
              class="attachment"
              v-for="attachment of card.attachments"
              :key="attachment.id"
            >
              <div
                class="attachment-thumbnail"
                :style="`background-image: url(${server.staticPath}${attachment.path})`"
              ></div>
              <p class="attachment-detail">
                <span class="attachment-thumbnail-name"
                  ><strong>{{ attachment.detail.originName }}</strong></span
                >
                <span class="attachment-thumbnail-descriptions">
                  <span class="datetime">
                    {{ attachment.createdAt | dateTime }}
                  </span>
                  <span> - </span>
                  <u @click="removeAttachment(attachment.id)">删除</u>
                </span>
                <span class="attachment-thumbnail-operation">
                  <i class="icon icon-card-cover"></i>
                  <u
                    v-if="attachment.isCover"
                    @click="removeCover(attachment.id)"
                    >移除封面</u
                  >
                  <u v-else @click="setCover(attachment.id)">设为封面</u>
                </span>
              </p>
            </li>
          </ul>
          <div>
            <button class="btn btn-edit" @click="$refs.attachment.click()">
              添加附件
            </button>
            <input
              type="file"
              ref="attachment"
              style="display: none"
              @change="uploadAttachment"
            />
          </div>
        </div>

        <!--活动-->
        <div class="window-module">
          <div class="title">
            <div class="title-icon">
              <i class="icon icon-activity"></i>
            </div>
            <div class="title-text">
              <h3>评论</h3>
            </div>
          </div>

          <div class="comment-post" v-if="user">
            <div class="avatar">
              <span>{{ user.name[0].toUpperCase() }}</span>
            </div>
            <div class="comment-content-box editing">
              <textarea
                class="comment-content-input"
                placeholder="添加评论……"
                ref="content"
              ></textarea>
              <button class="btn btn-edit" @click="postNewComment">保存</button>
            </div>
          </div>

          <ul class="comments" v-if="comments">
            <li
              class="comment"
              v-for="comment of comments.rows"
              :key="comment.id"
            >
              <div class="avatar">
                <span>{{ comment.user.name[0].toUpperCase() }}</span>
              </div>
              <div class="description">
                <div class="header">
                  <strong>{{ comment.user.name }}</strong>
                  <span> at </span>
                  <i>{{ comment.createdAt | dateTime }}</i>
                </div>
                <div class="content">
                  {{ comment.content }}
                </div>
              </div>
            </li>
          </ul>
          <div class="comment-pagination">
            <t-pagination
              :pages="comments.pages"
              :page="comments.page"
              @changePage="changePage"
            ></t-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateTime from "@/filters/dateTime";
import TPagination from "@/components/TPagination";

export default {
  name: "TComment",
  filters: {
    dateTime,
  },
  components: {
    TPagination,
  },
  props: ["listName"],
  data() {
    return {
      comments: {},
    };
  },

  computed: {
    card() {
      let data = this.$store.getters["card/getCard"](this.$route.params.cardId)
      console.log("data========",data);
      return data;
    },
    currentListName() {
      if (this.listName) {
        localStorage.setItem("listTitle", this.listName);
        return this.listName;
      }
      return localStorage.getItem("listTitle");
    },
    user() {
      console.log("route", this.$route);
      return this.$store.state.user.userInfo;
    },
    server() {
      return this.$store.state.server;
    },
  },

  created() {
    this.getComments();
  },

  methods: {
    async getComments(page = 1) {
      let rs = await this.$store.dispatch("comment/getComments", {
        boardListCardId: this.$route.params.cardId,
        page,
      });

      this.comments = rs.data;
    },

    async postNewComment() {
      let { value } = this.$refs.content;

      if (value.trim() !== "") {
        await this.$store.dispatch("comment/postComment", {
          boardListCardId: this.$route.params.cardId,
          content: value,
        });

        this.$message.success("评论成功");

        await this.getComments();
      }
      this.$refs.content.value = "";
      this.$refs.content.focus();
    },

    async changePage(page) {
      await this.getComments(page);
    },
    async uploadAttachment() {
      let file = this.$refs.attachment.files[0];
      await this.$store.dispatch("card/uploadAttachment", {
        boardListCardId: this.card.id,
        file,
      });

      this.$refs.attachment.value = "";
      this.$message.success("上传成功");
    },
  },
};
</script>