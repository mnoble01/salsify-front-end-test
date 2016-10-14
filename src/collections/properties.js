import Backbone from 'backbone'
import bind from 'lodash/bind'
import titleize from 'titleize'

const PropertyModel = Backbone.Model.extend({
  initialize () {
    bind(this, this.display)
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

  fetch () {
    return Backbone.$.resolve(window.getProperties())
  }
})

export {PropertyModel, PropertyCollection}
export default PropertyCollection
