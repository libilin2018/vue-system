<template>
  <div class="app-container">
    <div class="header">
      <h3>公告板</h3>
      <el-button class="btn" type="primary" @click="dialogFormVisible = true">发布公告</el-button>
    </div>
    <div class="notices">
      <el-timeline v-if="list.length">
        <el-timeline-item
          v-for="(item, index) in list"
          :key="index"
          :timestamp="item.time"
          placement="top"
        >
          <el-card>
            <h4>{{ item.content }}</h4>
            <div class="info">
              <p>发布者: {{ item.publisher }}</p>
              <p>{{ item.reader.length }}人已读</p>
              <p class="deleteBtn" @click="handleDelNotice(item._id)">删除</p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div v-else>暂无公告</div>
    </div>
    <el-dialog title="发布公告" :visible.sync="dialogFormVisible">
      <el-input
        v-model="inputContent"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePublish">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNotices, publishNotice, deleteNotice } from '@/api/notice'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      list: [],
      inputContent: '',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getNotices().then(res => {
        this.list = res.message
      })
    },
    handlePublish() {
      const content = this.inputContent
      if (!content) {
        this.$message({ message: '内容不能为空！' })
        return
      }
      const publisher = localStorage.getItem('username')
      const time = parseTime(new Date().getTime())
      publishNotice({ time, publisher, content }).then(res => {
        this.$message({ type: 'success', message: '发布成功!' })
        this.init()
        this.dialogFormVisible = false
      })
    },
    handleDelNotice(id) {
      this.$confirm('确定删除该公告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteNotice({ id }).then(res => {
          this.init()
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  $width: 70%;
  .notices >>> .el-timeline-item__content {
    width: $width;
  }
  .header {
    width: $width;
    display: flex;
    line-height: .2;
    justify-content: space-between;
    padding: 0 0 10px 40px;
    box-sizing: border-box;
  }
  .info {
    display: flex;
    & > p {
      padding-right: 20px;
      color: #999;
      font-size: 13px;
    }
    .deleteBtn {
      cursor: pointer;
    }
  }
</style>

