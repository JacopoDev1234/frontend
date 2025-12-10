// src/pages/Wallet.jsx
import React, { useEffect, useState } from 'react';
import { pokemonService } from '../services/pokemonService';

const ITEMS_PER_PAGE = 18;

export default function Wallet() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [page, setPage] = useState(1);

  const loadCards = async () => {
    setError('');
    try {
      setLoading(true);
      const data = await pokemonService.getMyCards();
      setCards(data || []);
      setPage(1); // ogni volta che ricarico, torno a pagina 1
    } catch (err) {
      setError(err.message || 'Errore nel caricamento del wallet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Vuoi davvero rimuovere questa carta dal wallet?')) {
      return;
    }

    setDeletingId(id);
    try {
      await pokemonService.deleteCard(id);
      setCards((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        // se la pagina corrente rimane senza elementi, torno indietro
        const totalPages = Math.max(
          1,
          Math.ceil(updated.length / ITEMS_PER_PAGE)
        );
        if (page > totalPages) {
          setPage(totalPages);
        }
        return updated;
      });
    } catch (err) {
      alert(err.message || 'Errore nella cancellazione.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalEstimatedValue = cards.reduce((sum, card) => {
    const value =
      typeof card.estimatedMarketPrice === 'number'
        ? card.estimatedMarketPrice
        : 0;
    return sum + value;
  }, 0);

  // calcolo pagine
  const totalPages = Math.max(1, Math.ceil(cards.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleCards = cards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleChangePage = (direction) => {
    const nextPage = page + direction;
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Il mio PokéWallet</h2>
        <p className="page-subtitle">
          Qui vedi tutte le carte che hai aggiunto dal motore di ricerca.
        </p>
      </header>

      {loading && <p>Carico le tue carte...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && cards.length === 0 && !error && (
        <p className="muted-text">
          Non hai ancora carte nel wallet. Vai nella pagina &quot;Ricerca carte&quot; e
          aggiungi le tue preferite!
        </p>
      )}

      {!loading && cards.length > 0 && (
        <>
          <div
            className="section-card"
            style={{ marginBottom: 16, padding: 12 }}
          >
            <h3 className="section-title">Riepilogo</h3>
            <p className="section-description">
              Carte salvate: <strong>{cards.length}</strong>
            </p>
            <p className="section-description">
              Valore stimato totale (somma dei market price):{' '}
              <strong>€ {totalEstimatedValue.toFixed(2)}</strong>
            </p>
          </div>

          <div className="section-card" style={{ padding: 12 }}>
            <h3 className="section-title">Carte nel wallet</h3>
            <div className="pokemon-grid">
              {visibleCards.map((card) => (
                <div key={card.id} className="pokemon-card">
                  <div className="pokemon-card-header">
                    <div>
                      <h4 className="pokemon-card-title">{card.name}</h4>
                      {card.setName && (
                        <div className="pokemon-meta">
                          Set: <strong>{card.setName}</strong>
                          {card.number ? ` · #${card.number}` : ''}
                        </div>
                      )}
                      {card.rarity && (
                        <div className="pokemon-meta">
                          Rarità: {card.rarity}
                        </div>
                      )}
                      {card.condition && (
                        <div className="pokemon-meta">
                          Condizione: {card.condition}
                        </div>
                      )}
                      {card.language && (
                        <div className="pokemon-meta">
                          Lingua: {card.language}
                        </div>
                      )}
                      {typeof card.estimatedMarketPrice === 'number' && (
                        <div className="pokemon-price">
                          Valore stimato: € {card.estimatedMarketPrice}
                        </div>
                      )}
                      {typeof card.purchasePrice === 'number' && (
                        <div className="pokemon-meta">
                          Pagata: € {card.purchasePrice}
                        </div>
                      )}
                    </div>
                  </div>

                  {card.imageUrl && (
                    <div className="pokemon-image-wrapper">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="pokemon-image"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(card.id)}
                    disabled={deletingId === card.id}
                  >
                    {deletingId === card.id
                      ? 'Rimuovo...'
                      : 'Rimuovi dal wallet'}
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINAZIONE */}
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => handleChangePage(-1)}
              >
                ← Pagina precedente
              </button>

              <span className="pagination-info">
                Pagina {page} di {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={page === totalPages}
                onClick={() => handleChangePage(1)}
              >
                Pagina successiva →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
