export interface PanelState {
  humidity: number
  proseBefore: string
  proseAfter: string
  ctaHref: string
}

export function getPanelState(_metOfficeData?: unknown): PanelState {
  return {
    humidity: 38,
    proseBefore: 'Indoor relative humidity across the UK is sitting at around',
    proseAfter: 'right now — well below the 50% threshold where glycerin-based products start working with your hair rather than against it. If your wash-and-go has been reverting faster than usual, or your ends feel papery by day two, this is probably why.',
    ctaHref: '/method/uk-humidity',
  }
}
