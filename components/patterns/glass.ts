// Glass without backdrop-filter, for surfaces over static content (GLASS_SYSTEM rule 2: the blur budget is
// for surfaces over moving WebGL). Same material otherwise: tint, edge, top highlight, sheen, shadow.
export const flat = '![-webkit-backdrop-filter:none] ![backdrop-filter:none]'
/** Flat below lg, where no fixed WebGL stage sits behind the surface. */
export const flatBelowLg = '[@media(max-width:1023px)]:![-webkit-backdrop-filter:none] [@media(max-width:1023px)]:![backdrop-filter:none]'
