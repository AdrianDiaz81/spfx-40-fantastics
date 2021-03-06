/**
 * @file
 * 3D Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
export interface ISyntaxHighlighterWebPartProps {
  code: string;
  language: string;
  theme: string;
  toolbar: boolean;
  gutter: boolean;
  autoLinks: boolean;
  smartTabs: boolean;
}
