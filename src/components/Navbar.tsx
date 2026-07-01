'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Trophy, 
  BarChart3,
  Menu,
  X,
  Shield,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rodadas', label: 'Rodadas', icon: Calendar },
  { href: '/selecoes', label: 'Seleções', icon: Shield },
  { href: '/jogadores', label: 'Jogadores', icon: Users },
  { href: '/inadimplencia', label: 'Inadimplência', icon: AlertTriangle },
  { href: '/estatisticas', label: 'Estatísticas', icon: BarChart3 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-copa-black/90 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logos */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/images/logo-copa.png" 
                alt="Copa das Distribuidoras" 
                className="h-12 w-auto"
              />
              <img 
                src="/images/logo-pbrn.png" 
                alt="PB & RN Foods" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Nav Links - Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500/15 text-primary-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Spacer */}
            <div className="w-48" />
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-copa-black/95 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/images/logo-copa.png" 
                alt="Copa das Distribuidoras" 
                className="h-9 w-auto"
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-14 left-0 right-0 z-40 bg-copa-black/98 backdrop-blur-lg border-b border-white/[0.06]"
          >
            <div className="container mx-auto px-3 py-3">
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-500/15 text-primary-500' 
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
}
