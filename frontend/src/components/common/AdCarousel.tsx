import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import adsData from "@/constants/ads.json";

// Add a top container for the ad carousel
const TopAdContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 400px;
  margin: 0 auto 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 150px;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background: white;
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const AdSlide = styled.div<{ background: string; isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.8s ease-in-out;
  animation: ${props => props.isActive ? css`${fadeIn} 0.8s ease-out` : 'none'};
`;

const AdImage = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const AdTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin: 0 0 0.25rem;
  }
`;

const AdDescription = styled.p`
  font-size: 1rem;
  margin: 0 0 1rem;
  opacity: 0.9;
  max-width: 300px;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin: 0 0 0.75rem;
    max-width: 250px;
  }
`;

const AdButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    bottom: 15px;
    gap: 0.5rem;
  }
`;

const Dot = styled.button<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
  
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

interface Ad {
  id: string;
  title: string;
  description: string;
  cta: string;
  color: string;
}

interface AdCarouselProps {
  className?: string;
}

export default function AdCarousel({ className }: AdCarouselProps) {
  const [currentAd, setCurrentAd] = useState(0);
  const [progress, setProgress] = useState(0);
  const ads: Ad[] = adsData;
  const SLIDE_DURATION = 5000; // 5 seconds

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [ads.length]);

  // Progress bar animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentAd]);

  const handleDotClick = (index: number) => {
    setCurrentAd(index);
    setProgress(0);
  };

  const handleAdClick = () => {
    console.log(`Clicked ad: ${ads[currentAd].title}`);
  };

  const getAdIcon = (id: string) => {
    const icons = {
      "1": "🏠",
      "2": "🔧", 
      "3": "💳",
    };
    return icons[id as keyof typeof icons] || "🏠";
  };

  return (
    <TopAdContainer className={className}>
      <CarouselContainer>
        {ads.map((ad, index) => (
          <AdSlide
            key={ad.id}
            background={ad.color}
            isActive={index === currentAd}
          >
            <AdImage>
              {getAdIcon(ad.id)}
            </AdImage>
            <AdTitle>{ad.title}</AdTitle>
            <AdDescription>{ad.description}</AdDescription>
            <AdButton onClick={handleAdClick}>
              {ad.cta}
            </AdButton>
          </AdSlide>
        ))}
        
        <DotsContainer>
          {ads.map((_, index) => (
            <Dot
              key={index}
              isActive={index === currentAd}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </DotsContainer>
        
        <ProgressBar progress={progress} />
      </CarouselContainer>
    </TopAdContainer>
  );
}