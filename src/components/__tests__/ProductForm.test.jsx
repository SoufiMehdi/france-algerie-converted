import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductForm from '../ProductForm'

describe('ProductForm', () => {
  it('renders all form fields', () => {
    render(<ProductForm exchangeRate={154.5} profitMargin={50} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/Nom du produit/)).toBeDefined()
    expect(screen.getByLabelText(/Prix en EUR/)).toBeDefined()
    expect(screen.getByLabelText(/Quantité/)).toBeDefined()
    expect(screen.getByLabelText(/Catégorie/)).toBeDefined()
  })

  it('shows preview when price is entered', () => {
    render(<ProductForm exchangeRate={100} profitMargin={50} onSubmit={() => {}} />)
    const priceInput = screen.getByLabelText(/Prix en EUR/)
    // Use nativeInputValueSetter to trigger React state
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set
    nativeSetter.call(priceInput, '10')
    priceInput.dispatchEvent(new Event('input', { bubbles: true }))

    expect(screen.getByText(/Aperçu/)).toBeDefined()
  })
})
