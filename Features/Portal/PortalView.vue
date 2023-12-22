<template>
  <main>
      <h1 class="portal-title">Portal View</h1>
      <display-number :parent-num="30"/>
      <p>
          The title is {{ title }}
          <br>
          And has {{ pages }} pages
      </p>
      <please-wait text="Please wait" small variant="secondary" />
      <show-modal />
      <page-count-editor />
      <div>
          <lsi-visual-link caption="Ignite Opt-In" size="lg" href="/Features/Portal/Dashboard">
              <img src="wwwroot/images/uiassets/ignite.svg"  />
          </lsi-visual-link>
          <lsi-visual-picker size="xl">
              <h3 class="mb-3">Download a QR Code</h3>
              <img class="mb-3 qr" src="wwwroot/images/uiassets/ignite.svg" /><br/>
              <div class="button-holder">
                  <b-button variant="outline-secondary" class="picker-icon" to="/Features/Portal/Dashboard"><i class="fas fa-download"></i></b-button>
              </div>
          </lsi-visual-picker>
      </div>
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

    @Inject()
    assetUrl!: (assetName: string, variant?: string) => string;

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
        color: pink;
    }

</style>