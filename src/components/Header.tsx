import { useState } from 'react';
import { Menu, X, TreePine, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header = ({ onLoginClick, onRegisterClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center group-hover:bg-forest-light transition-colors">
              <TreePine className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-foreground leading-tight">Tree Suites</h1>
              <p className="text-xs text-muted-foreground">Next Airport Inn</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+1234567890" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+1 234 567 890</span>
            </a>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="sm" onClick={onLoginClick}>
              <User className="w-4 h-4 mr-1" />
              Login
            </Button>
            <Button variant="gold" size="sm" onClick={onRegisterClick}>
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="border-t border-border my-2" />
              <div className="flex gap-2 px-4">
                <Button variant="outline" className="flex-1" onClick={onLoginClick}>
                  Login
                </Button>
                <Button variant="gold" className="flex-1" onClick={onRegisterClick}>
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
