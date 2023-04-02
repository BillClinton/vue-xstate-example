import { assign, createMachine, sendParent } from "xstate";
import { isProxy, toRaw } from "vue";
import { cloneDeep, isEqual } from "lodash";

const UpdateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFUAOECGAXMBZDAxgBYCWAdmAHQkQA2YAxANoAMAuoqKgPawlYluZTiAAeiALQBGFgBYAzJQCcUgKwAOdavlz5U2QBoQAT0RSAbOuUsATDYDsLe6tnqZ62QF9PRtJhz4xORUkPzkUAwAMgDyAIIAIgBi0QBKuKwcSCA8fAJCIuII0iyq9pSysqpq6jbydrJyRqYINurmlHL29uYVqg6qSvZePiB+2HiEpBSUoQJkEQDCsQByCwCikRkiOWH5WYUSSnKUjkrm8pZtTvKGJojy8qrKUh42LOYu6o+q3r7o44EpiEIGF5gxkAAFeKxAAqay2WR2eWE+0k3SsXXO5nMNik3QuNiaZnMZQadkcNnOZIqv1G-wCk2ClAAbhhaDRsOEGBAhFRyMzuABrKis9n+MAIri8XYo0AHC6KNS2JytPTmKSEu4IfTtPF6FhOJxDBy0sYMoLTUUcuYRMAAJzt3DtlFQtGwADMnQBbFls60S9jbaXIgqSLEdFj6NwPNqyBxElpPDT2Sl2AaqbSlcym+kTC1UACu9K5POm-KFVFiqBIZoDmSluUEsrEZg1ynsXwulSkShsDXMCZe7TaqgNva0aYUOfFgKZRf8Jd51DIAuFlCrNdzTCk9eywaboe1akoDgNJXOpzVCdaZRcXXUJQN-Xs04BjOm885YPtjudro93rrtWtaSnujZ7HKiBuJQNywTiZxOGoA5ajYSbqCm3QNDqSiyEM3gjGQ3AQHAIi1rOFBBuBzYHBqx5tA4bgGj2GhKAmEjqs8DhYb2PbdD8Ixke+fJ0GAlEyoe0gWGU9EdjIkZKCxg4kuUtiUuYyo1Hxr7mkCMwgjaYkhqiRQ4YolR9nYjyyCS6iDgo1h2Diqg9CSLCaNpea6VaC7zIZB7Gex8hKMod43BqOgXMhzRSDoDmUlIMWyC84UeeRhbFr5iL7hBLZFNUlBVE46hHDU8joXGg6xUcdjFUlD4xalQmUKWolZVREkXE8GrnIMAxKEc3QJvIQzlK49h4nGw32Dh+GeEAA */
    id: "UpdateMachine",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      store: null,
      form: null,
      fields: null,
      item: null,
    },
    states: {
      idle: {
        entry: "notify",
        on: {
          INIT: {
            actions: ["initialize", "loadForm"],
            target: "editing",
          },
        },
      },

      editing: {
        entry: "notify",
        on: {
          CANCEL: { target: "done" },
          UPDATE: { target: "validating" },
        },
      },

      validating: {
        entry: "notify",
        invoke: {
          id: "validate",
          src: "validate",
          onDone: [
            {
              target: "updating",
              cond: "formIsValid",
            },
            {
              target: "editing",
              actions: "toastValidationFailure",
            },
          ],
          onError: {
            target: "editing",
            actions: "toastValidationFailure",
          },
        },
      },

      updating: {
        entry: "notify",
        invoke: {
          id: "ApiUpdate",
          src: "update",
          data: {
            task: (context) => context.task,
          },
          onDone: [
            {
              target: "done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "editing",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "editing",
            actions: "toastFailure",
          },
        },
      },

      done: {
        type: "final",
        data: (context, event) => event.data,
      },
    },
  },
  {
    actions: {
      initialize: assign({
        form: (_, evt) => evt.form,
        fields: (_, evt) => evt.fields,
      }),
      notify: sendParent({ type: "NOTIFY" }),
      toastSuccess: sendParent({
        type: "TOAST",
        message: "task updated successfully",
      }),
      toastValidationFailure: sendParent(() => ({
        type: "TOAST",
        message: "Please correct any form errors and try again",
        color: "warning",
      })),
      toastFailure: sendParent((context, event) => {
        const message =
          event.data && event.data.message
            ? event.data.message
            : "An unexpected error has occurred";

        return {
          type: "TOAST",
          message: message,
          color: "error",
        };
      }),
      loadForm: (ctx) => {
        const fields = ctx.fields,
          item = ctx.item;

        for (const field in fields) {
          if (Object.prototype.hasOwnProperty.call(fields, field)) {
            if (Object.prototype.hasOwnProperty.call(item, field)) {
              fields[field] = item[field];
            }
          }
        }
      },
    },
    services: {
      validate: (ctx) => ctx.form.validate(),
      update: (ctx) => ctx.store.update(ctx.fields),
    },
    guards: {
      // Placeholder API doesn't really give us a way to determine op success
      // opSuccess: (_, evt) => evt.data.success,
      opSuccess: () => true,
      formIsValid: (_, evt) => evt.data.valid,
    },
  }
);

export { UpdateMachine };
