import Vue from 'vue'
import path from 'path'

const getDefaultState = () => {
  return {
    openFiles: {},
    newFileData: null
  }
}

const state = getDefaultState()

const actions = {
  reset ({ commit }) {
    commit('resetState')
  },
  addTempFile({ commit, getters }, config) {
    const id = getters.getId;
    const metadata = {
      id,
      name: `Untitled-${id}`,
      path: '',
      isTemp: true,
      isDirty: true
    };
    commit('addMetadata', metadata);
    commit('setNewFileData', config);
  },
  addFile({ commit, getters }, filepath) {
    if (getters.paths.includes(filepath)) {
      return;
    }
    const id = getters.getId;
    const metadata = {
      id,
      name: path.basename(filepath, '.dmc'),
      path: filepath,
      isTemp: false,
      isDirty: false
    };
    commit('addMetadata', metadata);
  },
  saveFile({ commit }, {id, filepath}) {
    commit('udpateMetadata', {id, data: {
      filepath,
      name: path.basename(filepath, '.dmc'),
      isTemp: false,
      isDirty: false
    }});
  }
}
const getters = {
  getId: (state, getters) => {
    let newId = 0;
    const ids = getters['fileIds'];
    for (const id of ids) {
      if (newId < id) {
        return newId;
      }
      newId++;
    }
    return newId;
  },
  fileIds: (state) => {
    return Object.keys(state.openFiles).map((k) => Number(k))
  },
  getMetadata: (state) => (id) => {
    return state.openFiles[id]
  },
  dirtyFileIds: (state) => {
    return Object.keys(
      Object.entries(state.openFiles)
        .filter(([id, metadata]) => metadata.isDirty)
      )
      .map((k) => Number(k))
  },
  paths: (state) => {
    return Object.keys(state.openFiles).map((key) => state.openFiles[key].path);
  },
  newConfig(state) {
    return state.newFileData;
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setOpenFiles (state, val) {
    state.openFiles = val
  },
  addMetadata(state, metadata) {
    Vue.set(state.openFiles, metadata.id, metadata);
  },
  removeMetadata(state, id) {
    Vue.delete(state.openFiles, id);
  },
  udpateMetadata(state, { id, data }) {
    Object.entries(data).forEach(([key, val]) => {
      Vue.set(state.openFiles[id], key, val);
    });
  },
  setDirty(state, { id, value }) {
    Vue.set(state.openFiles[id], 'isDirty', value);
  },
  setNewFileData(state, config) {
    state.newFileData = config;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
