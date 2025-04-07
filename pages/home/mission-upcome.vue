<template>
  <div v-show="!isShowDetail">
    <div class="mission-search">
      <div class="search-box">
        <el-input
          v-model="searchObj.name"
          clearable
          maxlength="30"
          placeholder="输入任务名称查询"
          @clear="handleSearch"
          @keydown.enter="handleSearch"
        />
        <el-button
          plain
          color="#306edd"
          @click="handleSearch"
        >
          查询
        </el-button>
      </div>
    </div>
    <div class="mission-list">
      <HomeMissionUpcome
        v-for="mission in upcomeMissionList"
        :key="mission.id"
        :mission="mission"
        @detail="handleDetail"
      />
    </div>
    <div class="mission-pager">
      <HomeMissionListPager
        v-model="pager"
        @change="pagerChange"
      />
    </div>
  </div>
  <template v-if="isShowDetail">
    <HomeMissionDetail
      :mission="detailData"
      @close="closeDetail"
    />
  </template>
</template>

<script setup lang="ts">
import type { Mission } from '@/types/models/mission';

const emits = defineEmits<{
  scrollParentPage: [];
}>();

const isShowDetail = ref(false);
const detailData = ref<Mission>();
function handleDetail(mission: Mission) {
  detailData.value = mission;
  isShowDetail.value = true;
  emits('scrollParentPage');
}
function closeDetail() {
  isShowDetail.value = false;
  emits('scrollParentPage');
}

const searchObj = ref<Partial<Mission>>({});
function handleSearch() {
  pager.value.currentPage = 1;
  getUpcomeMission();
  emits('scrollParentPage');
}

const pager = ref<ElcomPaginationPager>({
  total: 0,
  pageSize: 18,
  currentPage: 1
});
function pagerChange() {
  getUpcomeMission();
  emits('scrollParentPage');
}

const upcomeMissionList = ref<Array<Mission>>([]);
function getUpcomeMission() {
  const queryParams: ApiPageQuery<Mission> = {
    current: pager.value.currentPage,
    size: pager.value.pageSize,
    ...searchObj.value
  };
  $request<ApiPageList<Mission>>({
    url: '/api/service/mission/upcome',
    method: 'GET',
    params: queryParams
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && data) {
      upcomeMissionList.value = data.list;
      pager.value.total = data.total;
    }
  });
}

onMounted(() => {
  getUpcomeMission();
});
</script>

<style lang="scss" scoped>
.mission-search {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: #e0e0e0 solid 1px;
  position: sticky;
  top: 0;
  .search-box {
    padding: 0 8px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    .el-input {
      width: 300px;
    }
    .el-button {
      height: 31px;
      margin-left: 12px;
    }
  }
}
.mission-list {
  margin: 20px auto;
  display: grid;
  grid-gap: 16px;
}
.mission-pager {
  width: 100%;
}
@media (max-width: 856px) {
  .search-box,
  .mission-list {
    width: 400px;
  }
}
@media (min-width: 857px) and (max-width: 1272px) {
  .search-box,
  .mission-list {
    width: 816px;
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1273px) {
  .search-box,
  .mission-list {
    width: 1232px;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
