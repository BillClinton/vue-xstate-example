import { createMachine, sendParent } from "xstate";

const DeleteMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwBswBcwFkCGAxgBYCWAdmAHQED2ZAZiQE4C25UAxAMICCAclwCiAGQDaABgC6iUAAcasEphJ0ZIAB6IAtADYArJXEBmAIwAmACwmA7NZ06TR63oA0IAJ7aTATkqOdRgAcxoHW3iY6gQC+UW6oGNj4xORUtAzMbGScyIIAygAqAEoA8gCaEtJIIPKKyqpVmgi6vgF6FuIO4WZ6+mZunk0m4r7BRuK2jiZ6w3pGMXHoWLiEpBSUEHCYTDTu7BwQdFTkAG40ANZUG7BbOxVqNUoqZGqNRt2U9vaB5hZ61mY6Sz9bR-D7eQLebrebz-b6mCzzEDxJZJVaXTbbXZZfaHSgnc7o66Y0QmSpyBSPeqgV5GXzePSBIyzEwWJl6KbAhBtShjIaBKz8wFmUyI5GJFYpdYYnZ7MBMbZMSiyNB4TD0GisKVE25Se4UurPBqIWnWShtCKBabwiy-HScrQ+CwfT4WAGM0LeHQxWIgMg0K5qMXLZIUPW1J4vbRmbziSjQ6FBbriGzeCzWe1mQJmPwut1BMI9UWLcUh1J0RisdhhymG6lR11x+OJ6YptP2obZiw6GHRz3hfQ2IsJYNorU3LFQasGyMIWzO+wMnTicTtawddtvD4rkyBHTOSJmcZDlEStYHUNVB7To0ILOGAHGWkHvSZwKc95mWwOfld106CyhN6URAA */
    id: "DeleteMachine",
    predictableActionArguments: true,
    initial: "confirming",
    context: {
      store: null,
      item: null,
      logTransition: true,
    },
    states: {
      confirming: {
        entry: "notify",
        on: {
          CANCEL: { target: "done" },
          DESTROY: { target: "destroying" },
        },
      },

      destroying: {
        entry: "notify",
        invoke: {
          id: "destroy",
          src: "destroy",
          onDone: [
            {
              target: "done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "confirming",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "confirming",
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
      notify: sendParent({ type: "NOTIFY" }),
    },
    services: {
      destroy: (ctx) => ctx.store.destroy(ctx.item.id),
    },
    guards: {
      // Placeholder API doesn't really give us a way to determine op success
      // opSuccess: (context, event) => event.data.success,
      opSuccess: () => true,
    },
  }
);

export { DeleteMachine };
