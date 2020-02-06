<template>
  <div class="app-container">
    <h3>个人资料</h3>
    <el-form v-model="infoForm" class="form" label-width="120px">
      <el-form-item label="头像">
        <img class="avatar" :src="infoForm.avatar" alt="">
        <el-upload
          action="http://up-z2.qiniup.com"
          :on-success="uploadSuccess"
          :limit="1"
          :data="postData"
          accept=".png, .jpg"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="infoForm.name" @input="handleInput"></el-input>
      </el-form-item>
      <el-form-item label="用户权限">
        <el-tooltip class="item" effect="dark" content="拥有系统最高权限，如修改用户权限" placement="top">
          <el-button :disabled="!infoForm.roles.includes('super-admin')">超级管理员</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="能管理用户和发布公告" placement="top">
          <el-button :disabled="!infoForm.roles.includes('admin')">管理员</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="仅能查看系统信息" placement="top">
          <el-button :disabled="!infoForm.roles.includes('user')">普通用户</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="个人介绍">
        <el-input v-model="infoForm.introduction" type="textarea" rows="3"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <span>{{ itemFormat(infoForm.time) }}</span>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getQnToken, changeInfo } from '@/api/user'
import { formatTime } from '@/utils/index'
export default {
  data() {
    return {
      infoForm: {
        roles: []
      },
      postData: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const info = JSON.parse(localStorage.getItem('info'))
      // console.log(info)
      this.infoForm = info
      getQnToken().then(res => {
        this.postData.token = res.message
      })
    },
    uploadSuccess(res) {
      const key = res.key
      const host = 'http://q4wwil6d1.bkt.clouddn.com/'
      const pre = '-center'
      this.infoForm.avatar = host + key + pre
    },
    handleInput() {
      // console.log(this.infoForm)
    },
    onSubmit() {
      const username = localStorage.getItem('username')
      const info = this.infoForm
      // console.log(username, info)
      changeInfo({ username, info }).then(res => {
        this.$message({ type: 'success', message: '修改成功' })
        this.$store.dispatch('user/getInfo')
        localStorage.setItem('info', JSON.stringify(info))
      })
    },
    itemFormat(time) {
      return formatTime(time)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form >>> .el-form-item__content {
    display: flex;
  }
  .form {
    width: 600px;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 6px;
      margin: 0 20px 0 0;
    }
  }
</style>
