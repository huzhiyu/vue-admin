<template>
  <div class="the-upload-image">
    <div :style="{ 'width': width }" class="the-upload-content" v-loading="loading">
      <div class="the-upload-image-box" v-if="src">
        <img :src="src" :style="{ 'height': autoHeight ? null : height }" alt="" class="image">
        <div class="remove flex fvertical fcenter">
          <svg-icon @click="removeImg()" name="delete" v-if="!disabled"/>
        </div>
      </div>
      <div :style="{ 'height': height }" class="the-upload-box flex fvertical fcenter" v-else>
        <div class="the-upload-add-icon"></div>
        <input @change.stop="onUpload()"
               accept="image/*"
               class="the-upload-input" name="picture"
               ref="uploadinput"
               type="file"
               v-if="!disabled">
      </div>
    </div>
    <p class="the-upload-tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { uploadImg } from "@/api/common";

  /**
   * 上传图片`change`回调类型
   */
  export interface UploadChange<T = string | number> {
    /** 和当前上传组件绑定的`id` */
    id: T
    /** 图片路径 */
    src: string
  }

  /** 上传图片组件 */
  @Component({
    name: "UploadImage"
  })
  export default class UploadImage extends Vue {
    /** 组件上传图片路径 */
    @Prop({
      type: String,
      default: ""
    })
    src!: string;

    /** 组件`id` */
    @Prop({
      type: [String, Number],
      default: ""
    })
    uploadId!: UploadChange["id"];

    /** 图片宽度 */
    @Prop({
      type: String,
      default: "178px"
    })
    width!: string;

    /** 图片宽度 */
    @Prop({
      type: String,
      default: "178px"
    })
    height!: string;

    /** 是否自动高度（针对图片） */
    @Prop({
      type: Boolean,
      default: false
    })
    autoHeight!: boolean;

    /** 图片上传提示 */
    @Prop({
      type: [String, Number],
      default: ""
    })
    tip!: string;

    /** 上传图片最大体积（M） */
    @Prop({
      type: Number,
      default: 2
    })
    maxSize!: number;

    /** 是否禁用状态 */
    @Prop({
      type: Boolean,
      default: false
    })
    disabled!: boolean;

    /** 加载动画 */
    loading = false;
    $refs!: {
      /** 上传`input`标签 */
      uploadinput: HTMLInputElement
    };

    /** 发送数据到父组件中 */
    emitChange(info: UploadChange) {
      this.$emit("change", info);
    };

    /** 清除当前图片 */
    removeImg() {
      this.emitChange({
        id: this.uploadId,
        src: ""
      });
    };

    /** 上传图片 */
    async onUpload() {
      // 这样写也可以，但是命令台会报错，浏览器不会
      // const input = (this.$refs.uploadinput as HTMLInputElement);
      const input = this.$refs.uploadinput;
      const file: File = input.files![0];
      // console.log("上传图片文件 >>", file);
      // 判断大小
      if (file.size > this.maxSize * 1024 * 1024) {
        input.value = "";
        this.$message.warning(`上传的文件不能大于 ${this.maxSize}M`);
        return;
      }
      // const formData = new FormData();
      // formData.append("file", file);
      this.loading = true;
      const res = await uploadImg(file);
      this.loading = false;
      console.log("上传图片 >>", res);
      if (res.code === 1) {
        const result: string = res.data.img;
        this.emitChange({
          id: this.uploadId,
          src: result
        });
      } else {
        input.value = "";
        this.$message.error("上传图片失败");
      }
    };
  };
</script>

<style lang="scss">
  @import "../../styles/variables.scss";

  @mixin time {
    transition: 0.2s all;
  }

  .the-upload-image {
    .the-upload-content {
      background-color: transparent;
      border: 1px dashed #d9d9d9;
      border-radius: 5px;
      overflow: hidden;
      @include time();

      &:hover {
        border-color: $theme;
        background-color: #fbfdff;
      }

      .the-upload-image-box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .image {
          display: block;
          width: 100%;
        }

        .remove {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #f4f4f4;
          opacity: 0;
          @include time();

          &:hover {
            opacity: 1;
          }
        }

        .svg-icon {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
      }

      .the-upload-box {
        width: 100%;
        position: relative;

        .the-upload-input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          opacity: 0;
          cursor: pointer;
        }

        .the-upload-add-icon {
          position: relative;
          width: 30px;
          height: 30px;
          transform: rotate(-45deg);
          @include closeIcon(#999, 100%, 2px);
        }
      }
    }

    .the-upload-tip {
      font-size: 12px;
      color: $theme;
      line-height: 20px;
      padding: 6px 4px;
    }
  }
</style>
