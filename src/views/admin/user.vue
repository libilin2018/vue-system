<template>
  <div class="app-container">
    <h3>用户管理</h3>
    <el-table
      :data="userData"
      border
      style="width: 573px"
    >
      <el-table-column
        prop="username"
        label="账号名"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="time"
        label="创建时间"
        width="180"
        align="center"
        :formatter="cellFormate"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleLookInfo(scope.row.info)">查看</el-button>
          <el-button v-permission="['super-admin']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDeleteUser(scope.row.username)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户信息" :model="userForm" :visible.sync="dialogJobVisible1" class="dialog" width="40%">
      <img class="user-img" :src="userForm.avatar" alt="">
      <div class="user-info">
        <span class="name">{{ userForm.name }}</span>
        <span v-if="userForm.roles.includes('super-admin')" class="tag">超级管理员</span>
        <span v-if="userForm.roles.includes('admin')" class="tag">管理员</span>
        <span v-if="userForm.roles.includes('user')" class="tag">普通用户</span>
        <div class="introduction">简介：{{ userForm.introduction }}</div>
      </div>
      <div style="clear: both;"></div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogJobVisible = false">确定</el-button>
      </div> -->
    </el-dialog>
    <el-dialog title="修改用户权限" :model="userForm" :visible.sync="dialogJobVisible2" class="dialog" width="40%">
      <el-checkbox-group v-model="roleList">
        <el-checkbox label="super-admin">超级管理员</el-checkbox>
        <el-checkbox label="admin">管理员</el-checkbox>
        <el-checkbox label="user">普通用户</el-checkbox>
      </el-checkbox-group>
      <div style="clear: both;"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeUserRoles">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { userList, changeRoles, deleteUser } from '@/api/user'

export default {
  data() {
    return {
      userData: [],
      dialogJobVisible1: false,
      dialogJobVisible2: false,
      userForm: {
        roles: []
      },
      roleList: [],
      currentUser: {}
    }
  },
  computed: {
    time() {
      return formatTime(1579901105296)
    }
  },
  created() {
    this.getUserlist()
  },
  methods: {
    getUserlist() {
      const token = this.$store.getters.token
      userList({ token }).then(res => {
        this.userData = res.message
      })
    },
    handleLookInfo(info) {
      // console.log(info)
      this.userForm = info
      this.dialogJobVisible1 = true
    },
    cellFormate(row, column, cellValue, index) {
      return formatTime(cellValue)
    },
    handleEdit(user) {
      this.currentUser = user
      this.roleList = user.info.roles
      this.dialogJobVisible2 = true
    },
    handleDeleteUser(username) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ username }).then(res => {
          this.getUserlist()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeUserRoles() {
      const username = this.currentUser.username
      const roles = this.roleList
      changeRoles({ username, roles }).then(res => {
        // console.log(res)
        this.getUserlist()
        this.dialogJobVisible2 = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog {
    overflow: hidden;
    .user-img {
      float: left;
      width: 100px;
      height: 100px;
      border-radius: 50%
    }
    .user-info {
      position: relative;
      top: 20px;
      left: 30px;
      .name {
        font-size: 20px;
        font-weight: 800;
        padding-right: 10px
      }
      .introduction {
        width: 400px;
        padding: 15px 0
      }
    }
  }
</style>

