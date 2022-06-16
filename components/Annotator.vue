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
        <b-button variant="primary" size="sm" :disabled="showingTextArea" @click="showTextArea">Enter text manually</b-button>
      </b-col>
      <b-col class="text-right">
        <b-button variant="primary" size="sm" :disabled="!text || showingTextArea" @click="buildAndExportJSON">Export JSON</b-button>
      </b-col>
    </b-row>
    <b-row class="my-5">
      <b-col>
        <div v-show="!showingTextArea">
          <div id="annotator-box">{{ text }}</div>
        </div>
        <div v-show="showingTextArea">
          <b-form-textarea
            id="textarea"
            v-model="text"
            placeholder="Enter something..."
            rows="10"
            max-rows="20">
          </b-form-textarea>
          <b-row>
            <b-col class="text-right">
              <b-button class="mt-3" variant="primary" size="sm" :disabled="!text" @click="initializeAnnotator">Done</b-button>
            </b-col>
          </b-row>
        </div>
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
      showingTextArea: false
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
      if(this.annotator) {
        this.annotator.destroy();
        document.getElementById("annotator-box").innerText = "";
        this.text = null;
        this.annotator = null;
      }
    },
    initializeAnnotator() {
      this.hideTextArea();
      document.getElementById("annotator-box").innerText = this.text;
      this.annotator = this.getNewRecogito();
    },
    changeUploadedFile(event) {
      if (event.target.files[0]) {
        this.destroyAnnotator();
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
    showTextArea() {
      this.destroyAnnotator();
      this.file = null;
      this.showingTextArea = true;
      this.$nextTick(() => {
        document.getElementById("textarea").focus();
      })
    },
    hideTextArea() {
      this.showingTextArea = false;
    }
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

.custom-file-label {
  cursor: pointer;
}
</style>