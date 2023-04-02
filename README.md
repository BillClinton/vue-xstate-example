# Machines

## ToastMachine
A simple machine that controls toast messages shown to the user.  It is using the Vuetify Snackbar component
which is not optimal for this as it doesn't implement any stacking for multiple messages.  This is fine for
this demo, but I'd want to implement something more advanced in an actual production application.

This machine is exposed as an actor using a service hook.  The DataTable Machine uses the service hook to
obtain reference to this actor.  The DataTable Machine is then able to forward events to the ToastMachine,
which it is configured to do regardless fo the current state of the DataTable Machine.

Visualize/Simulate: https://stately.ai/viz/465ca5de-a265-4973-9539-f0ebe17c3e58




# default

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
