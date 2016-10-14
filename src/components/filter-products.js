import React, {Component} from 'react'
import BackboneReactComponent from 'backbone-react-component'
import {BasicForm, SelectField, InputField} from 'react-serial-forms'

import ProductCollection from 'collections/products'
import {PropertyModel, PropertyCollection} from 'collections/properties'
import {OperatorModel, OperatorCollection} from 'collections/operators'
import Header from 'components/header'
import ProductList from 'components/product-list'


export default class FilterProducts extends Component {
  mixins: [BackboneReactComponent]

  static propTypes = {
    route: React.PropTypes.object.isRequired
  }

  constructor (...args) {
    super(...args)

    this.state = {
      collection: new ProductCollection(),
      propertyCollection: new PropertyCollection(),
      operatorCollection: new OperatorCollection(),
      filter: {}
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.state.collection.fetch()
    this.state.propertyCollection.fetch()
    this.state.operatorCollection.fetch()
  }

  onSubmit (e) {
    e.preventDefault()
    this.refs.form.validate((errs) => {
      const filter = this.refs.form.serialize()
      console.log('filter', filter)
      if (errs) {
        console.info(errs)
        this.setState({hasValidFilter: false, filter})
        return
      }
      this.setState({hasValidFilter: true, filter})
    })
  }

  // hasValidFilter () {

  // }

  // filterProducts (property, operator, value) {
  //   console.log('filterProducts', this.propertyCollection)
  //   console.log(property, operator, value)
  // }

  render () {
    return (
      <div id='filter-products'>
        <Header text={this.props.route.pageTitle} />
        {this.renderForm()}
        {this.renderProductList()}
      </div>
    )
  }

  renderProductList () {
    if (this.state.hasValidFilter) {
      const filteredModels = this.state.collection.filter((prod) => {
        const {propertyId, operatorId, propertyValue} = this.state.filter
        const productPropertyValue = prod.get('propertyValueCollection').findWhere({
          propertyId
        })
        const operatorModel = this.state.operatorCollection.get(operatorId)
        return operatorModel.compare(productPropertyValue, propertyValue)
      })
      console.log('filteredModels', filteredModels)
      const filteredCollection = new ProductCollection(filteredModels)
      return (<ProductList collection={filteredCollection} />)
    }
    return (<ProductList collection={this.state.collection} />)
  }

  renderForm () {
    const properties = this.getProperties()
    const operators = this.getOperators()
    return (
      <BasicForm ref='form' onChange={this.onSubmit} onSubmit={this.onSubmit} >
        <label htmlFor='propertyId'>Property</label>
        <SelectField name='propertyId' options={properties} validation='required' />
        <label htmlFor='operatorId'>Operator</label>
        <SelectField name='operatorId' options={operators} validation='required' />
        <label htmlFor='propertyValue'>Value</label>
        {this.renderPropertyValue()}
        <button name='submit' type='submit' value='Submit'>Filter</button>
      </BasicForm>
    )
  }

  renderPropertyValue () {
    const propType = this.getSelectedPropertyType()
    const opId = this.getSelectedOperatorId()
    const TYPES = PropertyModel.TYPES
    const OPS = OperatorModel.IDS

    switch (opId) {
      case OPS.LESS_THAN:
      case OPS.GREATER_THAN:
        return <InputField type='number' name='propertyValue' validation='required' />
      case OPS.CONTAINS:
        return (
          <InputField type='text' name='propertyValue' validation='required' />
        )
      case OPS.IS_ANY_OF: {
        // TODO string, number, enumerated
        // tags for string/number
        if (propType === TYPES.ENUMERATED) {
          const propertyValues = []
          // property values = products where product.get('propertyValueCollection') contains
          // selected property
          return (
            <SelectField multiple={true} name='propertyValue' options={propertyValues} validation='required' />
          )
        }
        return <InputField type='text' name='propertyValue' validation='required' />
      }
      case OPS.EQUALS: {
        if (propType === TYPES.ENUMERATED) {
          // const propertyValues = this.state.
          // property values = products where product.get('propertyValueCollection') contains
          // selected property
          const propertyValues = []
          return (
            <SelectField name='propertyValue' options={propertyValues} validation='required' />
          )
        }
        const inputType = propType === TYPES.NUMBER ? 'number' : 'text'
        return (
          <InputField type={inputType} name='propertyValue' validation='required' />
        )
      }
      case OPS.ANY:
      case OPS.NONE:
      default:
        // empty
        return (<div></div>)
    }
  }

  // returns a string of the currently selected property type
  getSelectedPropertyType () {
    const selectedPropertyId = parseInt(this.state.filter.propertyId, 10)
    const selectedPropertyModel = this.state.propertyCollection.get(selectedPropertyId)
    return selectedPropertyModel && selectedPropertyModel.get('type')
  }

  // returns a string of the currently selected operator id
  getSelectedOperatorId () {
    return this.state.filter.operatorId
  }

  getProperties () {
    return [
      {text: '- Choose a property', value: null},
      ...this.state.propertyCollection.map(p => ({text: p.display(), value: p.id}))
    ]
  }

  getOperators () {
    const selectedPropertyType = this.getSelectedPropertyType()
    let operators = []
    console.log('selectedPropertyType', selectedPropertyType)
    if (selectedPropertyType) {
      operators = this.state.operatorCollection.forPropertyType(selectedPropertyType).map(o =>
        ({text: o.display(), value: o.id})
      )
    } else {
      operators = this.state.operatorCollection.map(o => ({text: o.display(), value: o.id}))
    }
    operators.splice(0, 0, {text: '- Choose an operator', value: null})
    return operators
  }
}
