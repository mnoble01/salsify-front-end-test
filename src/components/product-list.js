import React, {Component} from 'react'
import Backbone from 'backbone'
import BackboneReactComponent from 'backbone-react-component'
// import ProductCollection from 'collections/products'

class Product extends Component {
  static propTypes = {
    model: React.PropTypes.instanceOf(Backbone.Model).isRequired
    // React.propTypes.isRequired
  }

  constructor (...args) {
    super(...args)
    this.state = {
      model: this.props.model
    }
  }

  render () {
    return (
      <div className='product'>
        <div className='product-name'>{this.props.model.display()}</div>
      </div>
    )
  }
}

export default class ProductList extends Component {
  mixins: [BackboneReactComponent]

  static propTypes = {
    collection: React.PropTypes.instanceOf(Backbone.Collection).isRequired
  }

  constructor (...args) {
    super(...args)

    this.state = {
      // collection: new ProductCollection()
      collection: this.props.collection
    }
  }

  componentWillMount () {
    this.state.collection.fetch()
  }

  render () {
    return (
      <div className='product-list'>
        {this.state.collection.map(p => (
          <Product key={p.id} model={p}/>
        ))}
      </div>
    )
  }
}

