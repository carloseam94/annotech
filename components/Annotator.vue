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
          accept=".txt,.html,.json"
          placeholder="Choose a text file (.txt, .html, .json) or drop it here..."
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
          drop-placeholder="Drop file here...">
        </b-form-file>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <b-button
          variant="primary"
          size="sm"
          :disabled="showingTextArea"
          @click="showTextArea">
          Enter text manually
        </b-button>
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-col>
        <div v-show="!showingTextArea">
          <div id="annotator-box">{{ text }}</div>
          <b-row v-show="text && !showingTextArea" class="mt-5">
            <b-col class="text-right">
              <b-input-group :size="'sm'" class="mb-3 d-inline-flex">
                <b-form-input
                  placeholder="filename..."
                  id="export-filename-input">
                </b-form-input>
                <b-input-group-append>
                  <b-button
                    variant="primary"
                    size="sm"
                    @click="buildAndExportJSON(text, annotator)">
                    Export JSON
                  </b-button>
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
              <b-button
                class="mr-2"
                variant="secondary"
                size="sm"
                @click="hideTextArea">
                Cancel
              </b-button>
              <b-button
                variant="primary"
                size="sm"
                :disabled="!text"
                @click="initializeAnnotator(text)">
                Done
              </b-button>
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
      showingTextArea: false,
    };
  },
  methods: {
    //#region Annotator

    /**
    * Returns a new instance of recogito annotator for the element "annotator-box".
    *
    * @return {object} A new instance of recogito annotator.
    */
    getNewRecogito() {
      return this.recogito.init({
        content: document.getElementById("annotator-box"),
        mode: "pre",
      });
    },

    /**
    * Initialize the "annotator" field with the given text.
    * The newly created annotator is stored in "annotator" field.
    *
    * @param {string} text The body to annotate on.
    * @return {void} void
    */
    initializeAnnotator(text) {
      this.hideTextArea();
      this.text = text;
      document.getElementById("annotator-box").innerText = text;
      document.getElementById("export-filename-input").value = "";
      this.annotator = this.getNewRecogito();
    },

    /**
    * Initialize the "annotator" field with the given text and annotations.
    * The newly created annotator is stored in "annotator" field.
    * 
    * @param {object} json JSON object with originalText {string} and annotations {[annotation]}
    * @return {void} void
    */
    loadAnnotator(json) {
      this.hideTextArea();
      this.text = json.originalText;
      document.getElementById("annotator-box").innerText = json.originalText;
      document.getElementById("export-filename-input").value = "";
      this.annotator = this.getNewRecogito();
      json.annotations.forEach((ann) => {
        this.annotator.addAnnotation(ann);
      });
    },

    /**
    * Clear current annotator if exists.
    *
    * @return {void} void
    */
    destroyAnnotator() {
      if (this.annotator) {
        this.annotator.destroy();
        document.getElementById("annotator-box").innerText = "";
        this.text = null;
        this.annotator = null;
      }
    },

    //#endregion

    //#region Import/Export

    /**
    * Builds a JSON object that stores original text and annotations
    *
    * @param {string} text The body to annotate on.
    * @param {object} annotator The annotator object that contains the annotations.
    * @return {object} JSON object with originaText {string} and annotations {[annotation]}
    */
    buildJSON(text, annotator) {
      return {
        originalText: text,
        annotations: annotator.getAnnotations(),
      };
    },

    /**
    * Builds a JSON object and prepares it for download.
    *
    * @param {string} text The body to annotate on.
    * @param {object} annotator The annotator object that contains the annotations.
    * @return {void} void
    */
    buildAndExportJSON(text, annotator) {
      const json = this.buildJSON(text, annotator);
      var filename = document.getElementById("export-filename-input").value;
      this.exportJSON(JSON.stringify(json), filename);
    },

    /**
    * Downloads a json object
    *
    * @param {object} content The json to download.
    * @param {string} filename The filename to the downloaded file. "annotations" if empty.
    * @return {void} void
    */
    exportJSON(content, filename) {
      const sanitizedFilename = !filename || filename == "" ? "annotations" : filename;
      Downloader.downloadBlob(content, sanitizedFilename + ".json", "application/json;charset=utf-8;");
    },

    /**
    * Event triggered when the value of the Text file input is changed. (The user choose a new text file)
    * Initialize a new annotator with the provided text.
    *
    * @param {object} event The event corresponding to changing the value of the file input.
    * @return {void} void
    */
    changeUploadedFileText(event) {
      // case1: browse, case2: drag and drop
      var file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
      if (file) {
        this.fileJSON = null;
        this.destroyAnnotator();
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          this.initializeAnnotator(reader.result);
        };
      } else {
        this.destroyAnnotator();
      }
    },

    /**
    * Event triggered when the value of the JSON file input is changed. (The user choose a new json file)
    * Initialize a new annotator with the provided text and annotations.
    * 
    * @param {object} event The event corresponding to changing the value of the file input.
    * @return {void} void
    */
    changeUploadedFileJSON(event) {
      // case1: browse, case2: drag and drop
      var file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
      if (file) {
        this.fileText = null;
        this.destroyAnnotator();
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          this.loadAnnotator(JSON.parse(reader.result));
        };
      } else {
        this.destroyAnnotator();
      }
    },

    //#endregion 

    //#region Utils

    /**
    * Starts the "Enter manually text" mode
    *
    * @return {void} void
    */
    showTextArea() {
      this.destroyAnnotator();
      this.fileText = null;
      this.fileJSON = null;
      this.showingTextArea = true;
      this.$nextTick(() => {
        document.getElementById("textarea").focus();
      });
    },

    /**
    * Ends the "Enter manually text" mode
    *
    * @return {void} void
    */
    hideTextArea() {
      this.text = null;
      this.showingTextArea = false;
    },

    //#endregion
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

.custom-file-input.is-invalid ~ .custom-file-label {
    border-color: #6c757d;
}

.custom-file-input.is-invalid:focus ~ .custom-file-label {
    border-color: #6c757d;
    box-shadow: 0 0 0 0.2rem rgb(5 108 222 / 25%);
}

.input-group-sm {
  width: 345px;
}
</style>