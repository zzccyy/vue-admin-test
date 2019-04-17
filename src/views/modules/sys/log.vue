<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="listQuery.key" size="mini" placeholder="用户名／用户操作" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"/>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"/>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="用户操作"/>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="method"
        header-align="center"
        align="center"
        width="150"
        label="请求方法"/>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="params"
        header-align="center"
        align="center"
        width="150"
        label="请求参数"/>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="执行时长(毫秒)"/>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址"/>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="text-align: center;"
      @pagination="getDataList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        key: ''
      },
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/log/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.listQuery.page,
          'limit': this.listQuery.limit,
          'key': this.listQuery.key
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
    }
  }
}
</script>
