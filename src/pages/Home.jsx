// src/pages/Home.jsx
import React, { useState } from 'react';
import { pokemonService } from '../services/pokemonService';
import { POKEMON_SETS } from '../constants/pokemonSets';

// quante carte per pagina nei risultati
const PAGE_SIZE = 18;

// lista ampia di rarità (puoi estenderla se ne incontri altre)
const POKEMON_RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Ultra',
  'Rare Secret',
  'Rare Rainbow',
  'Double Rare',
  'Ultra Rare',
  'Secret Rare',
  'Illustration Rare',
  'Special Illustration Rare',
  'Hyper Rare',
  'Promo',
  'Shiny Rare',
  'Shiny Ultra Rare',
  'Amazing Rare',
  'Radiant Rare',
];

export default function Home() {
  const [filters, setFilters] = useState({
    name: '',
    setName: '',
    rarity: '',
  });

  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState('');
  const [savingId, setSavingId] = useState(null);

  // stato per la paginazione
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // funzione che esegue davvero la ricerca su una pagina specifica
  const performSearch = async (pageToLoad = 1) => {
    setErrorSearch('');
    setResults([]);

    try {
      setLoadingSearch(true);
      const data = await pokemonService.searchCards(filters, {
        page: pageToLoad,
        pageSize: PAGE_SIZE,
      });

      const cards = data.cards || [];
      setResults(cards);
      setPage(pageToLoad);

      // se la pagina è piena, presumiamo che esista una pagina successiva
      const count = typeof data.count === 'number' ? data.count : cards.length;
      setHasNextPage(count === PAGE_SIZE);
    } catch (err) {
      setErrorSearch(err.message || 'Errore nella ricerca carte.');
      setHasNextPage(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(1); // ogni nuova ricerca parte dalla pagina 1
  };

  const handleChangePage = async (direction) => {
    const newPage = page + direction;
    if (newPage < 1) return;
    // se sto andando avanti ma non ho next page, non faccio nulla
    if (direction > 0 && !hasNextPage) return;

    await performSearch(newPage);
  };

  const handleAddToWallet = async (card) => {
    setSavingId(card.externalId);
    try {
      await pokemonService.addCard({
        name: card.name,
        setName: card.setName,
        number: card.number,
        rarity: card.rarity,
        condition: '',
        language: '',
        estimatedMarketPrice:
          card.estimatedMarketPrice ?? null,
        purchasePrice: null,
        acquisitionDate: '',
        location: '',
        notes: '',
        imageUrl: card.imageUrl,
        externalId: card.externalId,
        extraData: null,
      });
    } catch (err) {
      alert(err.message || "Errore nell'aggiunta al wallet.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Ricerca carte Pokémon</h2>
        <p className="page-subtitle">
          Cerca carte dal database e aggiungile al tuo PokéWallet.
        </p>
      </header>

      <div className="section-card">
        <h3 className="section-title">Filtri di ricerca</h3>
        <p className="section-description">
          Inserisci almeno il nome della carta. Puoi restringere la ricerca selezionando il set e/o la rarità.
        </p>

        <form className="form" onSubmit={handleSearch}>
          {/* NOME CARTA */}
          <div className="form-row">
            <div className="form-field">
              <span className="form-label">Nome carta *</span>
              <input
                name="name"
                className="form-input"
                value={filters.name}
                onChange={handleChange}
                placeholder="Es. Charizard, Pikachu, Solosis..."
                required
              />
            </div>
          </div>

          {/* SET + RARITÀ */}
          <div className="form-row">
            <div className="form-field">
              <span className="form-label">Set (opzionale)</span>
              <select
                name="setName"
                className="form-input"
                value={filters.setName}
                onChange={handleChange}
              >
                <option value="">— Nessun filtro set —</option>
                {POKEMON_SETS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <span className="form-label">Rarità (opzionale)</span>
              <select
                name="rarity"
                className="form-input"
                value={filters.rarity}
                onChange={handleChange}
              >
                <option value="">— Tutte le rarità —</option>
                {POKEMON_RARITIES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingSearch}
            >
              {loadingSearch ? 'Cerco...' : 'Cerca'}
            </button>
          </div>

          {errorSearch && <p className="error-text">{errorSearch}</p>}
        </form>
      </div>

      {/* RISULTATI */}
      {results.length > 0 && (
        <div className="section-card">
          <h3 className="section-title">Risultati</h3>
          <p className="section-description">
            Clicca su &quot;Aggiungi al wallet&quot; per salvare una carta nella tua collezione.
          </p>

          <div className="pokemon-grid">
            {results.map((card) => (
              <div key={card.externalId} className="pokemon-card">
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
                    <div className="pokemon-price">
                      Valore stimato:{' '}
                      {card.estimatedMarketPrice != null
                        ? `€ ${card.estimatedMarketPrice}`
                        : 'N/D'}
                    </div>
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
                  className="btn btn-secondary"
                  onClick={() => handleAddToWallet(card)}
                  disabled={savingId === card.externalId}
                >
                  {savingId === card.externalId
                    ? 'Aggiungo...'
                    : 'Aggiungi al wallet'}
                </button>
              </div>
            ))}
          </div>

          {/* PAGINAZIONE */}
          <div className="pagination">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleChangePage(-1)}
              disabled={page === 1 || loadingSearch}
            >
              ← Pagina precedente
            </button>

            <span className="pagination-info">
              Pagina {page}
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleChangePage(1)}
              disabled={!hasNextPage || loadingSearch}
            >
              Pagina successiva →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
