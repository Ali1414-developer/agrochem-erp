import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import SalesCategoriesPage from './Categories'

describe('Sales categories page', () => {
  it('renders the shared categories management UI', () => {
    render(
      <AuthProvider>
        <SalesCategoriesPage />
      </AuthProvider>,
    )

    expect(screen.getByText('Categories')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search categories')).toBeTruthy()
  })
})
