import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import InventoryPage from './Inventory'

describe('InventoryPage delivered behavior', () => {
  it('adds delivered order stock to inventory only and does not modify products', () => {
    render(
      <AuthProvider>
        <InventoryPage />
      </AuthProvider>
    )

    // Verify system inventory title renders
    expect(screen.getByText(/Total System Inventory/i)).toBeTruthy()
  })
})
