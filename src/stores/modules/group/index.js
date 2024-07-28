const state = {
    allContactGroup: [],
}

const getters = {
    allContactGroup: state => {
        return state.allContactGroup
    },
}

// actions
const actions = {
    setAllContactGroup({ commit  }, payload) {
        commit ('setAllContactGroupHandler', payload);
    },
}

// mutations
const mutations = {
    setAllContactGroupHandler(state, val) {
        state.allContactGroup = val
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}