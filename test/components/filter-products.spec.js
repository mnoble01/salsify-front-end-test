import React from 'react'
import {mount, render} from 'enzyme'
import sinon from 'sinon'

import FilterProducts from 'components/filter-products'
import Header from 'components/header'
import NAV_LINKS from 'lib/nav-links'
import ProductCollection from 'collections/products'

function wrapper () {
  const route = NAV_LINKS[0]
  route.pageTitle = NAV_LINKS[0].text
  return mount(<FilterProducts route={route}/>)
}

describe('(Component) FilterProducts', () => {
  it('has an id equal to route path', () => {
    expect(wrapper().find('div').first().is(`#${NAV_LINKS[0].path}`)).toBe(true)
  })

  it('contains a route.pageTitle header describing the route', () => {
    expect(wrapper().find('header').text()).toBe(NAV_LINKS[0].text)
  })

  it('has a ProductCollection', () => {
    expect(wrapper().state().collection instanceof ProductCollection).toBeTruthy()
  })

  it('has page content', () => {
    expect(wrapper().children().length).toBeGreaterThan(0)
  })

  // it('calls onSubmit on <form> submit', () => {
  //   const wrap = wrapper()
  //   const spy = sinon.spy(wrap.onSubmit)
  //   wrap.find('form').find('button[type=submit]').simulate('click')
  //   expect(spy.calledOnce).toBeTruthy()
  // })
})