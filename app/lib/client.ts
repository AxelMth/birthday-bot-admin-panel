import { initClient } from '@ts-rest/core';
import { peopleContract } from '@birthday-bot-monorepo/contracts';

const baseUrl = import.meta.env.VITE_SERVER_URL;
export const peopleClient = initClient(peopleContract, {
  baseUrl,
  jsonQuery: true,
  validateResponse: true,
  baseHeaders: {
    'Content-Type': 'application/json',
    'Allow-Control-Allow-Origin': '*',
  },
});
