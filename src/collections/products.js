import Backbone from 'backbone'
import DATASTORE from 'datastore'
import PropertyValueCollection from 'collections/property-values'
import {PropertyModel} from 'collections/properties'

const ProductModel = Backbone.Model.extend({
  initialize () {
    this.display = this.display.bind(this)
  },

  display () {
    const propertyValueModel = this.get('propertyValueCollection').findWhere({
      propertyId: PropertyModel.IDS.PRODUCT_NAME
    })
    return (propertyValueModel && propertyValueModel.display()) || ''
  }
})


const ProductCollection = Backbone.Collection.extend({
  model: ProductModel,

  fetch (options = {}) {
    const models = DATASTORE.getProducts().map((product) => {
      const propertyValues = product.property_values.map(pv =>
        ({propertyId: pv.property_id, value: pv.value})
      )
      return {
        id: product.id,
        propertyValueCollection: new PropertyValueCollection(propertyValues)
      }
    })
    const method = options.reset ? 'reset' : 'set'

    return Backbone.$.Deferred().resolve().done(() => { // eslint-disable-line new-cap
      this[method](models, options)
      this.trigger('sync', this, models, options)
    })
  }
})

export {ProductModel, ProductCollection}
export default ProductCollection
