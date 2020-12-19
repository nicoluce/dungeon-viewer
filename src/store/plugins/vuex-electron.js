import { ipcRenderer } from "electron"

export default (store) => {
  ipcRenderer.on('store:commit', (event, type, ...args) =>
    store.commit(type, ...args)
  );

  ipcRenderer.on('store:getters', (event, type, ...args) => {
    const value = store.getters[type];
    event.sender.send(`getter:${type}`,
    typeof value === 'function'
      ? value(...args)
      : value)
  });

  ipcRenderer.on('store:dispatch', (event, type, ...args) => {
    console.log(store)
    store.dispatch(type, ...args)
  });

  ipcRenderer.on('store:registerModule', (event, path, module, options) => {
    store.registerModule(path, module, options);
    event.sender.send(`moduleRegistered:${path.join('/')}`);
  });

  ipcRenderer.on('store:unregisterModule', (event, name) =>
    store.unregisterModule(name)
  );
};