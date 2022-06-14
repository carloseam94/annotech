<template>
  <div class="annotator-region">
    <b-row>
      <b-col>
        <h3>Text</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-textarea
          id="textarea"
          v-model="text"
          placeholder="Enter something..."
          rows="10"
          max-rows="20"
        ></b-form-textarea>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right mt-3">
        <b-button variant="dark" @click="exportJSON">Export JSON</b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
    data() {
        return {
            text: ""
        }
    },
    methods: {
        exportJSON() {
            console.log(this.text);
        }
    },
};
</script>