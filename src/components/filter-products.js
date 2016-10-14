import React, {Component} from 'react'
import BackboneReactComponent from 'backbone-react-component'
import {BasicForm, SelectField, InputField} from 'react-serial-forms'
import {uniqBy, sortBy} from 'lodash'

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
      filter: {},
      addedPropertyValues: []
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
      filter.propertyId = parseInt(filter.propertyId, 10)
      console.log('number??', this.getSelectedPropertyType(), PropertyModel.TYPES.NUMBER)
      if (this.getSelectedPropertyType() === PropertyModel.TYPES.NUMBER) {
        filter.propertyValue = parseInt(filter.propertyValue, 10)
      }
      console.log('filter', filter)
      if (errs) {
        console.info(errs)
        this.setState({hasValidFilter: false, filter})
        return
      }
      this.setState({hasValidFilter: true, filter})
    })
  }

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
        let {propertyId, operatorId, propertyValue} = this.state.filter // eslint-disable-line prefer-const
        const valueModel = prod.get('propertyValueCollection').findWhere({
          propertyId
        })
        const operatorModel = this.state.operatorCollection.get(operatorId)
        return operatorModel.compare(valueModel, propertyValue)
      })
      const filteredCollection = new ProductCollection(filteredModels)
      return (<ProductList collection={filteredCollection} properties={this.state.propertyCollection} />)
    }
    return (<ProductList collection={this.state.collection} properties={this.state.propertyCollection} />)
  }

  renderForm () {
    const properties = this.getProperties()
    const operators = this.getOperators()
    return (
      <BasicForm ref='form' onSubmit={this.onSubmit} >
        <label htmlFor='propertyId'>Property</label>
        <SelectField name='propertyId' options={properties} validation='required' onChange={this.onSubmit} />
        <label htmlFor='operatorId'>Operator</label>
        <SelectField name='operatorId' options={operators} validation='required' onChange={this.onSubmit} />
        <label htmlFor='propertyValue'>Value</label>
        {this.renderPropertyValue()}
        <button name='submit' type='submit' value='Submit'>Filter</button>
      </BasicForm>
    )
  }

  // returns a string of the currently selected property id
  getSelectedPropertyId () {
    return parseInt(this.state.filter.propertyId, 10)
  }

  // returns a string of the currently selected property type
  getSelectedPropertyType () {
    const selectedPropertyModel = this.state.propertyCollection.get(this.getSelectedPropertyId())
    return selectedPropertyModel && selectedPropertyModel.get('type')
  }

  // returns a string of the currently selected operator id
  getSelectedOperatorId () {
    return this.state.filter.operatorId
  }

  // getSelectedPropertyValue () {
  //   return this.state.filter.propertyValue
  // }

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

  renderPropertyValue () {
    const propId = this.getSelectedPropertyId()
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
      // case OPS.IS_ANY_OF: {
      //   // TODO string, number, enumerated
      //   // tags for string/number
      //   if (propType === TYPES.ENUMERATED) {
      //     const propertyValues = []
      //     // property values = products where product.get('propertyValueCollection') contains
      //     // selected property
      //     return (
      //       <SelectField multiple={true} name='propertyValue' options={propertyValues} validation='required' />
      //     )
      //   }
      //   if (!this.state.addedPropertyValues.length) {
      //     // add empty property value to begin
      //     this.addNewPropertyValue(opId, false)
      //   }
      //   return (
      //     <div className='property-values'>
      //       {this.state.addedPropertyValues.map(pv => pv)}
      //       <button onClick={() => this.addNewPropertyValue(opId)} className='add' type='button'>+ Add</button>
      //     </div>
      //   )
      //   // return <InputField type='text' name='propertyValue' validation='required' />
      // }
      case OPS.EQUALS:
      case OPS.IS_ANY_OF: {
        let multiple = opId === OPS.IS_ANY_OF
        let availablePropertyValues = []
        this.state.collection.each((prod) => {
          const pv = prod.get('propertyValueCollection').findWhere({propertyId: propId})
          if (pv) {
            availablePropertyValues.push({text: pv.display(), value: pv.get('value')})
          }
        })
        availablePropertyValues = uniqBy(availablePropertyValues, 'value')
        availablePropertyValues = sortBy(availablePropertyValues, 'text')
        return (
          <SelectField
            onChange={this.onSubmit}
            name='propertyValue'
            multiple={multiple}
            options={availablePropertyValues}
            validation='required' />
        )
      }
      case OPS.ANY:
      case OPS.NONE:
      default:
        // empty
        return (<div></div>)
    }
  }

  addNewPropertyValue (inputType, setState = true) {
    const values = this.state.addedPropertyValues
    const newKey = values.length
    const propertyValueInput = (
      <div className='property-value' key={newKey}>
        <InputField type={inputType} validation='required' name={`propertyValues[${newKey}]`}/>
        {newKey > 0 && <button onClick={() => this.removePropertyValue(newKey)} className='remove'>✕</button>}
      </div>
    )
    values.push(propertyValueInput)
    if (setState) {
      this.setState({
        addedPropertyValues: values
      })
      // , this.forceUpdate)
    }
  }

  removePropertyValue (index) {
    const values = this.state.addedPropertyValues
    values.splice(index, 1)
    this.setState({
      addedPropertyValues: values
    })
  }
}
