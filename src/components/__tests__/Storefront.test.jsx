import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Storefront from '../Storefront'

const voyages = [
  {
    id: 1,
    exchangeRate: 154.5,
    profitMargin: 50,
    products: [
      {
        id: 1,
        name: 'Parfum Chanel',
        priceEUR: 49.99,
        quantity: 2,
        category: 'Cosmétiques',
        description: 'Beau parfum',
        photoURL: '',
      },
    ],
  },
]

describe('Storefront', () => {
  it('renders store name', () => {
    render(
      <Storefront
        voyages={[]}
        storeName="Test Store"
        storeDescription="Desc"
        whatsappNumber=""
      />,
    )
    expect(screen.getByText('Test Store')).toBeDefined()
  })

  it('shows empty state when no products', () => {
    render(
      <Storefront
        voyages={[]}
        storeName="Test Store"
        storeDescription="Desc"
        whatsappNumber=""
      />,
    )
    expect(screen.getByText(/Boutique en cours de préparation/)).toBeDefined()
  })

  it('displays products', () => {
    render(
      <Storefront
        voyages={voyages}
        storeName="Test Store"
        storeDescription="Desc"
        whatsappNumber=""
      />,
    )
    expect(screen.getByText('Parfum Chanel')).toBeDefined()
  })

  it('shows WhatsApp button when number is set', () => {
    render(
      <Storefront
        voyages={voyages}
        storeName="Test Store"
        storeDescription="Desc"
        whatsappNumber="213555123456"
      />,
    )
    expect(screen.getByText(/Nous contacter sur WhatsApp/)).toBeDefined()
  })

  it('shows category filters', () => {
    render(
      <Storefront
        voyages={voyages}
        storeName="Test Store"
        storeDescription="Desc"
        whatsappNumber=""
      />,
    )
    // 'Cosmétiques' appears in both filter button and product badge
    expect(screen.getAllByText('Cosmétiques').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Tout')).toBeDefined()
  })
})
