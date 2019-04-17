<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-button type="primary" size="mini" @click="configHandle()">云存储配置</el-button>
        <el-button type="primary" size="mini" @click="uploadHandle()">上传文件</el-button>
        <el-button :disabled="dataListSelections.length <= 0" type="danger" size="mini" @click="deleteHandle()">批量删除</el-button>
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
        prop="url"
        header-align="center"
        align="center"
        label="URL地址"/>
      <el-table-column
        prop="createDate"
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
    <!-- 弹窗, 云存储配置 -->
    <config v-if="configVisible" ref="config"/>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import Config from './oss-config'
import Upload from './oss-upload'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Config,
    Upload,
    Pagination
  },
  data() {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      dataListLoading: false,
      dataListSelections: [],
      configVisible: false,
      uploadVisible: false
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
        url: this.$http.adornUrl('/sys/oss/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.listQuery.page,
          'limit': this.listQuery.limit
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
    // 云存储配置
    configHandle() {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 上传文件
    uploadHandle() {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
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
          url: this.$http.adornUrl('/sys/oss/delete'),
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
