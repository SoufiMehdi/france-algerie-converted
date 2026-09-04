import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VoyageCard from '../VoyageCard'

const baseVoyage = {
  id: 1,
  name: 'Test Voyage',
  exchangeRate: 154.5,
  profitMargin: 50,
  createdAt: '01/09/2026',
  products: [],
}

describe('VoyageCard', () => {
  it('renders the voyage name', () => {
    render(<VoyageCard voyage={baseVoyage} onOpen={() => {}} onRemove={() => {}} />)
    expect(screen.getByText('Test Voyage')).toBeDefined()
  })

  it('shows 0 products when empty', () => {
    render(<VoyageCard voyage={baseVoyage} onOpen={() => {}} onRemove={() => {}} />)
    expect(screen.getByText('0')).toBeDefined()
  })

  it('shows product count', () => {
    const v = {
      ...baseVoyage,
      products: [
        { id: 1, name: 'A', priceEUR: 10, quantity: 1 },
        { id: 2, name: 'B', priceEUR: 20, quantity: 2 },
      ],
    }
    render(<VoyageCard voyage={v} onOpen={() => {}} onRemove={() => {}} />)
    expect(screen.getByText('2')).toBeDefined()
  })

  it('shows exchange rate and margin', () => {
    render(<VoyageCard voyage={baseVoyage} onOpen={() => {}} onRemove={() => {}} />)
    expect(screen.getByText('💱 154.5 DZD')).toBeDefined()
    expect(screen.getByText('📈 50%')).toBeDefined()
  })

  it('calls onOpen when clicked', () => {
    let called = false
    render(<VoyageCard voyage={baseVoyage} onOpen={() => { called = true }} onRemove={() => {}} />)
    screen.getByText('Test Voyage').click()
    expect(called).toBe(true)
  })
})
