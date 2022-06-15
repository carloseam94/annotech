<template>
  <div class="annotator-region">
    <b-row>
      <b-col>
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          @change="changeUploadedFile"
          accept="text/plain"
          placeholder="Choose a file (.txt) or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div id="annotator-box">{{ text }}</div>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right mt-3">
        <b-button variant="dark" @click="buildAndExportJSON">Export JSON</b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import * as Downloader from "~/assets/js/utils.js";

export default {
  data() {
    return {
      recogito: null,
      text: "",
      file: null
    };
  },
  methods: {
    buildJSON() {
      return {
        originalText: this.text,
        annotations: this.recogito.getAnnotations(),
      };
    },
    buildAndExportJSON() {
      const json = this.buildJSON();
      this.exportJSON(JSON.stringify(json), "annotations");
    },
    exportJSON(content, filename) {
        Downloader.downloadBlob(content, filename + '.json', "application/json;charset=utf-8;");
    },
    exportCSV(content, filename) {
        utils.downloadBlob(content, fileName + '.csv', "text/csv;charset=utf-8;");
    },
    getNewRecogito() {
      const Recogito = require("@recogito/recogito-js");
      return Recogito.init({
        content: document.getElementById("annotator-box"),
      });
    },
    // setRecogitoEvents(r) {
    //   r.on("createAnnotation", function (annotation) {
    //     console.log(annotation);
    //   });
    // },
    changeUploadedFile(event) {
        var reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          this.text = reader.result;
          console.log(this.text);
          this.recogito = this.getNewRecogito();
        };
    }
  },
  mounted() {
    // this.recogito = this.getNewRecogito();
    // this.setRecogitoEvents(this.recogito);
  },
};
</script>
<style>
@import url("@recogito/recogito-js/dist/recogito.min.css");
#annotator-box {
  white-space: pre-wrap;
}
</style>