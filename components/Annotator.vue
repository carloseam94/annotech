<template>
  <div class="annotator-region">
    <b-row class="mt-4">
      <b-col>
        <label for="form-file-text">Import text:</label>
        <b-form-file
          id="form-file-text"
          v-model="fileText"
          :state="Boolean(fileText)"
          @change="changeUploadedFileText"
          accept="text/plain"
          placeholder="Choose a text file (.txt, .html, .json, etc) or drop it here..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-col>
    </b-row>
    <b-row class="mt-4">
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
    <b-row class="mt-4">
      <b-col>
        <b-button variant="primary" size="sm" :disabled="showingTextArea" @click="showTextArea">Enter text manually</b-button>
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-col>
        <div v-show="!showingTextArea">
          <div id="annotator-box">{{ text }}</div>
          <b-row v-show="text && !showingTextArea" class="mt-5">
            <b-col class="text-right">
              <b-input-group
                :size="'sm'"
                class="mb-3 d-inline-flex"
                >
                <b-form-input placeholder="filename..." id="export-filename-input"></b-form-input>
                <b-input-group-append>
                  <b-button variant="primary" size="sm" @click="buildAndExportJSON">Export JSON</b-button>
                </b-input-group-append>
              </b-input-group>  
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
          <b-row class="mt-3">
            <b-col class="text-right">
              <b-button class="mr-2" variant="secondary" size="sm" @click="hideTextArea">Cancel</b-button>
              <b-button variant="primary" size="sm" :disabled="!text" @click="initializeAnnotator(text)">Done</b-button>
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
      var filename = document.getElementById("export-filename-input").value;
      this.exportJSON(JSON.stringify(json), !filename || filename == "" ? "annotations" : filename);
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
    initializeAnnotator(text) {
      this.hideTextArea();
      this.text = text;
      document.getElementById("annotator-box").innerText = text;
      document.getElementById("export-filename-input").value = "";
      this.annotator = this.getNewRecogito();
    },
    loadAnnotator(json) {
      console.log(json)
      this.hideTextArea();
      this.text = json.originalText;
      document.getElementById("annotator-box").innerText = json.originalText;
      document.getElementById("export-filename-input").value = "";
      this.annotator = this.getNewRecogito();
      json.annotations.forEach(ann => {
        this.annotator.addAnnotation(ann);
      });
    },
    changeUploadedFileText(event) {
      if (event.target.files[0]) {
        this.fileJSON = null;
        this.destroyAnnotator();
        var reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          this.initializeAnnotator(reader.result);
        };
      } else {
        this.destroyAnnotator();
      }
    },
    changeUploadedFileJSON(event) {
      if (event.target.files[0]) {
        this.fileText = null;
        this.destroyAnnotator();
        var reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = () => {
          this.loadAnnotator(JSON.parse(reader.result));
        };
      } else {
        this.destroyAnnotator();
      }
    },
    showTextArea() {
      this.destroyAnnotator();
      this.fileText = null;
      this.fileJSON = null;
      this.showingTextArea = true;
      this.$nextTick(() => {
        document.getElementById("textarea").focus();
      })
    },
    hideTextArea() {
      this.text = null;
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

.input-group-sm {
  width: 345px;
}
</style>