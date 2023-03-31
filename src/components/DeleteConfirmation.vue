<template>
  <v-card class="confirmationDialog">
    <v-card-title class="text-h5"> Delete Post </v-card-title>
    <v-card-text>{{ title }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="elevated"
        rounded
        :disabled="isDeleting"
        :loading="isDeleting"
        @click="send({ type: 'DESTROY' })"
      >
        Delete
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        rounded
        :disabled="isDeleting"
        @click="send({ type: 'CANCEL' })"
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
  setup() {
    const { state: parent } = useDataTableMachine();

    return {
      parent,
    };
  },
  computed: {
    title() {
      return this.state?.context.item.title;
    },
    isDeleting() {
      return this.state?.matches("destroying");
    },
    state() {
      return this.parent.children.delete?.state;
    },
    send() {
      return this.parent.children.delete?.send;
    },
  },
};
</script>

<style scoped>
.confirmationDialog {
  min-width: 360px;
}
button {
  margin-left: 1em;
}
</style>
