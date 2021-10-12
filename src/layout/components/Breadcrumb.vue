<template>
  <transition-group class="layout-breadcrumb flex fvertical" name="breadcrumb" tag="div">
    <span :class="['layout-breadcrumb-item', {'last': index === list.length - 1}]"
          :key="item.path"
          v-for="(item, index) in list">
        <i class="separator" v-if="index > 0">/</i>
        <a href="javascript:void(0)" v-if="index === list.length - 1">{{ item.meta.title }}</a>
        <router-link :to="item.path" v-else>{{ item.meta.title }}</router-link>
    </span>
  </transition-group>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { Route } from "vue-router";

  @Component({
    name: "Breadcrumb",
  })
  export default class Breadcrumb extends Vue {
    list: Array<{ path: string, meta: any }> = [];

    @Watch("$route")
    onRoute(route: Route) {
      // 如果转到重定向页面，就不更新面包屑
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.updateList();
    };

    updateList() {
      this.list = this.$route.matched.filter(item => item.meta && item.meta.title)
        .map(item => {
          return { path: item.path, meta: { ...item.meta } };
        });
    };

    created() {
      this.updateList();
    };
  };
</script>
