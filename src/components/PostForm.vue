<template>
  <v-card class="postForm">
    <!-- Post Form -->
    <v-form ref="postform" :disabled="isDisabled">
      <v-card-title>
        <!-- Add Post form header -->
        <div v-if="parent.matches('adding')">
          <v-container>
            <v-row>
              <v-col cols="4">
                <span class="text-h5">Add Post</span>
              </v-col>
            </v-row>
          </v-container>
        </div>

        <!-- Edit Post form header -->
        <div v-if="parent.matches('editing')">
          <v-container>
            <v-row>
              <v-col>
                <span class="text-h5">Edit Post</span>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-card-title>

      <!-- Form fields -->
      <v-card-text class="pb-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="fields.title"
                label="Title *"
                :rules="titleRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="fields.body"
                label="Post *"
                :rules="bodyRules"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- Form actions footer -->
      <v-card-actions>
        <small class="ml-6">* indicates required field</small>

        <v-spacer></v-spacer>

        <!-- Create Post button -->
        <v-btn
          v-if="parent.matches('adding')"
          :disabled="isDisabled"
          color="primary"
          variant="elevated"
          rounded
          @click="send({ type: 'CREATE' })"
        >
          Create
        </v-btn>

        <!-- Update Post button -->
        <v-btn
          v-if="parent.matches('editing')"
          :disabled="isDisabled"
          color="primary"
          variant="elevated"
          rounded
          @click="send({ type: 'UPDATE' })"
        >
          Update
        </v-btn>

        <!-- Cancel form button -->
        <v-btn
          color="primary"
          variant="elevated"
          rounded
          @click="send({ type: 'CANCEL' })"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-form>
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
  mounted() {
    const form = this.$refs.postform,
      fields = this.fields;

    console.log("mounted", this.state);

    this.send({ type: "INIT", form, fields });
  },
  data() {
    return {
      fields: {
        id: null,
        userId: 99,
        title: null,
        body: null,
      },
      isDisabled: false,

      // Validation rules
      titleRules: [(v) => Boolean(v) || "Title is required"],
      bodyRules: [(v) => Boolean(v) || "Post cannot be empty"],
    };
  },
  computed: {
    machine() {
      if (this.parent.matches("adding")) {
        return this.parent.children.create;
      } else if (this.parent.matches("editing")) {
        return this.parent.children.update;
      }
      return null;
    },
    state() {
      return this.machine?.state;
    },
    send() {
      return this.machine?.send;
    },
  },
};
</script>

<style scoped>
.postForm {
  min-width: 480px;
}
button {
  margin-left: 1em;
}
</style>
