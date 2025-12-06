import React, { useEffect, useState } from 'react';
import PokemonCardForm from '../components/Pokemon/PokemonCardForm';
import PokemonCardList from '../components/Pokemon/PokemonCardList';
import { pokemonService } from '../services/pokemonService';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCards() {
      setLoading(true);
      setError('');
      try {
        const data = await pokemonService.getMyCards();
        setCards(data);
      } catch (e) {
        setError(e.message || 'Errore nel caricamento del wallet');
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, []);

  const handleAddCard = async (formData) => {
    setError('');
    try {
      const newCard = await pokemonService.addCard(formData);
      setCards((prev) => [...prev, newCard]);
    } catch (e) {
      setError(e.message || 'Errore nell’aggiunta della carta');
    }
  };

  const handleDeleteCard = async (id) => {
    setError('');
    try {
      await pokemonService.deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e.message || 'Errore nell’eliminazione della carta');
    }
  };

  return (
    <div className="page">
      <div>
        <h2 className="page-title">Il tuo wallet di carte Pokémon</h2>
        <p className="page-subtitle">
          Aggiungi le tue carte, tieni traccia del valore stimato e delle tue collezioni.
        </p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">Aggiungi una carta</h3>
            <p className="section-description">
              Inserisci i dati principali; in futuro potremo collegare Cardmarket per arricchire i dettagli.
            </p>
          </div>
        </div>

        <PokemonCardForm onSubmit={handleAddCard} />
      </div>

      <div className="section-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">Le tue carte</h3>
            <p className="section-description">
              Visualizza e gestisci il tuo portafoglio di carte Pokémon.
            </p>
          </div>
        </div>

        {loading && <p className="loading-text">Caricamento in corso...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && (
          <PokemonCardList cards={cards} onDelete={handleDeleteCard} />
        )}
      </div>
    </div>
  );
}
