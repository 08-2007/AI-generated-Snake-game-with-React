export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
