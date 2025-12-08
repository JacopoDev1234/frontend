// src/services/pokemonService.js
import { apiClient } from './apiClient';

export const pokemonService = {
  async getMyCards() {
    // prende solo le collectible di tipo 'pokemon_card'
    return apiClient.get('/collectibles', {
      params: { type: 'pokemon_card' },
    });
  },

  async addCard(formData) {
    const payload = {
      type: 'pokemon_card',
      name: formData.name,
      setName: formData.setName || null,
      number: formData.number || null,
      rarity: formData.rarity || null,
      condition: formData.condition || null,
      language: formData.language || null,
      purchasePrice: formData.purchasePrice || null,
      estimatedMarketPrice: formData.estimatedMarketPrice || null,
      acquisitionDate: formData.acquisitionDate || null,
      location: formData.location || null,
      notes: formData.notes || null,
      externalId: formData.externalId || null,
      imageUrl: formData.imageUrl || null,
      extraData: formData.extraData || null,
    };

    return apiClient.post('/collectibles', payload);
  },

  async deleteCard(id) {
    return apiClient.delete(`/collectibles/${id}`);
  },

  async searchCards(filters, { page = 1, pageSize = 10 } = {}) {
    const { name, setName, rarity } = filters || {};

    if (!name || !name.trim()) {
      throw new Error("Il campo 'Nome' è obbligatorio per la ricerca.");
    }

    const data = await apiClient.get('/pokemon/search', {
      params: {
        name: name.trim(),
        setName: setName?.trim() || undefined,
        rarity: rarity?.trim() || undefined,
        page,
        pageSize,
      },
    });

    return data; // { total, count, cards: [...] }
  },
};
