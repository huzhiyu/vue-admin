<template>
  <div class="menu-2">
    <el-alert :closable="false" :title="content" effect="dark" type="info"/>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component({})
  export default class Menu2 extends Vue {
    content = "菜单 2-2";
  };
</script>
