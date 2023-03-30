import { defineStore } from "pinia";
import axios from "axios";

export const usePostStore = defineStore("post", {
  state: () => ({
    data: [],
    total: 0,
    host: "https://jsonplaceholder.typicode.com",
    path: "/posts",
    limit: 20,
    start: 0,
  }),
  actions: {
    load() {
      const me = this;

      let url = `${me.host}${me.path}`;

      if (me.limit > 0) {
        url += `?_limit=${me.limit}&_start=${me.start}`;
      }

      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then((response) => {
            this.data = response.data;
            this.total = parseInt(response.headers["x-total-count"]);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setLimit: function (limit) {
      this.limit = limit;
    },
    setStart: function (start) {
      this.start = start;
    },
  },
});
