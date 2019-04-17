<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    title="日志列表"
    width="75%">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="listQuery.id" size="mini" placeholder="任务ID" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      height="460"
      style="width: 100%;">
      <el-table-column
        prop="logId"
        header-align="center"
        align="center"
        width="80"
        label="日志ID"/>
      <el-table-column
        prop="jobId"
        header-align="center"
        align="center"
        width="80"
        label="任务ID"/>
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        label="bean名称"/>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        label="参数"/>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag v-else size="small" type="danger" style="cursor: pointer;" @click.native="showErrorInfo(scope.row.logId)">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="times"
        header-align="center"
        align="center"
        label="耗时(单位: 毫秒)"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="执行时间"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="text-align: center;"
      @pagination="getDataList"
    />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      visible: false,
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        id: ''
      },
      dataListLoading: false
    }
  },
  methods: {
    init() {
      this.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/scheduleLog/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.listQuery.page,
          'limit': this.listQuery.limit,
          'jobId': this.listQuery.id
        })
      }).then(data => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.total = data.page.totalCount
          this.listQuery.page = data.page.currPage
          this.listQuery.limit = data.page.pageSize
        }
        this.dataListLoading = false
      })
    },
    // 失败信息
    showErrorInfo(id) {
      this.$http({
        url: this.$http.adornUrl(`/sys/scheduleLog/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(data => {
        if (data && data.code === 0) {
          this.$alert(data.log.error)
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
