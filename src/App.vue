<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row>
          <PostsHeader />
        </v-row>
        <v-row>
          <PostsDataTable />
        </v-row>
      </v-container>
      <ToastSnackbar />
    </v-main>
  </v-app>
</template>

<script setup>
import PostsHeader from "@/components/PostsHeader.vue";
import PostsDataTable from "@/components/PostsDataTable.vue";
import ToastSnackbar from "@/components/ToastSnackbar.vue";
</script>
