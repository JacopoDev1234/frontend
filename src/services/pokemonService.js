// src/services/pokemonService.js
import { apiClient } from './apiClient';

export const ITEM_TYPES = {
  POKEMON_CARD: 'pokemon_card',
};

export const pokemonService = {
  getMyCards() {
    return apiClient.get(`/collectibles?type=${ITEM_TYPES.POKEMON_CARD}`);
  },

  addCard(formData) {
    const payload = {
      type: ITEM_TYPES.POKEMON_CARD,
      ...formData,
    };
    return apiClient.post('/collectibles', payload);
  },

  deleteCard(id) {
    return apiClient.delete(`/collectibles/${id}`);
  },
};
