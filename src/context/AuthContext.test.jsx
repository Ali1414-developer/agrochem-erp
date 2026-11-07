import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function TestHarness() {
  const { currentUser, login, updateUser } = useAuth()

  return (
    <div>
      <button type="button" onClick={() => login({ email: 'admin@erp.com', password: 'admin@123', remember: false })}>
        Login Admin
      </button>
      <button type="button" onClick={() => login({ email: 'salesman@erp.com', password: 'salesman@123', remember: false })}>
        Login Salesman
      </button>
      <button type="button" onClick={() => updateUser(currentUser.id, { ...currentUser, fullName: 'Updated Admin' })}>
        Update profile
      </button>
      <span data-testid="current-name">{currentUser?.fullName ?? 'guest'}</span>
      <span data-testid="current-role">{currentUser?.role ?? 'guest'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('authenticates a salesman user and stores the salesman role', async () => {
    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /login salesman/i }))

    await waitFor(() => {
      expect(screen.getByTestId('current-name').textContent).toContain('Sales Representative')
      expect(screen.getByTestId('current-role').textContent).toContain('salesman')
    })
  })

  it('keeps the active user in sync after profile updates', async () => {
    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /login admin/i }))

    await waitFor(() => {
      expect(screen.getByTestId('current-name').textContent).toContain('System Administrator')
    })

    fireEvent.click(screen.getByRole('button', { name: /update profile/i }))

    await waitFor(() => {
      expect(screen.getByTestId('current-name').textContent).toContain('Updated Admin')
    })
  })
})
