import Backbone from 'backbone'
import titleize from 'titleize'

const PropertyValueModel = Backbone.Model.extend({
  idAttribute: 'propertyId',

  initialize () {
    this.display = this.display.bind(this)
  },

  display () {
    return titleize(this.get('value'))
  }
})

const PropertyValueCollection = Backbone.Collection.extend({
  model: PropertyValueModel
})

export {PropertyValueModel, PropertyValueCollection}
export default PropertyValueCollection
