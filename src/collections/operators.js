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

  // Given a PropertyValueModel return true if this operator is successfully applied to `value`
  compare (propertyValueModel = null, value) {
    const IDS = this.constructor.IDS
    const propertyValue = propertyValueModel && propertyValueModel.get('value')
    const isDefined = propertyValue !== null && propertyValue !== undefined
    switch (this.id) {
      case IDS.EQUALS: {
        if (typeof propertyValue === 'string' && typeof value === 'string' && value) {
          return isDefined && propertyValue.toLowerCase() === value.toLowerCase()
        }
        return isDefined && propertyValue === value
      }
      case IDS.GREATER_THAN:
        return isDefined && propertyValue > value
      case IDS.LESS_THAN:
        return isDefined && propertyValue < value
      case IDS.ANY:
        return true
      case IDS.NONE:
        return !isDefined
      case IDS.IS_ANY_OF:
        return isDefined && includes(value, propertyValue) // array includes
      case IDS.CONTAINS: {
        const rgx = new RegExp(value, 'i')
        return isDefined && rgx.test(propertyValue) // string includes
      }
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

  // Takes a Property.TYPE and returns a new collection consisting of
  // valid OperatorModels for the given type
  forPropertyType (type) {
    const ID = this.model.IDS
    switch (type) {
      case PropertyModel.TYPES.STRING:
        return this.getCollectionWithIds([
          ID.EQUALS,
          ID.ANY,
          ID.NONE,
          ID.IS_ANY_OF,
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
