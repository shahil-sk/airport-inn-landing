import { TreePine, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Book Now', href: '#home' },
  ];

  const roomTypes = [
    'Suite Room',
    'Mini Suite Room',
    'Junior Suite Room',
    'Deluxe AC Room',
    'Deluxe Non-AC Room',
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-forest-dark text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                <TreePine className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Tree Suites</h3>
                <p className="text-sm text-primary-foreground/70">Next Airport Inn</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Experience luxury and nature in perfect harmony. Your ideal stay awaits just minutes from the airport.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-gold flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Room Types */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Room Types</h4>
            <ul className="space-y-3">
              {roomTypes.map((room) => (
                <li key={room}>
                  <a
                    href="#rooms"
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {room}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  123 Forest Road, Near Airport Terminal 2, City Name, State 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:+1234567890" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  +1 234 567 890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:reservations@treesuites.com" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  reservations@treesuites.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} Tree Suites Next Airport Inn. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
