import React from 'react';
import { InteractiveHero } from './InteractiveHero';

interface HeroSectionProps {
  onGoToPricing?: () => void;
  onGoToDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToPricing,
  onGoToDemo,
}) => {
  return (
    <InteractiveHero 
      onGoToPricing={onGoToPricing} 
      onGoToDemo={onGoToDemo} 
    />
  );
};

export default HeroSection;
