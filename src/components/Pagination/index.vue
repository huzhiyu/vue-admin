<template>
  <el-pagination :background="true"
                 :current-page="pageInfo.currentPage"
                 :layout="layout"
                 :page-sizes="pageSizes"
                 :style="{ 'text-align': position }"
                 :total="pageInfo.total"
                 @current-change="onCurrentChange"
                 @size-change="onSizeChange"
                 v-if="pageInfo.total"/>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /** 分页器组件数据类型 */
  export interface PageInfoType {
    /** 一页多少条 */
    pageSize: number
    /** 当前页 */
    currentPage: number
    /** 后端返回的总数 */
    total: number
  }

  /** 分页器组件`change`回调类型 */
  export interface PaginationChange {
    type: "pageSize" | "currentPage",
    value: number
  }

  export const usePageInfo = (size = 10): PageInfoType => {
    return {
      currentPage: 1,
      pageSize: size,
      total: 0,
    }
  };

  /** 分页组件 */
  @Component({})
  export default class Pagination extends Vue {
    @Prop({
      type: Object,
      default: () => usePageInfo()
    })
    pageInfo!: PageInfoType;

    @Prop({
      type: Array,
      default: () => [10, 30, 100, 200, 300]
    })
    pageSizes!: Array<number>;

    @Prop({
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    })
    layout!: string;

    @Prop({
      type: String,
      default: "center"
    })
    position!: "left" | "right" | "center";

    onSizeChange(n: number) {
      this.pageInfo.currentPage = 1;
      this.pageInfo.pageSize = n;
      this.$emit("change", { type: "pageSize", value: n });
    };

    onCurrentChange(n: number) {
      this.pageInfo.currentPage = n;
      this.$emit("change", { type: "currentPage", value: n });
    };
  };
</script>
