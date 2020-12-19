import Vue from 'vue'

const getDefaultState = () => {
  return {
    floors: {},
    selectedId: 1,
    currentColor: ''
  }
}

const state = getDefaultState()

const actions = {
  reset ({ commit }) {
    commit('resetState')
  },
  load({ commit }, data) {
    // data.forEach((floor) => commit('addFloor', floor));
    commit('addFloor', {
      id: 1
    });
  }
}
const getters = {
  floor: (state) => (id) => {
    return state.floors[id];
  },
  selectedId: (state) => {
    return state.selectedId;
  },
  currentColor: (state) => {
    return state.currentColor;
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  addFloor(state, floor) {
    state.floors[floor.id] = floor;
  },
  // editFloor(state, {id, data}) {
  //   Object.keys(data).forEach((prop) => {
  //     Vue.set(state.floors[id], prop, data[prop]);
  //   });
  // },
  selectFloor(state, id) {
    state.selectedId = id;
  },
  setColor(state, color) {
    state.currentColor = color;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
