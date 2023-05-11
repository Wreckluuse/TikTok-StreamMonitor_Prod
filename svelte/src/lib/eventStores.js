import { writable } from 'svelte/store';

export const evtOpen = writable(false);
export const giftInfo = writable(true);
export const subInfo = writable(true);
export const followInfo = writable(true);
export const shareInfo = writable(true);