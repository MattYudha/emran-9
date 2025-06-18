"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useLanguage } from "../contexts/LanguageContext"
import { translations } from "../utils/translations"
import { supabase } from "../api/supabaseClient"
import Logo from "./Logo"
import LanguageDropdown from "./LanguageDropdown"
import NotificationCenter from "./NotificationCenter"
import AuthModal from "./AuthModal"

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showMobileMegaMenu, setShowMobileMegaMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  const { isDarkMode, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setShowMobileMegaMenu(false)
    }
  }

  const toggleLanguageDropdown = () => setShowLanguageDropdown(!showLanguageDropdown)

  const toggleMobileMegaMenu = () => {
    setShowMobileMegaMenu(!showMobileMegaMenu)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowUserMenu(false)
    navigate("/")
  }

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const navLinks = [
    { name: t.home, href: "/#home" },
    { name: t.services, href: "/#services" },
    { name: t.about, href: "/#about" },
    { name: t.team, href: "/#team" },
    { name: t.portfolio, href: "/#portfolio" },
    { name: t.contact, href: "/#contact" },
  ]

  const megaMenuCategories = [
    {
      title: t.printingServices,
      items: [
        { name: t.businessCards, route: "/business-cards" },
        { name: t.brochures, route: "/brochures" },
        { name: t.flyers, route: "/flyers" },
        { name: t.banners, route: "/banners" },
        { name: t.posters, route: "/posters" },
      ],
    },
    {
      title: t.designServices,
      items: [
        { name: t.logoDesign, route: "/logo-design" },
        { name: t.brandIdentity, route: "/brand-identity" },
        { name: t.packaging, route: "/packaging" },
        { name: t.illustrationService, route: "/illustration" },
      ],
    },
  ]

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-green-800/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-green-200 transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}

              {/* Services mega menu trigger */}
              <div className="relative group">
                <button className="text-white hover:text-green-200 transition-colors duration-200 text-sm font-medium flex items-center">
                  {t.allServices}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mega menu */}
                <div className="absolute left-0 mt-2 w-screen max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 hidden group-hover:block transform origin-top transition duration-200 ease-out">
                  <div className="grid grid-cols-3 gap-8">
                    {megaMenuCategories.map((category, idx) => (
                      <div key={idx}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                        <ul className="mt-3 space-y-2">
                          {category.items.map((item, i) => (
                            <li key={i}>
                              <Link
                                to={item.route}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications (only for authenticated users) */}
              {user && <NotificationCenter />}

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center text-white p-1 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </button>
                {showLanguageDropdown && <LanguageDropdown onClose={toggleLanguageDropdown} />}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="text-white p-1 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-white p-1 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      {/* Admin Dashboard Link - only show for admin users */}
                      {user?.user_metadata?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal("signin")}
                    className="text-white hover:text-green-200 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white hover:text-green-200 focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden bg-green-800 dark:bg-gray-900 max-h-screen overflow-y-auto`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* User section for mobile */}
            {user ? (
              <div className="border-b border-green-700 dark:border-gray-700 pb-3 mb-3">
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                  onClick={toggleMenu}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                  onClick={toggleMenu}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-b border-green-700 dark:border-gray-700 pb-3 mb-3">
                <button
                  onClick={() => {
                    openAuthModal("signin")
                    toggleMenu()
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal("signup")
                    toggleMenu()
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Regular nav links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
                onClick={toggleMenu}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Services Mega Menu Button */}
            <button
              onClick={toggleMobileMegaMenu}
              className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md"
            >
              <span>{t.allServices}</span>
              {showMobileMegaMenu ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Mobile Mega Menu Content */}
            {showMobileMegaMenu && (
              <div className="bg-green-700 dark:bg-gray-800 rounded-md mt-1 max-h-[50vh] overflow-y-auto">
                {megaMenuCategories.map((category, idx) => (
                  <div key={idx} className="border-b border-green-600 dark:border-gray-700 last:border-b-0">
                    <h3 className="px-4 py-3 text-sm font-semibold text-green-200 dark:text-gray-300 bg-green-600 dark:bg-gray-700 sticky top-0">
                      {category.title}
                    </h3>
                    <div className="py-2">
                      {category.items.map((item, i) => (
                        <Link
                          key={i}
                          to={item.route}
                          className="block px-6 py-2 text-sm text-white hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
                          onClick={toggleMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile action buttons */}
          <div className="flex justify-center space-x-4 pt-2 pb-4 border-t border-green-700 dark:border-gray-700">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center text-white p-2 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="text-white p-2 rounded-full hover:bg-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Language Dropdown */}
          {showLanguageDropdown && (
            <div className="px-4 pb-4 border-t border-green-700 dark:border-gray-700">
              <LanguageDropdown onClose={toggleLanguageDropdown} isMobile />
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
    </>
  )
}

export default Navbar
