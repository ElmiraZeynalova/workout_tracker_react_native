export type Destination =
  | { type: 'index'; date?: string }
  | { type: 'calendar' }
  | { type: 'invite'; token: string }
