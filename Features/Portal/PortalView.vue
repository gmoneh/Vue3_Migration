<template>
  <main>
      <h1 class="portal-title">Portal View</h1>
      <display-number :parent-num="30"/>
      <p>
          The title is {{ title }}
          <br>
          And has {{ pages }} pages
      </p>
      <please-wait />
      <show-modal />
      <page-count-editor />
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Setup } from 'vue-facing-decorator';
import { useTitleStore } from "@Store/TitleStore";
import DisplayNumber from "@Portal/Components/DisplayNumber.vue";
import ShowModal from "@Portal/Components/ShowModal.vue";
import PageCountEditor from "@Portal/Components/PageCountEditor.vue";
import PleaseWait from "@ClientApp/components/PleaseWait";

@Component({
    components: {
        DisplayNumber,
        ShowModal,
        PageCountEditor,
        PleaseWait
    }
})
export default class PortalView extends Vue {
    @Prop({type: Number, default: 10})
    parentNum!: number;

    @Setup(() => useTitleStore())
    titleStore!: ReturnType<typeof useTitleStore>;

    get title() {
        return this.titleStore.title? this.titleStore.title.title : "";
    }

    get pages() {
        return this.titleStore.title? this.titleStore.title.pageCount : 0;
    }
}

</script>

<style lang="scss">

    .portal-title {
        color: teal;
    }

    .portal-number {
        font-family: "Century Gothic";
    }
</style>