<template>
  <div class="green">
    <p>测试结果：{{ result }}</p>
  </div>
</template>

<script>
export default {
  name: 'Green',
  data() {
    return {
      result: false
    }
  },
  created() {
    this.getTestResult()
    setInterval(() => {
      this.getTestResult()
    }, 60000)
  },
  methods: {
    getTestResult() {
      this.$http({
        url: this.$http.adornUrl('/sys/green/test'),
        method: 'get'
      }).then(data => {
        if (data && data.code === 0) {
          this.result = true
        } else {
          this.result = false
        }
      })
    }
  }
}
</script>
