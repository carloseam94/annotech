<template>
  <div class="annotator-region">
    <b-row class="mt-3">
      <b-col>
        <label for="form-file-text">Import text:</label>
        <b-form-file
          id="form-file-text"
          v-model="fileText"
          :state="Boolean(fileText)"
          @change="changeUploadedFileText"
          accept="text/plain"
          placeholder="Choose a file (.txt) or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <label for="form-file-json">Import text with annotations:</label>
        <b-form-file
          id="form-file-json"
          v-model="fileJSON"
          :state="Boolean(fileJSON)"
          @change="changeUploadedFileJSON"
          accept=".json"
          placeholder="Choose a file (.json) or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button variant="primary" size="sm" :disabled="showingTextArea" @click="showTextArea">Enter text manually</b-button>
      </b-col>
    </b-row>
    <b-row class="my-5">
      <b-col>
        <div v-show="!showingTextArea">
          <div id="annotator-box">{{ text }}</div>
          <b-row v-show="text && !showingTextArea" class="mt-5">
            <b-col class="text-right">
              <b-button variant="primary" size="sm" @click="buildAndExportJSON">Export JSON</b-button>
            </b-col>
          </b-row>
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
      fileText: null,
      fileJSON: null,
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
    importJSON() {

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
    changeUploadedFileText(event) {
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
    changeUploadedFileJSON(event) {
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

.custom-file-input ~ .custom-file-label[data-browse]::after {
    display: none;
}
</style>