import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import SalesCustomersPage from './Customers'

describe('Sales customers page', () => {
  it('renders the shared customers experience for sales users', () => {
    render(
      <AuthProvider>
        <SalesCustomersPage />
      </AuthProvider>,
    )

    expect(screen.getByText('Customers')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search by name, phone or email')).toBeTruthy()
  })
})
