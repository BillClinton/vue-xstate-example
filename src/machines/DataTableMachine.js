import { assign, createMachine, interpret } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "@/machines/logTransition.js";
import { DeleteMachine } from "@/machines/DeleteMachine.js";

const DataTableMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVAVVAjANmALKoDGAFgJYB2YAdJRIQMQCSAcq1gNoAMAuolAAHAPaxK6SqOpCQAD0QBaACwBWABx0ATLu0aAzL20qAnCt5qA7ABoQAT2UqVBugfcGzANm2eVARm0AXyC7NEwcAmIyKlo6ACcwVAh7ZgBlAFEAGQyAYR4BOTEJKRk5RQQlH1cNWtN-UyteYwM1fztHSrVTOisNFSsjQNMvev8QsIxsPEISChp6ROTU5AzMnPy+QSQQYslpWR2Kqvc6DT61Xi8Ake01bQ7EA206LzevDTUzfSttK38vBMQOFplE5rFFkkUsxcgB5dgAMVYAHEAKoAJQyWyK4n2ZSOygaL0CZn8Vl+vH61kelRcKh02nq5187w0liBIMisxiCwSUNScMRKIxWP82xEuNKh1AxwavDOKm0VxMnlMagMpgMNKU7nlnmMVnMbysHzVHKmXOi8ziS2hWVhAEFkNidnspeUnCovAr-GzKbx-IHNWptQ0tOZnCMDKNNBdzREZlaIXzlsxVjksFjCq7JQcPZVGd7FV5PF51QYyX1tV5-HRjKMK6XLlcrPHQdzrfR8KJkjQoMwIDJ6DQAG6iADWXZ7EBdEpKeYJXQ0LzL6n0HmeGtDpi0zkjJZj50+bct4N53d71H7YHi8VE8TownwGAAZveALZ0C8z7NzvHShRlGeItnn0T4vTVVpt13Pco0PONQmBC1EzPOIIDAQgpCvAchwYagx0nOh0MwsBZ12XN8RlICrjcP4DF+e5DXJSwaRMOgXCGBoKyVDQ1WCRDORQnk0IwsAsOvW970fZ90DfeJP2IsTSN-cj50owDKiMNRXi8XhfkDCx-DUMtQ29FUAWMq5+l8EYQkQ6hRHQ+AdkEsFhLAHE1IA459LoQMNECP4AX8A1tXVeVDHcS4zCaXwVBPITOwYJgPJzLz8yqQY-N9QL-hrUKHCcQI6GbANTEZfpWhLBK3KS21Oj-d1F1UdQfT9NlAy4kNCsqQNtOXEs+M8aNzhqjtk2-PtPP-DLLlrPRmj6HxalsHqdQCNwPEVAwAu0MtWwE5DauTRTxOmpqqN6vS6zuEZrCMd5jOrbSrgCPTAnJALATsoA */
    id: "DataTableMachine",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      selected: [],
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
          SELECT: {
            actions: "select",
          },
          DESELECT: {
            actions: "deselect",
          },
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
          LOAD: {
            target: "loading",
          },
          DELETE: {
            target: "deleting",
          },
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

      deleting: {
        entry: assign({
          selected: (_, evt) => [evt.item],
        }),
        invoke: {
          id: "delete",
          src: DeleteMachine,
          data: {
            store: (ctx) => ctx.store,
            item: (_, evt) => evt.item,
          },
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
      select: assign({
        selected: (_, evt) => [evt.item],
      }),
      deselect: assign({
        selected: [],
      }),
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
const service = interpret(DataTableMachine).onTransition(logTransition).start;

// Create a custom service hook for this machine.
export const useDataTableMachine = () => useActor(service);
