import Backbone from 'backbone'
import titleize from 'titleize'
import DATASTORE from 'datastore'

const PropertyModel = Backbone.Model.extend({
  initialize () {
    this.display = this.display.bind(this)
  },

  display () {
    return titleize(this.get('name'))
  }
}, {
  //
  // CLASS PROPERTIES
  //
  TYPES: {
    STRING: 'string',
    NUMBER: 'number',
    ENUMERATED: 'enumerated'
  },

  IDS: {
    PRODUCT_NAME: 0
  }
})

const PropertyCollection = Backbone.Collection.extend({
  model: PropertyModel,

  fetch (options = {}) {
    const models = DATASTORE.getProperties()
    const method = options.reset ? 'reset' : 'set'

    return Backbone.$.Deferred().resolve().done(() => { // eslint-disable-line new-cap
      this[method](models, options)
      this.trigger('sync', this, models, options)
    })
  }
})

export {PropertyModel, PropertyCollection}
export default PropertyCollection
