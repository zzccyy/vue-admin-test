<template>
  <div class="app-container">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="listQuery.paramKey" size="mini" placeholder="参数名" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="getDataList()">查询</el-button>
        <el-button type="primary" size="mini" @click="addOrUpdateHandle()">新增</el-button>
        <el-button :disabled="dataListSelections.length <= 0" type="danger" size="mini" @click="deleteHandle()">批量删除</el-button>
        <el-button size="mini" @click="importFile()">导入</el-button>
        <el-button size="mini" @click="getDataList()">导出</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"/>
      <el-table-column
        prop="paramKey"
        header-align="center"
        align="center"
        label="参数名"/>
      <el-table-column
        prop="paramValue"
        header-align="center"
        align="center"
        label="参数值"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 导入窗口 -->
    <import-file v-if="importVisible" ref="importFile" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import AddOrUpdate from './config-add-or-update'
import ImportFile from './config-import'
import Pagination from '@/components/Pagination'
export default {
  components: {
    AddOrUpdate,
    ImportFile,
    Pagination
  },
  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        paramKey: ''
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      importVisible: false
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
        url: this.$http.adornUrl('/sys/config/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.listQuery.page,
          'limit': this.listQuery.limit,
          'paramKey': this.listQuery.paramKey
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
    // 导入
    importFile() {
      this.importVisible = true
      this.$nextTick(() => {
        this.$refs.importFile.init()
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/config/delete'),
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
