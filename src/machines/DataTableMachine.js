import { assign, createMachine, forwardTo, interpret } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "@/machines/logTransition.js";
import { useToastMachine } from "@/machines/ToastMachine.js";
import { CreateMachine } from "@/machines/CreateMachine.js";
import { UpdateMachine } from "@/machines/UpdateMachine.js";
import { DeleteMachine } from "@/machines/DeleteMachine.js";

const toaster = useToastMachine();

const DataTableMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVAVVAjANmALKoDGAFgJYB2YAxFgPICCAylgNoAMAuoqAAcA9rErpKQ6vxAAPRAFoAjFy4AWAHRqA7AA4VOgJxrFq1QBoQATwWqArF3V7lqgwCZXqrQDYtqgL5+FmiYOATEZFS0dACqAHJMbJy80sKi4pLScghKXIq26sr2erY6dq46ihbW2QDMJuo1rgZeOjVari2KWloBQRjYeIQkFDRg6pQQhHQAkrHTSXxIIKliElJLWfJeNfmFTSpcBjrHNVU2Hupatt2Kroo+zYoGvSDBA2HDkWMATmCoEJY6KwAKIAGWBAGEFikRKsMhsFIodPl3EdvMcdF5PLZzFYFK4agZ1HcvLdCV5bC0vFxXC83qEhhFRupfv9AchgSDwVDuItBLD0utQJsvK4GtS6jjGkcuG0ztkCUSSbcDDirjjrnT+gzwiNaCy-gC6BDGLEAGLTADi0QASsDeTC0mtMgo9ESDDVVDotLKuF5STT5fIarL1NdPATMd1GootSFBrqvga2cbTRbrXaOIo+csBc6EdkKjVNKo8kZMSGahSg65Dg0qwZSyYmj4uDo4+9GXqfobAaCWMgHUsVoKXdlVLXHKZG4S-TsuFcg08vJpcqoQ65vJ4DLHAq9tQnPszWUbmMhB8lh3n4cKFN13TpN0Za37lKc8YXiztKe4FyHFE8PR7vSh5MvqJ6AsCyDzEO-JOjesg2Ns6gtH6qhtli9ytFoQatA0tgEW46K1ncu59PGHxgT2KYcuCWD2pecFwkKiHZMulw4qYpRPEYBhHLhX4EaKtZaP+gEdjqR76vgQj-DQUB0BAkhjDQABuQgANZjDJ-ywbm8EsZsOxEocNSYvcpbUh4NZGAUKi2K4BHoaqtjPMBB6Ud26g6RA8l0GA3zfEI3zqAI+AYAAZsFAC23myRAekjvmt61CU6gTloTwAZlmL8R+8iOcWsp5G0nhXLcPgSaBXn-L51AKUp+pqZpYykKy6BgIl16GQoFImYYm4VLKqjbK4QY+MSLQlK5hL3IonpVZ5Sa1X5AVBSFYWRTF6htX8HVdQZY5bGlE4dPNdyEW4QY1MWtyucJnpcJSO7+O5FFdkmkCrPVinKeM1DqVp6gAK4CBAGCdYx+nMUdnorlofEdAunilN4123Y5zTuI9z0mItH3Ml94g-WtwWheF6BRd8sWg+D+1Q0lCFGSNBSNBS9y6P6hi4tUWxaJNyIEZGxzrrY+OJsyEBgIQxMNX9zVA1LMuQzmjM9dk-oFK07hCR4m5tuN-MdMiyIejupILW9nYS-qStgLL-mBWTm2U9tdv06r3VHRSYb3AR9huF4jYuOjBSYw96G469e7UEIUvwEsIFLaMjowwW8jeoomgGFcN2inxzZBrYtzEtcmUqGZ2LtlbklUeMkxgKno7p3oDiiRUWLs7kCNBuhYo0siE4tK0JQ1OLUnUQCTfJaxwbNI4zRqI+IYqI2XhLjsjgd56JHrvcXjj3XPnydPTM2A5xLeI5BGtDshLXaq6huLKpJzZl2wHzX1XLRAdVQKf6sM4EmzrnKsTQXpjQ-D6UuqpHzLj9ASMWX9k76iJifK8h104OQ0LoP0PoTAjQAvKaB4dbiGG2ISRoh8vLu3QUxZuKUCpPTDANco3osTdC9PKa4MCKGilaEiBGSCAhAA */
    id: "DataTableMachine",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      selected: [],
      logTransition: true,
    },
    // These actions can be performed in any state
    on: {
      // Toast actions forward these events to the toast machine
      TOAST: { actions: forwardTo(toaster) },
      UNTOAST: { actions: forwardTo(toaster) },
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
              cond: "pageConfig",
              actions: "setPage",
              target: "loading",
            },
            {
              cond: "limitConfig",
              actions: "setLimit",
              target: "loading",
            },
          ],

          LOAD: {
            target: "loading",
          },

          ADD: {
            target: "adding",
          },

          EDIT: {
            target: "editing",
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

      adding: {
        invoke: {
          id: "create",
          src: CreateMachine,
          data: {
            store: (ctx) => ctx.store,
          },
          onDone: "ready",
          onError: "ready",
        },
      },

      editing: {
        entry: assign({
          selected: (_, evt) => [evt.item],
        }),
        invoke: {
          id: "update",
          src: UpdateMachine,
          data: {
            store: (ctx) => ctx.store,
            item: (_, evt) => evt.item,
          },
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
      pageConfig: (_, evt) => Object.prototype.hasOwnProperty.call(evt, "page"),
      limitConfig: (_, evt) =>
        Object.prototype.hasOwnProperty.call(evt, "limit"),
    },
  }
);

// Create a service
const service = interpret(DataTableMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine.
export const useDataTableMachine = () => useActor(service);
