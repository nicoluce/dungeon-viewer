import Vue from 'vue';
import { is } from 'utils'

const getDefaultState = (fileId) => ({
  done: [],
  undone: [],
  newMutationsAllowed: true,
  updateBaseOnly: false,
  base: {
    id: fileId
  }
});

export const state = (fileId) => getDefaultState(fileId)

export const actions = {
  redo ({ commit, getters, state }) {
    if (!getters.canRedo) {
      return
    }

    const { type, payload } = state.undone[state.undone.length - 1]
    commit('redo')
    commit('toggleNewMutation')
    switch (typeof payload) {
      case 'object':
        commit(type, Object.assign({}, payload))
        break
      default:
        commit(type, payload)
    }
    commit('toggleNewMutation')
  },
  undo ({ commit, getters, state }) {
    if (!getters.canUndo) {
      return
    }
    commit('undo')
    commit('toggleNewMutation')
    commit('resetFile')
    state.done.forEach(({ type, payload }) => {
      switch (typeof payload) {
        case 'object':
          commit(type, {...payload})
          break
        default:
          commit(type, payload)
      }
    })
    if (state.done.length === 0) {
      commit('files/setDirty', { id: state.id, value: false }, { root: true });
    }
    commit('toggleNewMutation')
  },
  addMutation ({ commit, state }, mutation) {
    if (state.done.length === 0) {
      commit('files/setDirty', { id: state.id, value: true }, { root: true });
    }

    if (state.done.length === 5) {
      const { type, payload } = state.done[0]
      commit('updateBaseOnly')
      commit(type, payload)
      commit('updateBaseOnly')
    }
    commit('addMutation', mutation)
  }
}

export const getters = {
  canRedo (state) {
    return state.undone.length
  },
  canUndo (state) {
    return state.done.length
  },
  newMutationsAllowed (state) {
    return state.newMutationsAllowed
  }
}

export const set = (state, prop, value, indexes) => {
  if (state.updateBaseOnly) {
    updateBase(state, prop, value, indexes)
  } else {
    setBase(state, prop, value, indexes)
    setState(state, prop, value, indexes)
  }
}

const deepSet = (state, prop, value, indexes, setIfExists = true) => {
  const setIfDoesntExists = (target, prop, value) => {
    if (setIfExists || (is.object(target) && !Object.keys(target).includes(prop))) {
      Vue.set(target, prop, value);
    }
  }

  if (is.object(state[prop])) {
    if (is.nullOrUndefined(state[prop])) {
      Vue.set(state, prop, {})
    }
    Object.keys(value).forEach((nestedProp) =>
      setIfDoesntExists(state[prop], nestedProp, value[nestedProp])
    );
  } else if (is.array(state[prop])) {
    if (is.nullOrUndefined(state[prop])) {
      Vue.set(state, prop, [])
    }
    if (is.nonEmptyArray(indexes)) {
      indexes.forEach((idx) =>
        setIfDoesntExists(state[prop], idx, is.nonEmptyArray(value) ? value[idx] : value)
      );
    } else {
      setIfDoesntExists(state[prop], state[prop].length, value);
    }
  } else {
    setIfDoesntExists(state, prop, value);
  }
}

const setState = deepSet;

const setBase = (state, prop, value, indexes) => {
  const allowed = state.newMutationsAllowed;
  if (!allowed) {
    return;
  }

  const valuesToSet = is.object(state[prop])
  ? { 
      ...Object.keys(value).map((nestedProp) => state[prop][nestedProp])
    }
  : state[prop];
// arreglar esto
  console.log(state[prop], valuesToSet)

  deepSet(state.base, prop, valuesToSet, indexes);
}

const updateBase = (state, prop, value, indexes) =>
  deepSet(state.base, prop, value, indexes, state.updateBaseOnly)


export const mutations = {
  resetFile (state) {
    Object.entries(state.base).forEach(([prop, value]) => {
      switch (typeof state[prop]) {
        case 'object': {
          if (Array.isArray(state[prop])) {
            Object.entries(state.base[prop]).forEach(([idx, value]) => {
              Vue.set(state[prop], Number(idx), value)
            })
          } else {
            Object.entries(state.base[prop]).forEach(([nestedProp, nestedValue]) => {
              Vue.set(state[prop], nestedProp, nestedValue)
            })
          }
        } break
        default: {
          Vue.set(state, prop, value)
        } break
      }
    })
  },
  addMutation (state, mutation) {
    if (state.done.length === 5) {
      state.done.shift()
    }
    state.done.push(mutation)
    Vue.set(state, 'undone', [])
  },
  undo (state) {
    state.undone.push(state.done.pop())
  },
  redo (state) {
    state.done.push(state.undone.pop())
  },
  toggleNewMutation (state) {
    Vue.set(state, 'newMutationsAllowed', !state.newMutationsAllowed)
  },
  updateBaseOnly (state) {
    Vue.set(state, 'updateBaseOnly', !state.updateBaseOnly)
    Vue.set(state, 'newMutationsAllowed', !state.newMutationsAllowed)
  },
}