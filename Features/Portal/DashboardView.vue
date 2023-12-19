<template>
  <main>
      <h1>Dashboard View</h1>
      <display-number :parent-num="20"/>
  </main>
</template>


<script lang="ts">
import { Vue, Component, Prop, Inject, toNative } from 'vue-facing-decorator';
import DisplayNumber from "@Portal/Components/DisplayNumber.vue";

@Component({
    components: {
        DisplayNumber
    }
})
class DashboardView extends Vue {
}

export default toNative(DashboardView)

</script>

