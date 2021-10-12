<template>
  <div class="nested">
    <transition mode="out-in" name="fadeSlideX">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  @Component({})
  export default class Nested extends Vue {
    content = "nested";
  };
</script>
