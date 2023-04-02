<template>
  <v-col cols="3">
    <h1>vue-xstate-example</h1>
  </v-col>

  <v-col cols="6">
    <span class="text-caption-5"
      >Using "posts" api from
      <a target="_new" href="https://jsonplaceholder.typicode.com"
        >https://jsonplaceholder.typicode.com</a
      ></span
    >
  </v-col>

  <v-col cols="3" class="text-right">
    <!-- Add Post button -->
    <v-btn
      icon="mdi-plus"
      size="small"
      color="primary"
      @click="send({ type: 'ADD' })"
    />
  </v-col>
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
  setup() {
    const { send } = useDataTableMachine();

    return {
      send,
    };
  },
};
</script>
