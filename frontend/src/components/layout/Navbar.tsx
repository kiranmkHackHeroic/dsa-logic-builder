import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, LogOut, User, Settings, BookOpen, Trophy, Code, Bookmark, Building2, ChevronDown, Crown, MessageSquare, GitCompare, Timer, StickyNote, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const navLinks = [
    { name: "Problems", href: "/problems" },
    { name: "Patterns", href: "/patterns" },
    { name: "Interview Mode", href: "/interview" },
    { name: "Analytics", href: "/analytics" },
    { name: "Pricing", href: "/pricing" },
  ];

  const featureLinks = [
    { name: "Study Plans", href: "/study-plans", icon: BookOpen },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Code Templates", href: "/templates", icon: Code },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Company Problems", href: "/company-problems", icon: Building2 },
  ];

  const newFeatureLinks = [
    { name: "Discussion Forum", href: "/discussions", icon: MessageSquare },
    { name: "Code Comparison", href: "/compare", icon: GitCompare },
    { name: "Contest Mode", href: "/contest", icon: Timer },
    { name: "My Notes", href: "/notes", icon: StickyNote },
    { name: "Progress Heatmap", href: "/heatmap", icon: Calendar },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold gradient-text">DSA Logic Builder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                <Button variant="ghost" size="sm">
                  {link.name}
                </Button>
              </Link>
            ))}
            
            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Features
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Learning Tools</DropdownMenuLabel>
                {featureLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Practice & Community</DropdownMenuLabel>
                {newFeatureLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer">
                      <link.icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="max-w-24 truncate">
                        {profile?.display_name || user.email?.split("@")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    {link.name}
                  </Button>
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleSignOut} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
