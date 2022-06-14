<template>
  <main class="my-3">
    <b-container>
      <b-row>
        <b-col>
          <Annotator/>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { Vue } from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Annotator from '~/components/Annotator.vue';

export default {
  components: {
    BootstrapVue,
    BootstrapVueIcons,
    Annotator,
  },
};
</script>

<style scoped>
main {
  /* take all the vertical space available without any scroll when posible (substract header and footer height including margin) */
  min-height: calc(100vh - 154px);
}
</style>
