<template>
  <v-col cols="5">
    <h1>Posts</h1>
  </v-col>

  <v-col cols="7" class="text-right">
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
