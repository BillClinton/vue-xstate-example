<template>
  <v-data-table-server
    v-model="selected"
    v-model:items-per-page="limit"
    fixed-header
    height="calc(100vh - 136px)"
    :headers="headers"
    :items="data"
    item-key="id"
    :items-length="total"
    :loading="state.matches('loading')"
    loading-text="Loading... Please wait"
    density="compact"
    class="elevation-1"
    @update:page="(page) => send({ type: 'CONFIGURE', page })"
    @update:items-per-page="(limit) => send({ type: 'CONFIGURE', limit })"
  >
    <!-- Item (row) template -->
    <template #item="{ item }">
      <tr
        :class="isSelected(item) ? 'selected' : ''"
        @click="send({ type: 'SELECT', item: { ...item.raw } })"
      >
        <td>{{ item.raw.id }}</td>
        <td>{{ item.raw.userId }}</td>
        <td>{{ item.raw.title }}</td>
        <td>{{ item.raw.body }}</td>
        <td>
          <v-icon
            size="small"
            class="me-2"
            @click="(evt) => send({ type: 'EDIT', evt })"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            @click="send({ type: 'DELETE', item: { ...item.raw } })"
          >
            mdi-delete
          </v-icon>
        </td>
      </tr>
    </template>

    <template #bottom>
      <v-data-table-footer
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 20, title: '20' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]"
      >
      </v-data-table-footer>
    </template>
  </v-data-table-server>

  <v-dialog v-model="isDeleting" width="auto">
    <DeleteConfirmation :machine="deleteMachine" />
  </v-dialog>
</template>

<script>
import { usePostStore } from "@/store/PostStore.js";
import { useDataTableMachine } from "@/machines/DataTableMachine.js";
import { storeToRefs } from "pinia";
import DeleteConfirmation from "@/components/DeleteConfirmation.vue";

export default {
  components: {
    DeleteConfirmation,
  },
  data() {
    return {
      headers: [
        { title: "id", align: "right", key: "id" },
        { title: "userId", align: "right", key: "userId" },
        { title: "Title", align: "start", key: "title" },
        { title: "Body", align: "start", key: "body" },
        { title: "Actions", key: "actions", sortable: false },
      ],
    };
  },
  setup() {
    const postStore = usePostStore(),
      { data, total, limit } = storeToRefs(postStore),
      { state, send } = useDataTableMachine();

    send({ type: "INIT", store: postStore });

    return {
      data,
      total,
      limit,
      state,
      send,
    };
  },
  computed: {
    selected() {
      return this.state.context.selected;
    },
    isDeleting() {
      return this.state.matches("deleting");
    },
    deleteMachine() {
      return this.state.children.delete;
    },
  },
  methods: {
    isSelected(item) {
      return this.selected.some((e) => e.id === item.value);
    },
  },
};
</script>

<style>
table {
  table-layout: fixed !important;
}
th:nth-child(1) {
  width: 64px;
}
th:nth-child(2) {
  width: 64px;
}
th:nth-child(5) {
  width: 100px;
}
td {
  white-space: nowrap;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  min-width: 0;
}
tr {
  width: 100%;
}
.selected td {
  filter: brightness(80%);
}
</style>
