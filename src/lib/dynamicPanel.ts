export interface PanelState {
  humidity: number
  prose: string
  ctaHref: string
}

export function getPanelState(_metOfficeData?: unknown): PanelState {
  return {
    humidity: 38,
    prose: 'Indoor relative humidity across the UK is sitting at around <strong>38%</strong> right now — well below the 50% threshold where glycerin-based products start working with your hair rather than against it. If your wash-and-go has been reverting faster than usual, or your ends feel papery by day two, this is probably why.',
    ctaHref: '/method/uk-humidity',
  }
}
