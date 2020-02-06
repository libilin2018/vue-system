<template>
  <div class="select">
    <el-select
      v-model="currentJob"
      placeholder="请选择"
      class="select-job"
      @change="handleJobChange"
    >
      <el-option
        v-for="item in jobOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getHomeData } from '@/api/visual'
import { formatSelectData } from '@/utils/index'

export default {
  name: 'SelectJob',
  data() {
    return {
      currentJob: '',
      jobOptions: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getHomeData().then(res => {
        res = res.message
        const jobs = formatSelectData(res.jobs)
        const currentJob = jobs[0].label
        this.jobOptions = jobs
        this.currentJob = currentJob
        this.$emit('draw', currentJob)
        // console.log(jobs)
      })
      // this.jobData = data
      // this.drawMap()
    },
    handleJobChange(name) {
      this.$emit('draw', name)
    }
  }
}
</script>

<style lang="scss" scoped>
// fix css style bug in open el-dialog
.select {
  padding-bottom: 10px;
}
</style>
