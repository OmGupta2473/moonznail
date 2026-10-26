export function formatOrderNumber(orderNumber: string): string {
  return orderNumber;
}

export function formatToken(token: string): string {
  if (token.length <= 8) return token;
  return `${token.slice(0, 8)}…${token.slice(-4)}`;
}

export function formatAddress(address: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}): string {
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  parts.push(address.city, address.state, address.postal, address.country);
  return parts.join(", ");
}