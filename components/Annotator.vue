<template>
  <div class="annotator-region">
    <b-row class="mt-5">
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
    <b-row class="mt-3">
      <b-col>
        <b-button variant="dark" :disabled="!file" @click="buildAndExportJSON">Export JSON</b-button>
      </b-col>
    </b-row>
    <b-row class="my-5">
      <b-col>
        <div id="annotator-box">{{ text }}</div>
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
      annotator: null,
      text: "",
      file: null,
    };
  },
  methods: {
    buildJSON() {
      return {
        originalText: this.text,
        annotations: this.annotator.getAnnotations(),
      };
    },
    buildAndExportJSON() {
      const json = this.buildJSON();
      this.exportJSON(JSON.stringify(json), "annotations");
    },
    exportJSON(content, filename) {
      Downloader.downloadBlob(
        content,
        filename + ".json",
        "application/json;charset=utf-8;"
      );
    },
    getNewRecogito() {
      return this.recogito.init({
        content: document.getElementById("annotator-box"),
        mode: "pre",
      });
    },
    destroyAnnotator() {
      this.annotator.destroy();
      document.getElementById("annotator-box").innerText = "";
      this.text = null;
      this.annotator = null;
    },
    initializeAnnotator() {
      document.getElementById("annotator-box").innerText = this.text;
      this.annotator = this.getNewRecogito();
    },
    changeUploadedFile(event) {
      if (event.target.files[0]) {
        if(this.annotator) {
          this.destroyAnnotator();
        }
        var reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          this.text = reader.result;
          this.initializeAnnotator();
        };
      } else {
        this.destroyAnnotator();
      }
    },
  },
  mounted() {
    this.recogito = require("@recogito/recogito-js");
  },
};
</script>
<style>
@import url("@recogito/recogito-js/dist/recogito.min.css");
#annotator-box {
  white-space: pre-wrap;
}
</style>