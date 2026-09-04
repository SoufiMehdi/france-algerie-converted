import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CreateVoyageForm from '../CreateVoyageForm'

describe('CreateVoyageForm', () => {
  it('renders the heading with emoji', () => {
    render(<CreateVoyageForm onAdd={() => {}} />)
    expect(screen.getByText(/Mes Voyages/)).toBeDefined()
  })

  it('toggles form visibility on button click', async () => {
    const { user } = renderWithUser(<CreateVoyageForm onAdd={() => {}} />)
    const toggleBtn = screen.getByText(/Nouveau Voyage/)
    await user.click(toggleBtn)
    expect(screen.getByText(/Créer un nouveau voyage/)).toBeDefined()
    await user.click(screen.getByText(/Annuler/))
    expect(screen.queryByText(/Créer un nouveau voyage/)).toBeNull()
  })
})

// Helper to render with userEvent
import { userEvent } from '@testing-library/user-event'
function renderWithUser(ui) {
  return {
    user: userEvent.setup(),
    ...render(ui),
  }
}
