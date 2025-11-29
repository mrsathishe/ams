import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import adsData from "@/constants/ads.json";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(100%); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

// Mobile Popup Overlay
const PopupOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (min-width: 769px) {
    display: none !important;
  }
`;

const PopupContainer = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70vh;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1001;
  animation: ${slideUp} 0.4s ease-out;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
  
  @media (min-width: 769px) {
    display: none !important;
  }
`;

const CloseButton = styled.button`
  display: flex;
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1002;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }
  
  @media (min-width: 769px) {
    display: none !important;
  }
`;

const CarouselContainer = styled.div<{ isMobile?: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: ${props => props.isMobile ? '20px 20px 0 0' : '16px'};
  box-shadow: ${props => props.isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'};
  background: white;
`;

const AdSlide = styled.div<{ background: string; isActive: boolean; isMobile?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.background};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.isMobile ? 'flex-start' : 'center'};
  align-items: center;
  text-align: center;
  color: white;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.8s ease-in-out;
  animation: ${props => props.isActive ? css`${fadeIn} 0.8s ease-out` : 'none'};
`;

const AdImage = styled.div<{ isMobile?: boolean }>`
  width: ${props => props.isMobile ? '100px' : '120px'};
  height: ${props => props.isMobile ? '100px' : '120px'};
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: ${props => props.isMobile ? '2rem' : '1.5rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  font-size: ${props => props.isMobile ? '2.5rem' : '3rem'};
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

const AdTitle = styled.h3<{ isMobile?: boolean }>`
  font-size: ${props => props.isMobile ? '1.75rem' : '1.5rem'};
  font-weight: 700;
  margin-bottom: ${props => props.isMobile ? '1.5rem' : '1rem'};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const AdDescription = styled.p<{ isMobile?: boolean }>`
  font-size: ${props => props.isMobile ? '1.1rem' : '1rem'};
  line-height: 1.6;
  margin-bottom: ${props => props.isMobile ? '2rem' : '1.5rem'};
  opacity: 0.95;
  max-width: ${props => props.isMobile ? '350px' : '300px'};
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    max-width: 250px;
    margin-bottom: 1.5rem;
  }
`;

const AdButton = styled.button<{ isMobile?: boolean }>`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: ${props => props.isMobile ? '1rem 2rem' : '0.75rem 1.5rem'};
  border-radius: 25px;
  font-weight: 600;
  font-size: ${props => props.isMobile ? '1.1rem' : '1rem'};
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const DotsContainer = styled.div<{ isMobile?: boolean }>`
  position: absolute;
  bottom: ${props => props.isMobile ? '2rem' : '1rem'};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${props => props.isMobile ? '0.75rem' : '0.5rem'};
`;

const Dot = styled.button<{ isActive: boolean; isMobile?: boolean }>`
  width: ${props => props.isMobile ? '16px' : '12px'};
  height: ${props => props.isMobile ? '16px' : '12px'};
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.7);
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

// Mobile trigger button to show popup
const MobileAdButton = styled.button<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 1.8rem;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  cursor: pointer;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.7);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Pulse animation to draw attention */
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.3;
    animation: ${pulse} 2s infinite;
    z-index: -1;
  }
  
  @media (min-width: 769px) {
    display: none !important;
  }
`;

// Icon components for different ad types
const getAdIcon = (id: number): string => {
  const icons = {
    1: "🏢", // Smart Building
    2: "💳", // Digital Payment
    3: "🤝", // Community Connect
    4: "🔧", // Maintenance
    5: "🔒"  // Security
  };
  return icons[id as keyof typeof icons] || "🏠";
};

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  cta: string;
  color: string;
}

interface AdCarouselProps {
  className?: string;
}

export default function AdCarousel({ className }: AdCarouselProps) {
  const [currentAd, setCurrentAd] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const ads: Ad[] = adsData;
  const SLIDE_DURATION = 5000; // 5 seconds

  // Detect mobile screen size and auto-open popup on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-open popup on mobile devices
      if (mobile) {
        setIsPopupOpen(true);
      } else {
        setIsPopupOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [ads.length]);

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
    console.log(`Clicked on ad: ${ads[currentAd].title}`);
    // Handle ad click - could open modal, navigate to page, etc.
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on overlay, not on popup content
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  // Desktop version (unchanged)
  if (!isMobile) {
    return (
      <CarouselContainer className={className}>
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
    );
  }

  // Mobile version with popup
  return (
    <>
      <MobileAdButton isVisible={!isPopupOpen} onClick={openPopup}>
        📢
      </MobileAdButton>

      <PopupOverlay isOpen={isPopupOpen} onClick={handleOverlayClick} />
      
      <PopupContainer isOpen={isPopupOpen}>
        <CloseButton onClick={closePopup}>
          ✕
        </CloseButton>
        
        <CarouselContainer isMobile>
          {ads.map((ad, index) => (
            <AdSlide
              key={ad.id}
              background={ad.color}
              isActive={index === currentAd}
              isMobile
            >
              <AdImage isMobile>
                {getAdIcon(ad.id)}
              </AdImage>
              <AdTitle isMobile>{ad.title}</AdTitle>
              <AdDescription isMobile>{ad.description}</AdDescription>
              <AdButton onClick={handleAdClick} isMobile>
                {ad.cta}
              </AdButton>
            </AdSlide>
          ))}
          
          <DotsContainer isMobile>
            {ads.map((_, index) => (
              <Dot
                key={index}
                isActive={index === currentAd}
                onClick={() => handleDotClick(index)}
                isMobile
              />
            ))}
          </DotsContainer>
          
          <ProgressBar progress={progress} />
        </CarouselContainer>
      </PopupContainer>
    </>
  );
}