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
  id: number;
  title: string;
  game: string;
  imageUrl: string;
  price?: string;
}