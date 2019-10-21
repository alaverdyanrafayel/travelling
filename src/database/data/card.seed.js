import { insertingCustomerUser } from './users.seed';
import { Card } from '../../models/card';

// Copied from pin payment test dashboard
export const pinCustomerCardToken = 'card_5-5fRYLmk7nIFplEG1UkVQ';

const card = new Card();
card.id = 1;
card.card_id = pinCustomerCardToken;
card.is_verified = true;
card.user_id = insertingCustomerUser.id;

export const insertingCard = card;
