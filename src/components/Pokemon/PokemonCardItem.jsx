import React from 'react';

export default function PokemonCardItem({ card, onDelete }) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-card-header">
        <div>
          <h4 className="pokemon-card-title">{card.name}</h4>
          {card.setName && (
            <div className="pokemon-meta">
              Set: <strong>{card.setName}</strong>
              {card.number ? ` · #${card.number}` : ''}
            </div>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            className="icon-button"
            onClick={onDelete}
            title="Rimuovi carta"
          >
            ×
          </button>
        )}
      </div>

      <div className="pokemon-meta">
        {card.rarity && <span>Rarità: {card.rarity}</span>}
        {card.condition && (
          <>
            {' · '}
            <span>Condizione: {card.condition}</span>
          </>
        )}
      </div>

      {card.estimatedMarketPrice != null && (
        <div className="pokemon-price">
          Valore stimato: € {card.estimatedMarketPrice}
        </div>
      )}

      {card.imageUrl && (
        <div className="pokemon-image-wrapper">
          <img src={card.imageUrl} alt={card.name} className="pokemon-image" />
        </div>
      )}
    </div>
  );
}
