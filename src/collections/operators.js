import Backbone from 'backbone'
import titleize from 'titleize'
import includes from 'lodash/includes'
import {PropertyModel} from 'collections/properties'
import DATASTORE from 'datastore'

const OperatorModel = Backbone.Model.extend({
  initialize () {
    this.display = this.display.bind(this)
  },

  display () {
    return titleize(this.get('text'))
  },

  // TODO maybe make this a PropertyValueModel
  // Use this OperatorModel's operator function to compare a propertyValue
  compare (propertyValue, value) {
    switch (this.get('id')) {
      case OperatorModel.EQUALS:
        return propertyValue === value
      case OperatorModel.GREATER_THAN:
        return propertyValue > value
      case OperatorModel.LESS_THAN:
        return propertyValue < value
      case OperatorModel.ANY:
        return true
      case OperatorModel.NONE:
        return propertyValue === null || propertyValue === undefined
      case OperatorModel.IS_ANY_OF:
        return includes(propertyValue, value) // array includes
      case OperatorModel.CONTAINS:
        return (propertyValue || '').includes(value) // string includes
      default:
        return false
    }
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
    this.fetch = this.fetch.bind(this)
    this.forPropertyType = this.forPropertyType.bind(this)
    this.getCollectionWithIds = this.getCollectionWithIds.bind(this)
  },

  fetch (options = {}) {
    const models = DATASTORE.getOperators()
    const method = options.reset ? 'reset' : 'set'

    return Backbone.$.Deferred().resolve().done(() => { // eslint-disable-line new-cap
      this[method](models, options)
      this.trigger('sync', this, models, options)
    })
  },

  // Takes a Property.TYPE and returns a new collection,
  // consisting of valid OperatorModels for the given type
  forPropertyType (type) {
    const ID = this.model.IDS
    switch (type) {
      case PropertyModel.TYPES.STRING:
        return this.getCollectionWithIds([
          ID.EQUALS,
          ID.ANY,
          ID.NONE,
          ID.CONTAINS
        ])
      case PropertyModel.TYPES.NUMBER:
        return this.getCollectionWithIds([
          ID.EQUALS,
          ID.GREATER_THAN,
          ID.LESS_THAN,
          ID.ANY,
          ID.NONE,
          ID.IS_ANY_OF
        ])
      case PropertyModel.TYPES.ENUMERATED:
        return this.getCollectionWithIds([
          ID.EQUALS,
          ID.ANY,
          ID.NONE,
          ID.IS_ANY_OF
        ])
      default: // empty operator collection
        console.warn('Invalid property type passed to OperatorCollection.forPropertyType')
        return this.getCollectionWithIds([])
    }
  },

  // Given an array of model ids, returns a new collection of models
  getCollectionWithIds (ids = []) {
    return new OperatorCollection(ids.map(id => this.get(id)))
  }
})

export {OperatorModel, OperatorCollection}
export default OperatorCollection
