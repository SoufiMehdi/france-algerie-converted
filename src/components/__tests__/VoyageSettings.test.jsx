import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VoyageSettings from '../VoyageSettings'

const voyage = {
  id: 1,
  exchangeRate: 154.5,
  profitMargin: 50,
}

describe('VoyageSettings', () => {
  it('renders current values', () => {
    render(<VoyageSettings voyage={voyage} onSave={() => {}} onCancel={() => {}} />)
    expect(screen.getByDisplayValue('154.5')).toBeDefined()
    expect(screen.getByDisplayValue('50')).toBeDefined()
  })

  it('renders save and cancel buttons', () => {
    render(<VoyageSettings voyage={voyage} onSave={() => {}} onCancel={() => {}} />)
    expect(screen.getByText('Sauvegarder')).toBeDefined()
    expect(screen.getByText('Annuler')).toBeDefined()
  })

  it('calls onCancel when cancel is clicked', () => {
    let called = false
    render(<VoyageSettings voyage={voyage} onSave={() => {}} onCancel={() => { called = true }} />)
    screen.getByText('Annuler').click()
    expect(called).toBe(true)
  })
})
