import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import SalesPOSPage from './POS'

describe('Sales POS page', () => {
  it('renders the shared point of sale experience for sales users', () => {
    render(
      <AuthProvider>
        <SalesPOSPage />
      </AuthProvider>,
    )

    expect(screen.getByText(/POS Terminal Software/i)).toBeTruthy()
    expect(screen.getByText(/Live Terminal/i)).toBeTruthy()
  })
})
