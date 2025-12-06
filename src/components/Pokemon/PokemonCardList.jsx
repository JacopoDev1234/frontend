import React from 'react';
import PokemonCardItem from './PokemonCardItem';

export default function PokemonCardList({ cards, onDelete }) {
  if (!cards || cards.length === 0) {
    return <p className="muted-text">Non hai ancora nessuna carta nel wallet.</p>;
  }

  return (
    <div className="pokemon-grid">
      {cards.map((card) => (
        <PokemonCardItem
          key={card.id}
          card={card}
          onDelete={onDelete ? () => onDelete(card.id) : undefined}
        />
      ))}
    </div>
  );
}
