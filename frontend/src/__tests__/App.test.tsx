import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  it('debe renderizar el título principal', () => {
    render(<App />);
    expect(screen.getByText(/PinBoard/i)).toBeInTheDocument();
  });
});
