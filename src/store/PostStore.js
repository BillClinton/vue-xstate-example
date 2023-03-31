import { defineStore } from "pinia";
import axios from "axios";

export const usePostStore = defineStore("post", {
  state: () => ({
    data: [],
    total: 0,
    host: "https://jsonplaceholder.typicode.com",
    path: "/posts",
    limit: 25,
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
            me.data = response.data;
            me.total = parseInt(response.headers["x-total-count"]);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    create(post) {
      const me = this;

      let url = `${me.host}${me.path}`;

      return new Promise((resolve, reject) => {
        axios
          .post(`${url}`, {
            data: [post],
          })
          .then((response) => {
            console.log(response);
            me.data.unshift(
              Object.assign(post, { id: response.data.id }, post)
            );
            me.total--;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    destroy(ID) {
      const me = this;

      let url = `${me.host}${me.path}`;

      return new Promise((resolve, reject) => {
        axios
          .delete(`${url}/${ID}`)
          .then((response) => {
            me.data = me.data.filter((rec) => rec.id !== ID);
            me.total--;
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
