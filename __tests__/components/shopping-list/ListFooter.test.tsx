import { render } from '@testing-library/react-native';
import React from 'react';
import { ListFooter } from '../../../components/shopping-list/ListFooter';
import type { CartTotals } from '../../../components/shopping-list/list-utils';

const mockTotals: CartTotals = {
  totalCount: 5,
  listedCount: 3,
  cartCount: 2,
  totalCost: 42.5,
  cartCost: 15.99,
};

describe('ListFooter', () => {
  it('renders total and cart panels', () => {
    const { getByText } = render(
      <ListFooter totals={mockTotals} totalLabel='Total' pickedLabel='Pego' itemsLabel='itens' />,
    );

    expect(getByText('Total')).toBeTruthy();
    expect(getByText('Pego')).toBeTruthy();
  });

  it('displays correct counts', () => {
    const { getByText } = render(
      <ListFooter totals={mockTotals} totalLabel='Total' pickedLabel='Pego' itemsLabel='itens' />,
    );

    expect(getByText('5 itens')).toBeTruthy();
    expect(getByText('2 itens')).toBeTruthy();
  });

  it('displays costs', () => {
    const { getByText } = render(
      <ListFooter totals={mockTotals} totalLabel='Total' pickedLabel='Pego' itemsLabel='itens' />,
    );

    const costElements = getByText(/42,50/);
    expect(costElements).toBeTruthy();
  });

  it('handles zero items', () => {
    const zeroTotals: CartTotals = {
      totalCount: 0,
      listedCount: 0,
      cartCount: 0,
      totalCost: 0,
      cartCost: 0,
    };

    const { getAllByText } = render(
      <ListFooter totals={zeroTotals} totalLabel='Total' pickedLabel='Pego' itemsLabel='itens' />,
    );

    expect(getAllByText('0 itens')).toHaveLength(2);
  });
});
