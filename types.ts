import { Vector3 } from 'three';

export interface Project {
  name: string;
  url: string;
  description?: string;
  category?: 'DeFi' | 'NFT' | 'Infrastructure' | 'Social' | 'Gaming' | 'Wallet';
}

export interface ProjectNode extends Project {
  id: number;
  position: Vector3;
  color: string;
}

export type FilterType = 'All' | 'DeFi' | 'NFT' | 'Infrastructure' | 'Gaming' | 'Social' | 'Wallet';