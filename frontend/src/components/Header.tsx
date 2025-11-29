import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

interface HeaderProps {
  variant?: "default" | "auth";
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div<{ isAuth?: boolean }>`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 4rem;
  width: auto;
  margin-right: 1rem;
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.05em;
`;

const Tagline = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const ContactIcon = styled.div`
  width: 1rem;
  height: 1rem;
  color: #3b82f6;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
  }
`;

const ProfileSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ProfileImage = styled.div<{ src?: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ProfileName = styled.span`
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
`;

const ChevronIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  color: #64748b;
  transition: transform 0.2s;
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 50;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(8px)' : 'translateY(0)'};
  transition: all 0.2s;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
    color: #dc2626;
  }
`;

export default function Header({ variant = "default", user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleProfileEdit = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (variant === "auth") {
    return (
      <HeaderContainer>
        <HeaderContent>
          <LogoSection>
            <Logo src={logo} alt="APTSYNC" />
            <BrandSection>
              <BrandName>APTSYNC</BrandName>
              <Tagline>Manage Easy</Tagline>
            </BrandSection>
          </LogoSection>
          <RightSection>
            <ContactInfo>
              <ContactItem>
                <ContactIcon>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.16 10.96c1.558 3.502 4.372 6.316 7.874 7.874l1.573-2.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 3V2a2 2 0 012-2z" />
                  </svg>
                </ContactIcon>
                +91 - 97900 60943
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </ContactIcon>
                mrsathishe@gmail.com
              </ContactItem>
            </ContactInfo>
          </RightSection>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Logo src={logo} alt="APTSYNC" />
          <BrandSection>
            <BrandName>APTSYNC</BrandName>
            <Tagline>Manage Easy</Tagline>
          </BrandSection>
        </LogoSection>
        
        <RightSection>
          <ContactInfo>
            <ContactItem>
              <ContactIcon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.16 10.96c1.558 3.502 4.372 6.316 7.874 7.874l1.573-2.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 3V2a2 2 0 012-2z" />
                </svg>
              </ContactIcon>
              +91 - 97900 60943
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </ContactIcon>
              mrsathishe@gmail.com
            </ContactItem>
          </ContactInfo>

          {user ? (
            <ProfileSection ref={dropdownRef}>
              <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <ProfileImage src={user.avatar}>
                  {!user.avatar && getInitials(user.name)}
                </ProfileImage>
                <ProfileName>{user.name}</ProfileName>
                <ChevronIcon
                  style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </ChevronIcon>
              </ProfileButton>
              
              <Dropdown isOpen={isDropdownOpen}>
                <DropdownItem onClick={handleProfileEdit}>
                  Edit Profile
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  Logout
                </DropdownItem>
              </Dropdown>
            </ProfileSection>
          ) : (
            <Navigation>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#about">About</NavLink>
              <Button>Get Started</Button>
            </Navigation>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
}