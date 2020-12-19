// Based on: https://github.com/anthonygore/vuex-undo-redo
import { allowedMutations } from 'store/modules/filedata'

export default {
  created () {
    const allowed = allowedMutations.map(
      (type) => `${this.moduleNamespace}/${type}`
    )

    this.$store.subscribe((mutation) => {
      if ([
        mutation.type.includes('resetState') === false,
        mutation.type.includes('resetFile') === false,
        allowed.includes(mutation.type)
      ].every((b) => b)) {
        const allowed = this.$store.getters[`${this.moduleNamespace}/newMutationsAllowed`]
        if (allowed) {
          const type = mutation.type.substring(this.moduleNamespace.length + 1, mutation.type.length)
          this.$store.dispatch(`${this.moduleNamespace}/addMutation`, {...mutation, type})
        }
      }
    })
  }
}
