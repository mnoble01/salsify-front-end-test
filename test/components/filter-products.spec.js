import React from 'react'
import {mount, render} from 'enzyme'

import Home from 'components/filter-products'
import Header from 'components/header'
import NAV_LINKS from 'lib/nav-links'
import ProductCollection from 'collections/products'

function wrapper () {
  const route = NAV_LINKS[0]
  route.pageTitle = NAV_LINKS[0].text
  return mount(<Home route={route}/>)
}

describe('(Component) FilterProducts', () => {
  it('has an id equal to route path', () => {
    expect(wrapper().find('div').first().is(`#${NAV_LINKS[0].path}`)).toBe(true)
  })

  it('contains a route.pageTitle header describing the route', () => {
    expect(wrapper().find('header').text()).toBe(NAV_LINKS[0].text)
  })

  // it('has a ProductCollection', () => {
  //   expect(wrapper().state().collection instanceof ProductCollection).toByTruthy()
  // })

  // it('has page content', () => {
  //   expect(wrapper().children().length).toBe('')
  // })
})