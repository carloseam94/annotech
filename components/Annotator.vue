<template>
  <div class="annotator-region">
    <b-row>
      <b-col>
        <h3>Text</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div id="annotator-box">{{text}}</div>
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
            recogito: null,
            text: "Lorem ipsum dolor sit amet. Qui sapiente tenetur in neque illum aut vitae impedit aut nostrum omnis. Quibusdam esse et facilis velit est dolorum illo aut obcaecati odit. Hic commodi dolores et quod doloremque est temporibus esse id voluptatem minus quo architecto et ipsa soluta.\nEa eligendi tempore eos harum fuga aut voluptates tenetur in autem debitis ut commodi commodi aut quas eaque! Et animi consectetur ab accusantium debitis in voluptas accusamus et vero eveniet ut quia dolores non minima magnam et magni voluptas. Vel molestiae vero et quia dolores sed recusandae fuga. Non libero consequuntur sit incidunt quasi sed aperiam omnis qui laboriosam est consequatur architecto.\nQui optio possimus est debitis quisquam et officiis assumenda et eaque consectetur. At internos voluptates est repellendus voluptas non perferendis minima. Et autem quis est quia incidunt ab quis rerum et odio doloremque et velit veniam iste distinctio aut molestiae veniam. Aut omnis quaerat aut illo obcaecati vel iusto voluptatem aut porro aperiam sit pariatur quaerat qui adipisci voluptatem!"
        }
    },
    methods: {
        exportJSON() {
            console.log(this.text);
        }
    },
    mounted() {
      const Recogito = require("@recogito/recogito-js");
      this.recogito = Recogito.init({
        content: document.getElementById("annotator-box")
      });
    },
};
</script>
<style>
@import url("@recogito/recogito-js/dist/recogito.min.css");
#annotator-box {
  white-space: pre-wrap;
}
</style>