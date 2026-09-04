import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductCard from '../ProductCard'

const sampleProduct = {
  id: 1,
  name: 'Parfum Chanel',
  priceEUR: 49.99,
  quantity: 2,
  category: 'Cosmétiques',
  priceDZD: 7724,
  sellingPriceDZD: 11586,
  totalCostDZD: 15448,
  totalSellingDZD: 23172,
  profit: 7724,
}

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    expect(screen.getByText('Parfum Chanel')).toBeDefined()
  })

  it('displays the category emoji', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    expect(screen.getByText('💄')).toBeDefined()
  })

  it('shows EUR price', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    expect(screen.getByText(/49\.99/)).toBeDefined()
  })

  it('shows DZD selling price (locale-aware)', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    // toLocaleString('fr-FR') uses non-breaking spaces: "11 586"
    expect(screen.getByText(/11.*586.*DZD/)).toBeDefined()
  })

  it('shows profit (locale-aware)', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    expect(screen.getByText(/7.*724.*DZD/)).toBeDefined()
  })

  it('shows quantity', () => {
    render(<ProductCard product={sampleProduct} onRemove={() => {}} />)
    expect(screen.getByText(/Qté:.*2/)).toBeDefined()
  })
})
