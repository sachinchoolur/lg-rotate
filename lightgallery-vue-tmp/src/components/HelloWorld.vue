<template>
  <div ref="container" class="lightgallery-vue"><slot></slot></div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Options, Vue } from 'vue-class-component';
import lightGallery from '../../../src';
import { LightGallery as LGPlugin } from '../../../src/lightgallery';
import { LightGallerySettings } from '../../../src/lg-settings';
import { lGEvents } from '../../../src/lg-events';

@Options({
  props: {
    settings: {
      type: Object as PropType<LightGallerySettings>,
    },
    onInit: {
      type: Function,
    },
  },
})
export default class LightGallery extends Vue {
  settings!: LightGallerySettings;

  onInit!: (instance:LGPlugin)=>void;

  LG!: LGPlugin

  mounted():void {
    this.registerEvents.call(this);
    this.LG = lightGallery(this.$refs.container as unknown as HTMLElement, { ...this.settings });
  }

  unmounted():void {
    this.LG.destroy();
  }

  /* eslint-disable */
  private getMethodName(word:string) {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
  }
  /* eslint-enable */

  private registerEvents():void {
    Object.keys(lGEvents).forEach((key:string) => {
      // console.log(lGEvents[key].split('.')[0], lGEvents[key]);
      (this.$refs.container as unknown as any)
        .addEventListener(lGEvents[key].split('.')[0], (event:CustomEvent) => {
          // console.log('*****************');
          if ((this as any)[`on${this.getMethodName(key)}`]) {
            (this as any)[`on${this.getMethodName.call(this, key)}`](event.detail);
          }
        });
    });
  }
}
</script>
