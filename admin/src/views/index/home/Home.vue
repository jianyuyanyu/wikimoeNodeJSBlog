<template>
  <div class="common-right-panel-form">
    <template v-if="data">
      <div class="pb20">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <div class="el-descriptions__header">
          <div class="el-descriptions__title">站点统计</div>
          <div class="el-descriptions__extra"></div>
        </div>
        <el-row>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic title="博文数量" :value="data.postCount.blogCount" />
          </el-col>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic title="推文数量" :value="data.postCount.tweetCount" />
          </el-col>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic title="页面数量" :value="data.postCount.pageCount" />
          </el-col>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic title="评论数" :value="data.commentCount">
              <template #suffix
                ><span v-if="data.unAuditCommentCount > 0"
                  >(<span class="pointer cRed" @click="goCommentAudit">{{
                    data.unAuditCommentCount
                  }}</span
                  >)</span
                ></template
              >
            </el-statistic>
          </el-col>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic
              title="文章阅读数"
              :value="data.postCount.totalViews"
            />
          </el-col>
          <el-col :span="8" :xs="12" class="mb15">
            <el-statistic
              title="文章点赞数"
              :value="data.postCount.totalLikes"
            />
          </el-col>
        </el-row>
        <el-divider />
      </div>
    </template>
    <!-- 访客统计 -->
    <div>
      <div class="el-descriptions__header">
        <div class="el-descriptions__title">访客统计</div>
        <div class="el-descriptions__extra">
          <el-select
            v-model="timeRangeType"
            placeholder="请选择时间范围"
            @change="getDashboardVisitor"
            style="width: 120px"
          >
            <el-option
              v-for="item in timeRangeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-row v-if="visitorData">
        <!-- PV -->
        <el-col :span="24">
          <el-statistic title="PV" :value="visitorData.pvCount" />
          <div class="home-chart-body" v-if="pvCartData.labels.length > 0">
            <Line :data="pvCartData" :options="chartOptions" />
          </div>
        </el-col>
        <!-- IP -->
        <el-col :span="24">
          <el-statistic title="IP" :value="visitorData.uniqueIPCount" />
          <div
            class="home-chart-body"
            v-if="uniqueIPTimeLineData.labels.length > 0"
          >
            <Line :data="uniqueIPTimeLineData" :options="chartOptions"></Line>
          </div>
        </el-col>
        <!-- 机器人访问 -->
        <el-col :span="24">
          <el-statistic
            title="机器人访问"
            :value="visitorData.robotAccessCount"
          />
          <div class="home-chart-body" v-if="robotAccessData.labels.length > 0">
            <Line :data="robotAccessData" :options="chartOptions"></Line>
          </div>
        </el-col>
      </el-row>
      <el-divider />
    </div>
    <Statistics />
    <el-divider />
    <el-descriptions title="服务器信息" v-if="data">
      <el-descriptions-item label="NodeJs版本">{{
        data.nodeVersion
      }}</el-descriptions-item>
      <el-descriptions-item label="JSON大小限制">{{
        data.jsonLimit
      }}</el-descriptions-item>
      <el-descriptions-item label="URL编码大小限制">{{
        data.urlencodedLimit
      }}</el-descriptions-item>
      <!-- platform,
      release,
      hostname,
      cpu,
      memory,
      arch,
      uptime -->

      <el-descriptions-item label="操作系统">{{
        data.platform
      }}</el-descriptions-item>
      <el-descriptions-item label="操作系统版本">{{
        data.release
      }}</el-descriptions-item>
      <el-descriptions-item label="主机名">{{
        data.hostname
      }}</el-descriptions-item>
      <el-descriptions-item label="CPU">{{ data.cpu }}</el-descriptions-item>
      <el-descriptions-item label="内存">{{
        data.memory
      }}</el-descriptions-item>
      <el-descriptions-item label="架构">{{ data.arch }}</el-descriptions-item>
      <el-descriptions-item label="运行时间">{{
        data.uptime
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
import { onMounted, reactive, ref, computed } from 'vue'
import moment from 'moment'
import store from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import Statistics from '@/components/Statistics.vue'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
)
moment.locale('zh-cn')

export default {
  components: {
    Line,
    Statistics,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const data = ref(null)

    const getDashboard = () => {
      authApi.getDashboard().then((res) => {
        const resData = res.data.data
        // 将内存转换为MB
        resData.memory = (resData.memory / 1024 / 1024).toFixed(2) + 'MB'
        // 将运行时间转换为天/小时/分钟/秒
        const uptime = resData.uptime
        const days = Math.floor(uptime / 86400)
        const hours = Math.floor((uptime % 86400) / 3600)
        const minutes = Math.floor(((uptime % 86400) % 3600) / 60)
        const seconds = Math.floor(((uptime % 86400) % 3600) % 60)
        resData.uptime = `${days}天${hours}小时${minutes}分钟${seconds}秒`
        data.value = res.data.data
      })
    }

    // 去评论审核页面
    const goCommentAudit = () => {
      sessionStorage.setItem(
        'CommentList',
        '{"page":1,"size":50,"keyword":"","status":0}'
      )
      router.push({
        name: 'CommentList',
      })
    }

    const timeRangeTypeList = [
      { value: 'today', label: '今天' },
      { value: 'yesterday', label: '昨天' },
      { value: 'week', label: '本周' },
      { value: 'month', label: '本月' },
      { value: 'year', label: '过去一年' },
    ]
    const timeRangeType = ref('today')
    const visitorData = ref(null)
    const getDashboardVisitor = () => {
      authApi
        .getDashboardVisitor({
          timeRangeType: timeRangeType.value,
        })
        .then((res) => {
          visitorData.value = res.data
        })
    }

    // chart
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
            precision: 0,
            stepSize: 1,
          },
        },
        x: {
          ticks: {
            // 禁止倾斜
            maxRotation: 0,
            // display: false,
          },
        },
      },
    }
    const pvCartData = computed(() => {
      if (visitorData.value) {
        let data = visitorData.value.pv
        // data的ID格式是2024-01-13T08:00:00.000Z 按照这个时间字符串排序
        data = data.sort((a, b) => {
          return a._id > b._id ? 1 : -1
        })
        const labels = []
        const values = []
        data.forEach((item) => {
          // _id 为日期 2024-01-13T07:00:00.000Z
          let f = moment(item._id).format('YYYY/MM/DD dddd HH:mm')
          // 空格换行
          f = f.split(' ')
          labels.push(f)
          values.push(item.count)
        })
        return {
          labels,
          datasets: [
            {
              label: 'PV',
              data: values,
              borderColor: '#409EFF',
            },
          ],
        }
      }
      return {}
    })
    const uniqueIPTimeLineData = computed(() => {
      if (visitorData.value) {
        let data = visitorData.value.uniqueIPTimeLine
        // data的ID格式是2024-01-13T08:00:00.000Z 按照这个时间字符串排序
        data = data.sort((a, b) => {
          return a._id > b._id ? 1 : -1
        })
        const labels = []
        const values = []
        data.forEach((item) => {
          // _id 为日期 2024-01-13T07:00:00.000Z
          let f = moment(item._id).format('YYYY/MM/DD dddd HH:mm')
          // 空格换行
          f = f.split(' ')
          labels.push(f)
          values.push(item.count)
        })
        return {
          labels,
          datasets: [
            {
              label: 'IP',
              data: values,
              borderColor: '#409EFF',
            },
          ],
        }
      }
      return {}
    })
    const robotAccessData = computed(() => {
      if (visitorData.value) {
        let data = visitorData.value.robotAccess
        // data的ID格式是2024-01-13T08:00:00.000Z 按照这个时间字符串排序
        data = data.sort((a, b) => {
          return a._id > b._id ? 1 : -1
        })
        const labels = []
        const values = []
        data.forEach((item) => {
          // _id 为日期 2024-01-13T07:00:00.000Z
          let f = moment(item._id).format('YYYY/MM/DD dddd HH:mm')
          // 空格换行
          f = f.split(' ')
          labels.push(f)
          values.push(item.count)
        })
        return {
          labels,
          datasets: [
            {
              label: '机器人访问',
              data: values,
              borderColor: '#409EFF',
            },
          ],
        }
      }
      return {}
    })

    onMounted(() => {
      getDashboard()
      getDashboardVisitor()
    })

    return {
      data,
      goCommentAudit,
      timeRangeTypeList,
      timeRangeType,
      visitorData,
      getDashboardVisitor,
      chartOptions,
      pvCartData,
      uniqueIPTimeLineData,
      robotAccessData,
    }
  },
}
</script>
<style scoped>
.home-chart-body {
  margin-top: 20px;
  width: 100%;
  height: 35vh;
  box-sizing: border-box;
  padding: 5px;
  margin-bottom: 14px;
}
</style>
