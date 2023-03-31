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
import { toRef } from "vue";

export default {
  props: {
    machine: Object,
  },
  setup(props) {
    const machine = toRef(props, "machine"),
      { state, send } = machine.value;

    return {
      state,
      send,
    };
  },
  computed: {
    title() {
      return this.state.context.item.title;
    },
    isDeleting() {
      return this.state.matches("destroying");
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
