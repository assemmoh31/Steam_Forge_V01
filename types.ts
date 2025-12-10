import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ToolFeature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
  path: string;
}

export interface BackgroundItem {
  id: number | string;
  title: string;
  game: string;
  gameId?: string | number;
  imageUrl: string;
  price?: string;
  tags?: string[];
}