import React, { useState } from 'react';

export default function PokemonCardForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    setName: '',
    number: '',
    rarity: '',
    condition: '',
    estimatedMarketPrice: '',
    imageUrl: '',
  });

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
    };

    onSubmit(payload);

    setForm({
      name: '',
      setName: '',
      number: '',
      rarity: '',
      condition: '',
      estimatedMarketPrice: '',
      imageUrl: '',
    });
  };

  return (
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
            placeholder="Common, Uncommon, Rare..."
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
            placeholder="Near Mint, Played..."
          />
        </div>

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

      <div>
        <button type="submit" className="btn btn-primary">
          Aggiungi al wallet
        </button>
      </div>
    </form>
  );
}
