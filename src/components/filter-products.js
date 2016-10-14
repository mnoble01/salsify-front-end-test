import React, {Component} from 'react'
import BackboneReactComponent from 'backbone-react-component'
import {BasicForm, SelectField} from 'react-serial-forms'

import ProductCollection from 'collections/products'
import PropertyCollection from 'collections/properties'
import OperatorCollection from 'collections/operators'
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
    const properties = [
      {text: '- Choose a property', value: null},
      ...this.state.propertyCollection.map(p => ({text: p.display(), value: p.id}))
    ]
    const operators = this.getOperators()
    // For property values:
    // if propertyId is selected,
    //
    //   STRING: text input
    // if operatorId == CONTAINS
    //   show text input
    // if operatorId == EQUAL,
    //   if STRING, text input
    //   if NUMBER, text input, number validation
    // if operatorId == GREATER_THAN, LESS_THAN
    //   show text input, number validation
    // if operatorId == NO_VALUE || ANY_VALUE
    //   hide propertyValue
    // if operatorId == IS_ANY_OF
    //   show tags or multiselect
    const propertyValues = [
    ]

    return (
      <BasicForm ref='form' onChange={this.onSubmit} onSubmit={this.onSubmit} >
        <label htmlFor='propertyId'>Property</label>
        <SelectField name='propertyId' options={properties} validation='required' />
        <label htmlFor='operatorId'>Operator</label>
        <SelectField name='operatorId' options={operators} validation='required' />
        <label htmlFor='propertyValue'>Value</label>
        <SelectField name='propertyValue' options={propertyValues} validation='required' />
        <button name='submit' type='submit' value='Submit'>Filter</button>
      </BasicForm>
    )
  }

  getOperators () {
    const selectedPropertyId = parseInt(this.state.filter.propertyId, 10)
    const selectedPropertyModel = this.state.propertyCollection.get(selectedPropertyId)
    const selectedPropertyType = selectedPropertyModel && selectedPropertyModel.get('type')
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
