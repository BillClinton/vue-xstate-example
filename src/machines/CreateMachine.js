import { assign, createMachine, sendParent } from "xstate";
import { isProxy, toRaw } from "vue";
import { cloneDeep } from "lodash";

const CreateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGEBOYCGAXMBZDAxgBYCWAdmAHQkQA2YAxAJIByTAKgNoAMAuoqAAOAe1gksJYWQEgAnogC0AFgCclAKzct3deoDs3FQA4AbOpMmANCAAei9UoCMlI+oDMSgEyPX6le8cAX0DrNEwcfGJyKgwICHIoWWEGABkAeQBBABEAMTSAJVwefiQQETEJKRk7BAUHZ1cPb19-N0dreQRTFzdet25+hz0jTyNg0PRsPEJSCkpY+LJE5OQMlmQAURTimXLxSWlSmrqnF3cvH11W9rlER39KPU0tTx0jJW49FT1xkDCpyKzGJxBJJBjIfIbDLsDY7Up7SqHUDHepnJqXPwBDqITzqIyUXHaV54j5jEJ-SYRGbRSgANwwtBo2ASDAgUio5FpwgA1lR6YyIFM4UJRPsqkdFJ5PJRDH4lI09G0jD5sbV5TLtDoVCYjEZetwyRNwtMonN+UyJEsGGBUKhhKhKIJaNgAGb2gC2dIZFrAwrKosR1Ul+hcSlUjjDetJvVVCle3EoH24ZjcKnjJk8P3J-yppqoBEpLLZc05PKoGUEJBzvr4uwDByDCFTahMhn6EfM3HDse6JhUSl0A9TbTcet+1cBNIL4SL7OoZC5vMoFarlN9jhKIoqDYlCA+zhUWn8OjcnhMbistyb6hlRk+Tz1pm4Z70JnHa8nc2nzKtNrtDqdV0PWXStqz9BEd2RO4B0oPtNCMFQVFTUZtVjeNEy0EwnGMTxUzMN9sw-akSzoRgYQAZS4Wt4XrcUoNqPQnkePwLD7ZtT1jRxDA0TVdAMYx8OCckyGECA4BkCdiLAOttzo2xFHeEwNBGPwLwNXVRjQow9EoQ9k00RwdT0D4lHfY1Pw5UiZLFJF5IY4xlNxJDW11EYjFjVQeO0PjDFMcwCKNAEpPmEEliSazA13BQ9FxM4TC+bVT2VPFVQvZwdTccxDNfKVXlMwjzOC81BUtKAIsguy42GShsrvLx3i43EexvRDENc7T+yUYyzKCvNKG-UryrkmoIwTXFcRirDkzylQeyUzVTzMJDtLcHrcyBShi2kmjZNs443BcNMnkMxxcM+b5dFVRxTxlfRcNTbgfHuVaCt6jaXQAVzIAAvdkhr2xRhh0p5tQsJDEI4q8FCerytB8gTzCEwIgA */
    id: "CreateMachine",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      store: null,
      form: null,
      post: null,
    },
    states: {
      idle: {
        entry: "notify",
        on: {
          INIT: {
            actions: ["initialize", () => console.log("yoyoyoyoyoyoy")],
            target: "adding",
          },
        },
      },

      adding: {
        entry: "notify",
        on: {
          LOADFORM: { actions: "loadForm" },
          CANCEL: { target: "done" },
          CREATE: { target: "validating" },
        },
      },

      validating: {
        entry: "notify",
        invoke: {
          id: "validate",
          src: "validate",
          onDone: [
            {
              target: "creating",
              cond: "formIsValid",
            },
            {
              target: "adding",
              actions: "toastValidationFailure",
            },
          ],
          onError: {
            target: "adding",
            actions: "toastValidationFailure",
          },
        },
      },

      creating: {
        entry: "notify",
        invoke: {
          id: "ApiCreate",
          src: "create",
          data: {
            post: (ctx) => ctx.post,
          },
          onDone: [
            {
              target: "done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "adding",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "adding",
            actions: "toastFailure",
          },
        },
      },

      done: {
        type: "final",
        data: (_, evt) => evt.data,
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
        message: "post created successfully",
      }),
      toastValidationFailure: sendParent(() => ({
        type: "TOAST",
        message: "Please correct any form errors and try again",
        color: "warning",
      })),
      toastFailure: sendParent((_, evt) => {
        const message =
          evt.data && evt.data.message
            ? evt.data.message
            : "An unexpected error has occurred";

        return {
          type: "TOAST",
          message: message,
          color: "error",
        };
      }),
      loadForm: assign((_, { form, fields }) => ({ form, fields })),
    },
    services: {
      validate: (ctx) => ctx.form.validate(),
      create: (ctx) => ctx.store.create(ctx.fields),
    },
    guards: {
      // Placeholder API doesn't really give us a way to determine op success
      // opSuccess: (_, evt) => evt.data.success,
      opSuccess: () => true,
      formIsValid: (_, evt) => evt.data.valid,
    },
  }
);

export { CreateMachine };
