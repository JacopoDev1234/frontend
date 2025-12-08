// src/components/Pokemon/PokemonCardForm.jsx
import React, { useState } from 'react';
import { pokemonService } from '../../services/pokemonService';

export default function PokemonCardForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    setName: '',
    number: '',
    rarity: '',
    condition: '',
    language: '',
    estimatedMarketPrice: '',
    purchasePrice: '',
    acquisitionDate: '',
    location: '',
    notes: '',
    imageUrl: '',
    externalId: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      estimatedMarketPrice: form.estimatedMarketPrice
        ? parseFloat(form.estimatedMarketPrice)
        : null,
      purchasePrice: form.purchasePrice
        ? parseFloat(form.purchasePrice)
        : null,
    };

    onSubmit(payload);

    setForm({
      name: '',
      setName: '',
      number: '',
      rarity: '',
      condition: '',
      language: '',
      estimatedMarketPrice: '',
      purchasePrice: '',
      acquisitionDate: '',
      location: '',
      notes: '',
      imageUrl: '',
      externalId: '',
    });
    setSearchResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResults([]);
    if (!searchQuery.trim()) {
      setSearchError('Inserisci almeno una parola per la ricerca.');
      return;
    }

    try {
      setSearchLoading(true);
      const data = await pokemonService.searchCards(searchQuery, {
        page: 1,
        pageSize: 8,
      });
      setSearchResults(data.cards || []);
    } catch (err) {
      setSearchError(err.message || 'Errore nella ricerca carte.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectResult = (card) => {
    setForm((prev) => ({
      ...prev,
      name: card.name || prev.name,
      setName: card.setName || prev.setName,
      number: card.number || prev.number,
      rarity: card.rarity || prev.rarity,
      imageUrl: card.imageUrl || prev.imageUrl,
      estimatedMarketPrice:
        card.estimatedMarketPrice != null
          ? String(card.estimatedMarketPrice)
          : prev.estimatedMarketPrice,
      externalId: card.externalId || prev.externalId,
    }));
  };

  return (
    <div className="form">
      {/* BLOCCO: RICERCA CARTA DA API */}
      <div className="section-card" style={{ marginBottom: 16, padding: 12 }}>
        <div className="section-header" style={{ marginBottom: 8 }}>
          <div>
            <h4 className="section-title">Cerca carta da database Pokémon</h4>
            <p className="section-description">
              Usa la ricerca per riempire automaticamente nome, set, numero, rarità, immagine e prezzo stimato.
            </p>
          </div>
        </div>

        <form className="form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-field">
              <span className="form-label">Ricerca</span>
              <input
                type="text"
                className="form-input"
                placeholder="Es. Pikachu, Charizard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="form-field" style={{ alignSelf: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={searchLoading}
              >
                {searchLoading ? 'Cerco...' : 'Cerca'}
              </button>
            </div>
          </div>

          {searchError && <p className="error-text">{searchError}</p>}

          {searchResults.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p className="muted-text">
                Risultati ({searchResults.length}): clicca su una carta per
                compilare il form.
              </p>
              <div className="pokemon-grid">
                {searchResults.map((card) => (
                  <button
                    key={card.externalId}
                    type="button"
                    className="pokemon-card"
                    style={{ textAlign: 'left', cursor: 'pointer' }}
                    onClick={() => handleSelectResult(card)}
                  >
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
                      </div>

                      {card.rarity && (
                        <div className="pokemon-meta">Rarità: {card.rarity}</div>
                      )}

                      {card.estimatedMarketPrice != null && (
                        <div className="pokemon-price">
                          Valore stimato: € {card.estimatedMarketPrice}
                        </div>
                      )}

                      {card.imageUrl && (
                        <div className="pokemon-image-wrapper">
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="pokemon-image"
                          />
                        </div>
                      )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* BLOCCO: FORM PRINCIPALE DI INSERIMENTO */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Nome carta *</span>
            <input
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <span className="form-label">Set</span>
            <input
              name="setName"
              className="form-input"
              value={form.setName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Numero</span>
            <input
              name="number"
              className="form-input"
              value={form.number}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span className="form-label">Rarità</span>
            <input
              name="rarity"
              className="form-input"
              value={form.rarity}
              onChange={handleChange}
              placeholder="Common, Rare, Ultra Rare..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Condizione</span>
            <input
              name="condition"
              className="form-input"
              value={form.condition}
              onChange={handleChange}
              placeholder="Near Mint, Light Played..."
            />
          </div>

          <div className="form-field">
            <span className="form-label">Lingua</span>
            <input
              name="language"
              className="form-input"
              value={form.language}
              onChange={handleChange}
              placeholder="IT, EN, JP..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Valore stimato (€)</span>
            <input
              type="number"
              step="0.01"
              name="estimatedMarketPrice"
              className="form-input"
              value={form.estimatedMarketPrice}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span className="form-label">Prezzo di acquisto (€)</span>
            <input
              type="number"
              step="0.01"
              name="purchasePrice"
              className="form-input"
              value={form.purchasePrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <span className="form-label">Data di acquisizione</span>
            <input
              type="date"
              name="acquisitionDate"
              className="form-input"
              value={form.acquisitionDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span className="form-label">Luogo / Collezione</span>
            <input
              name="location"
              className="form-input"
              value={form.location}
              onChange={handleChange}
              placeholder="Binder 1, Box PSA..."
            />
          </div>
        </div>

        <div className="form-field">
          <span className="form-label">URL immagine</span>
          <input
            name="imageUrl"
            className="form-input"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-field">
          <span className="form-label">Note</span>
          <textarea
            name="notes"
            className="form-input"
            style={{ minHeight: 60, resize: 'vertical' }}
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* Campo nascosto/tecnico per externalId, già gestito da selectResult */}
        {form.externalId && (
          <p className="muted-text">
            ID esterno: <code>{form.externalId}</code>
          </p>
        )}

        <div>
          <button type="submit" className="btn btn-primary">
            Aggiungi al wallet
          </button>
        </div>
      </form>
    </div>
  );
}
