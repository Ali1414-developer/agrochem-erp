import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CustomerDetailsModal from './CustomerDetailsModal'

describe('CustomerDetailsModal', () => {
  it('does not match sales with missing email/phone to customers with missing email/phone', () => {
    const customer = {
      id: 'c10',
      name: 'Test Customer',
      phone: '03145323454',
      email: '', // empty email
    }

    const sales = [
      {
        id: 'sale1',
        invoice: 'INV-100',
        customerId: 'c10',
        customerName: 'Test Customer',
        customerPhone: '03145323454',
        customerEmail: '',
        total: 40000,
      },
      {
        id: 'sale2',
        invoice: 'INV-158-UNRELATED',
        customerId: 'c_other',
        customerName: 'Other Customer',
        customerPhone: '03000000000',
        customerEmail: '', // empty email - should NOT match!
        total: 158,
      },
    ]

    render(
      <CustomerDetailsModal
        open={true}
        onClose={() => {}}
        customer={customer}
        sales={sales}
      />
    )

    // Should show INV-100 (Rs 40,000)
    expect(screen.getByText('INV-100')).toBeTruthy()
    expect(screen.getAllByText('Rs 40,000').length).toBeGreaterThan(0)

    // Should NOT show INV-158-UNRELATED
    expect(screen.queryByText('INV-158-UNRELATED')).toBeNull()
    expect(screen.queryByText('Rs 158')).toBeNull()
  })
})
