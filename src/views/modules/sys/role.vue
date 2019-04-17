<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="listQuery.roleName" size="mini" placeholder="角色名称" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" size="mini" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" :disabled="dataListSelections.length <= 0" type="danger" size="mini" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"/>
      <el-table-column
        prop="roleId"
        header-align="center"
        align="center"
        width="80"
        label="ID"/>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="text" size="mini" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="text-align: center;"
      @pagination="getDataList"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update'
import Pagination from '@/components/Pagination'
export default {
  components: {
    AddOrUpdate,
    Pagination
  },
  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        roleName: ''
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
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
        url: this.$http.adornUrl('/sys/role/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.listQuery.page,
          'limit': this.listQuery.limit,
          'roleName': this.listQuery.roleName
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
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/role/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(data => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
