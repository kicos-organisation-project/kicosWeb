export const DEFAULT_AVATAR = 'assets/img/default-avatar.png';
export const DEFAULT_PRODUCT = 'assets/img/default-product.png';

export function safeImage(url: string | null | undefined, fallback = DEFAULT_AVATAR): string {
  return url && String(url).trim() ? url : fallback;
}
