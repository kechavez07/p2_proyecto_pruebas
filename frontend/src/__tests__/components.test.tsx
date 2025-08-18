import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PinCard from '../components/PinCard';
import UploadModal from '../components/UploadModal';
import UserProfile from '../components/UserProfile';

describe('PinCard', () => {
  it('renderiza el título y autor', () => {
    render(
      <PinCard
        id="1"
        imageUrl="/test.jpg"
        title="Test Pin"
        author={{ name: 'Autor Prueba' }}
      />
    );
    expect(screen.getByText('Test Pin')).toBeInTheDocument();
    expect(screen.getByText('Autor Prueba')).toBeInTheDocument();
  });
});

describe('UploadModal', () => {
  it('muestra el botón para abrir el modal', () => {
    render(<UploadModal />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('UserProfile', () => {
  it('muestra el nombre y username del usuario', () => {
    render(
      <UserProfile
        user={{
          id: '1',
          name: 'Usuario Test',
          username: 'usertest',
          followersCount: 0,
          followingCount: 0,
          pinsCount: 0,
        }}
        userPins={{ total: 0, pins: [] }}
        savedPins={[]}
      />
    );
    expect(screen.getByText('Usuario Test')).toBeInTheDocument();
    expect(screen.getByText('@usertest')).toBeInTheDocument();
  });
});
