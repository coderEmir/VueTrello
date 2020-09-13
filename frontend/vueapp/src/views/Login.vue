<template>
  <div id="register-login">
    <a class="logo" href="/"></a>

    <div class="section-wrapper">
      <div class="account-form">
        <h1>登录到 Trello</h1>
        <form id="register-form" method="POST" @submit.prevent="loginSubmit">
          <div>
            <label>
              <input
                v-model="user.name"
                class="form-field"
                autofocus="autofocus"
                placeholder="输入用户名"
              />
            </label>
          </div>
          <div>
            <label>
              <input v-model="user.password" type="password" class="form-field" placeholder="输入密码" />
            </label>
          </div>
          <div>
            <input type="submit" class="btn btn-success" value="登录" @submit.prevent="loginSubmit"/>
            <span class="signin-signup-separator">或者</span>
            <input type="button" class="btn" value="注册" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            user: {
                name:"",
                password: "",
            }
        }
    },
    methods: {
        async loginSubmit() {
            if (this.user.name.trim() === "" || this.user.password.trim() === "") {
                this.$message.error("用户名或密码不能为空")
                return;
            }
            try {
                console.log("loginSubmit");
                await this.$store.dispatch('user/login', {...this.user})
                this.$message.success("登录成功！")
                this.$router.push({name: "Home"})

            } catch (error) {
                console.log("error====",error);
            }
        }
    },
}
</script>

<style lang="scss" scoped>
</style>