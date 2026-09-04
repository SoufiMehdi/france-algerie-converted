import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PromotionsPage from '../PromotionsPage'

// Mock the hooks/services
vi.mock('../../hooks/usePromotions', () => ({
  usePromotions: vi.fn(() => ({
    promos: [
      {
        id: 'test-1',
        storeId: 'auchan',
        title: 'Pack eaux minérales',
        category: 'boissons',
        originalPrice: 3.99,
        promoPrice: 1.99,
        unit: 'pack',
        validFrom: '2026-09-01',
        validUntil: '2026-09-30',
        image: null,
        description: 'Eau minérale plate',
      },
      {
        id: 'test-2',
        storeId: 'lidl',
        title: 'Café moulu',
        category: 'alimentation',
        originalPrice: 3.99,
        promoPrice: 2.49,
        unit: 'boîte',
        validFrom: '2026-09-01',
        validUntil: '2026-09-30',
        image: null,
        description: 'Bellarom Espresso',
      },
    ],
    suggestions: [
      {
        id: 'test-1',
        storeId: 'auchan',
        title: 'Pack eaux minérales',
        category: 'boissons',
        originalPrice: 3.99,
        promoPrice: 1.99,
        unit: 'pack',
        validFrom: '2026-09-01',
        validUntil: '2026-09-30',
        image: null,
        description: 'Eau minérale plate',
        discount: 50,
        savings: 2.0,
      },
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}))

describe('PromotionsPage', () => {
  it('renders hero title', () => {
    render(<PromotionsPage />)
    expect(screen.getByText(/Promotions du quartier/)).toBeDefined()
  })

  it('renders nearby stores tags', () => {
    render(<PromotionsPage />)
    expect(screen.getAllByText('Auchan').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Aldi').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Leclerc').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Yvroché').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Action').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Lidl').length).toBeGreaterThan(0)
  })

  it('renders suggestion section', () => {
    render(<PromotionsPage />)
    expect(screen.getByText(/suggestions d'achat/)).toBeDefined()
  })

  it('renders promotion cards', () => {
    render(<PromotionsPage />)
    expect(screen.getAllByText('Pack eaux minérales').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Café moulu').length).toBeGreaterThan(0)
  })

  it('renders store filter chips', () => {
    render(<PromotionsPage />)
    expect(screen.getByText('Tous')).toBeDefined()
  })

  it('renders category filter chips', () => {
    render(<PromotionsPage />)
    expect(screen.getByText('Toutes')).toBeDefined()
  })

  it('renders nearby stores info section', () => {
    render(<PromotionsPage />)
    expect(screen.getByText(/Magasins proches de Beaumont/)).toBeDefined()
  })
})
