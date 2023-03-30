import { assign, createMachine, interpret } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";
// import DeleteMachine from "@/components/machines/DeleteMachine.js";

const DataTableMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVAVVAjANmALKoDGAFgJYB2YAdJRIQMQCSAcq1gNoAMAuolAAHAPaxK6SqOpCQAD0QBaAMwA2ABx1eO3moAsG-QE4NAVhVmANCACeygEz7edNW4MBGB5csezagF8AmzRMHAJiMipaOgAnMFQIW2YAYQB5dgAxVgBxAFUAJQBRPkEkEDEJKRk5RQQlD14POmNeBzVjYzN9MwB2Mw01aztHFWb-J16NI3Mp-SCQjGw8QhIKGnp4xOT0rNzCko8ykXFJaVlyuoadVw9TfX0HM1M3aZt7eq9e117LXsapmpesYHL0FiBQssImtopsEklmAAZNIAQWQpTklTONUuyksaluXQ07XavBU3neiBUdF6DjpXia5kZvDBwQhS3CqyiGzi8OSyCKiKKWBKAkxp2qF1AdWpZjlanJZg8ah0GhBv0pCGVBLUHj1hn1ZlBKnBkM5kXWMXwokSNCgzAgMnoNAAbqIANb0a2JDHlLGS2rKEwOOj6cljJoDbwdFSa-R0On0hyMszM4ymjkrC2wujeiB25hgWKxUSxOjCfAYABmpYAtrmbRBfScqudA-VownGiyyf9BgY4wnEwyPEzR7x0+DqKIIHA5GaszCNuLWzjpcoFS41c9eD19I0-GpNaoHFptQZQbxulehhmwovuTFGIQV9ipQplFG6NvWnuD-5j2TYxvxUUDGmMRoVB6YxWUWe9oUfOFtlfANcXqSwzEJKM1FJcNNUGb9nDGMYLFpCdAjZBcEMtL1GztFC2zQpR9xcToYLVTRemBTpYxGT4VC0dwFRUHiPF6FUzDvKEuRouhZ0IKRqCgBi1w-LVUyHbwNCmJ4vGMXiPmVTDdX1DRDWNIIgiAA */
    id: "DataTableMachine",
    initial: "idle",
    context: {
      logTransition: true,
    },
    states: {
      idle: {
        on: {
          INIT: {
            actions: "initialize",
            target: "loading",
          },
        },
      },
      ready: {
        on: {
          CONFIGURE: [
            {
              cond: "pageUpdateRequested",
              actions: "setPage",
              target: "loading",
            },
            {
              cond: "limitUpdateRequested",
              actions: "setLimit",
              target: "loading",
            },
          ],
          LOAD: "loading",
        },
      },

      loading: {
        invoke: {
          id: "load",
          src: "loadStore",
          onDone: "ready",
          onError: "ready",
        },
      },
    },
  },
  {
    actions: {
      initialize: assign({
        store: (_, evt) => evt.store,
      }),

      setPage: (ctx, evt) => {
        ctx.store.setStart((evt.page - 1) * ctx.store.limit);
      },
    },
    services: {
      loadStore: (ctx) => ctx.store.load,
    },
    guards: {
      pageUpdateRequested: (_, evt) =>
        Object.prototype.hasOwnProperty.call(evt, "page"),
      limitUpdateRequested: (_, evt) =>
        Object.prototype.hasOwnProperty.call(evt, "limit"),
    },
  }
);

// Create a service
const service = interpret(DataTableMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine.
export const useDataTableMachine = () => useActor(service);
