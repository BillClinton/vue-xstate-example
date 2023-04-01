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
    update(post) {
      const me = this;

      let url = `${me.host}${me.path}`;

      return new Promise((resolve, reject) => {
        axios
          .patch(`${url}/${post.id}`, {
            data: [post],
          })
          .then((response) => {
            // find index of returned record in current data array
            const idx = me.data.findIndex((rec) => rec.id === response.data.id);
            if (idx > -1) {
              me.data[idx] = response.data.data[0];
            }
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    destroy(id) {
      const me = this;

      let url = `${me.host}${me.path}`;

      return new Promise((resolve, reject) => {
        axios
          .delete(`${url}/${id}`)
          .then((response) => {
            me.data = me.data.filter((rec) => rec.id !== id);
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
