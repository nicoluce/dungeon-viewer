import Vue from 'vue'
import * as undoRedo from './undo-redo'

const set = undoRedo.set;

const getDefaultState = (fileId) => ({
  id: fileId,
  version: 0.1,
  grid: {
    width: 10,
    height: 10,
    rectSize: 70,
    unit: 'px',
    strokeColor: '#000000',
    strokeSize: 0.5
  },
  floors: [],
  ...undoRedo.state(fileId)
})

const state = (fileId) => getDefaultState(fileId)

const actions = {
  reset ({ commit }) {
    commit('resetState')
  },
  load({ commit }, data) {
    // TODO: validate data
    commit('setInitialData', data)
  },
  ...undoRedo.actions
}

const getters = {
  data (state) {
    return state
  },
  saveData (state) {
    return {
      version: state.version,
      grid: state.grid
    }
  },
  ...undoRedo.getters
}

const undoableMutations = {
  setGrid (state, data) {
    set(state, 'grid', data);
  },
  addFloor (state, data) {
    set(state, 'floors', data);
  }
}

export const allowedMutations = Object.keys(undoableMutations)

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setInitialData (state, data) {
    Object.entries(data).forEach(([prop, value]) => {
      switch (typeof state[prop]) {
        case 'object': {
          Object.entries(data[prop]).forEach(([nestedProp, nestedValue]) => {
            Vue.set(state[prop], nestedProp, nestedValue)
          })
        } break
        default: {
          Vue.set(state, prop, value)
        } break
      }
    });
  },  
  ...undoableMutations,
  ...undoRedo.mutations
}

export const FileDataModule = (fileId) => ({
  namespaced: true,
  state: state(fileId),
  getters,
  actions,
  mutations
})

export default FileDataModule
