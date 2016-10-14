import Backbone from 'backbone'
import titleize from 'titleize'

const PropertyValueModel = Backbone.Model.extend({
  idAttribute: 'propertyId',

  initialize () {
    this.display = this.display.bind(this)
  },

  display () {
    const value = this.get('value')
    if (typeof value === 'string') {
      return titleize(value)
    }
    return value
  }
})

const PropertyValueCollection = Backbone.Collection.extend({
  model: PropertyValueModel
})

export {PropertyValueModel, PropertyValueCollection}
export default PropertyValueCollection
