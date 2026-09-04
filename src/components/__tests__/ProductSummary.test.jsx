import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductSummary from '../ProductSummary'

const sampleTotals = {
  totalCostEUR: 100,
  totalCostDZD: 15450,
  totalSellingDZD: 23175,
  totalProfit: 7725,
  totalQty: 3,
}

describe('ProductSummary', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(<ProductSummary totals={sampleTotals} visible={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('shows all totals when visible (locale-aware)', () => {
    render(<ProductSummary totals={sampleTotals} visible={true} />)
    expect(screen.getByText(/100\.00.*€/)).toBeDefined()
    expect(screen.getByText(/15.*450.*DZD/)).toBeDefined()
    expect(screen.getByText(/23.*175.*DZD/)).toBeDefined()
    expect(screen.getByText(/7.*725.*DZD/)).toBeDefined()
  })

  it('shows label texts', () => {
    render(<ProductSummary totals={sampleTotals} visible={true} />)
    expect(screen.getByText('Coût total (EUR)')).toBeDefined()
    expect(screen.getByText('Coût total (DZD)')).toBeDefined()
    expect(screen.getByText('Prix de vente total')).toBeDefined()
    expect(screen.getByText('💰 Profit total')).toBeDefined()
  })
})
