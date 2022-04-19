export function extractHashRoute(asPath: String) {
  /* the operation we need is
  - "comment" -- main comment
  - "related-comment/[id]" -- related comment
  - "provider-comment/[id]" -- provider comment
  */

  if (asPath.includes('#')) {
    const h = asPath.split('#')[1];
    if (h?.includes('/')) {
      return h.split('/');
    }
    return [h];
  }
  return [];
}
