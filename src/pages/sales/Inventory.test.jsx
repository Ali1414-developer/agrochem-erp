import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import Inventory from './Inventory'

describe('Sales inventory page', () => {
  it('shows shared inventory data in a read-only view', () => {
    render(
      <AuthProvider>
        <Inventory />
      </AuthProvider>,
    )

    expect(screen.getByText(/sales inventory/i)).toBeTruthy()
    expect(screen.getByText(/read-only view/i)).toBeTruthy()
    expect(screen.getAllByText(/cropcare 250/i).length).toBeGreaterThan(0)
  })
})
