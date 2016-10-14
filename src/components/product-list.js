import React, {Component} from 'react'
import Backbone from 'backbone'
import BackboneReactComponent from 'backbone-react-component'

class Product extends Component {
  static propTypes = {
    model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    properties: React.PropTypes.instanceOf(Backbone.Collection).isRequired
  }

  render () {
    return (
      <div className='product'>
        <div className='product-name'>{this.props.model.display()}</div>
        <div className='properties'>
          {this.props.model.get('propertyValueCollection').map((pv, i) => {
            const propertyName = this.props.properties.get(pv.get('propertyId')).display()
            const propertyValue = pv.display()
            return <div key={i} className='property'>{propertyName}: {propertyValue}</div>
          })}
        </div>
      </div>
    )
  }
}

export default class ProductList extends Component {
  mixins: [BackboneReactComponent]

  static propTypes = {
    collection: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
    properties: React.PropTypes.instanceOf(Backbone.Collection).isRequired
  }

  render () {
    return (
      <div className='product-list'>
        {this.props.collection.map(p => (
          <Product key={p.id} model={p} properties={this.props.properties} />
        ))}
      </div>
    )
  }
}

