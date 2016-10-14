import Backbone from 'backbone'
import titleize from 'titleize'
import {bind, map, includes} from 'lodash'
import {PropertyModel} from 'collections/properties'

const OperatorModel = Backbone.Model.extend({
  initialize () {
    bind(this, this.display)
  },

  display () {
    return titleize(this.get('text'))
  },

  // TODO maybe make this a PropertyValueModel
  // Use this OperatorModel's operator function to compare a propertyValue
  compare (propertyValue, value) {
    switch this.get('id')
      case this.prototype.EQUALS:
        return propertyValue === value
      case this.prototype.GREATER_THAN:
        return propertyValue > value
      case this.prototype.LESS_THAN:
        return propertyValue < value
      case this.prototype.ANY:
        return true
      case this.prototype.NONE:
        return propertyValue === null || propertyValue === undefined
      case this.prototype.IS_ANY_OF:
        return includes(propertyValue, value) // array includes
      case this.prototype.CONTAINS:
        return (propertyValue || '').includes(value) // string includes
      default:
        return false
  }
}, {
  //
  // CLASS PROPERTIES
  //
  IDS: {
    EQUALS: 'equals',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    ANY: 'any',
    NONE: 'none',
    IS_ANY_OF: 'in',
    CONTAINS: 'contains'
  }
})

const OperatorCollection = Backbone.Collection.extend({
  model: OperatorModel,

  initialize () {
    bind(this, this.fetch)
    bind(this, this.forPropertyType)
    bind(this, this.getModelsByIds)
  },

  fetch () {
    return Backbone.$.resolve(window.getOperators())
  },

  // Takes a Property.TYPE and returns a new collection,
  // consisting of valid OperatorModels for the given type
  forPropertyType (type) {
    const ID = this.model.IDS
    switch (type) {
      case PropertyModel.TYPES.STRING:
        return this.getModelsByIds([
          ID.EQUALS,
          ID.ANY,
          ID.NONE,
          ID.CONTAINS
        ])
      case PropertyModel.TYPES.NUMBER:
        return this.getModelsByIds([
          ID.EQUALS,
          ID.GREATER_THAN,
          ID.LESS_THAN,
          ID.ANY,
          ID.NONE,
          ID.IS_ANY_OF
        ])
      case PropertyModel.TYPES.ENUMERATED:
        return this.getModelsByIds([
          ID.EQUALS,
          ID.ANY,
          ID.NONE,
          ID.IS_ANY_OF
        ])
      default: // empty operator collection
        console.warn('Invalid property type passed to OperatorCollection.forPropertyType')
        return this.getModelsByIds([])
    }
  },

  // Given an array of model ids, returns a new collection of models
  getCollectionWithIds (ids = []) {
    return new OperatorCollection(map(ids, (id) => {
      this.get(id)
    }))
  }
})

export {OperatorModel, OperatorCollection}
export default OperatorCollection
