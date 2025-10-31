export const Currencies = [
  { value: 'USD', label: '$ United States Dollar (USD)', locale: 'en-US' },
  { value: 'EUR', label: '€ Euro (EUR)', locale: 'de-DE' },
  { value: 'JPY', label: '¥ Japanese Yen (JPY)', locale: 'ja-JP' },
  { value: 'GBP', label: '£ British Pound Sterling (GBP)', locale: 'en-GB' },
  { value: 'BYN', label: 'Br Belarusian Ruble (BYN)', locale: 'be-BY' },
];

export type Currency = (typeof Currencies)[0];
