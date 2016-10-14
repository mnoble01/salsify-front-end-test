import Backbone from 'backbone'
import bind from 'lodash/bind'
// import findWhere from 'lodash/findWhere'
// import PropertyModel from 'collections/properties'

const ProductModel = Backbone.Model.extend({
  initialize () {
    bind(this, this.display)
    // properties: value of a particular [property type]
  },

  display () {
    // const prodNameProperty = findWhere(this.get('properties'), {id: PropertyModel.IDS.PRODUCT_NAME})
    // return  prodNameProperty && prodNameProperty.display() || ''
    // TODO have a function on PropertyModel? OR Collection to get ProductDisplay
  }
})

const ProductCollection = Backbone.Collection.extend({
  model: ProductModel,

  fetch () {
    const products = window.getProducts().map((p) => {
      // TODO nested collection
      const properties = p.property_values.map(prop => ({id: prop.property_id, value: prop.value}))
      return {id: p.id, properties}
    })
    return Backbone.$.resolve(products)
  }
})

export {ProductModel, ProductCollection}
export default ProductCollection
