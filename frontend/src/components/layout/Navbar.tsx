import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  BookOpen, 
  Trophy, 
  Code, 
  Bookmark, 
  Building2, 
  ChevronDown, 
  MessageSquare, 
  GitCompare, 
  Timer, 
  StickyNote, 
  Calendar,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

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

  // W3Schools-style secondary topic strip
  const topicRibbon = [
    { label: "DSA HOME", href: "/" },
    { label: "ALL PROBLEMS", href: "/problems" },
    { label: "TWO POINTERS", href: "/patterns/two-pointers" },
    { label: "SLIDING WINDOW", href: "/patterns/sliding-window" },
    { label: "BINARY SEARCH", href: "/patterns/binary-search" },
    { label: "LINKED LISTS", href: "/patterns/fast-slow-pointers" },
    { label: "STACKS & QUEUES", href: "/patterns/monotonic-stack" },
    { label: "TREES & GRAPHS", href: "/patterns/tree-bfs" },
    { label: "DYNAMIC PROGRAMMING", href: "/patterns/01-knapsack" },
    { label: "AI DRY RUN", href: "/problems/1" },
    { label: "INTERVIEW", href: "/interview" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-xs">
      {/* Primary Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-[#04AA6D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#038a58] transition-colors">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground tracking-tight flex items-center gap-1.5">
                DSA Logic Builder
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#04AA6D]/15 text-[#04AA6D] rounded">Tutorial</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.name} to={link.href}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`font-medium text-sm transition-colors ${
                      isActive ? "text-[#04AA6D] bg-[#04AA6D]/10 font-semibold" : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.name}
                  </Button>
                </Link>
              );
            })}
            
            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-foreground/80 hover:text-foreground">
                  Features
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 shadow-md border-border">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Learning Modules</DropdownMenuLabel>
                {featureLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer font-medium">
                      <link.icon className="h-4 w-4 mr-2 text-[#04AA6D]" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Practice & Community</DropdownMenuLabel>
                {newFeatureLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link to={link.href} className="cursor-pointer font-medium">
                      <link.icon className="h-4 w-4 mr-2 text-primary" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="font-semibold text-xs border-border hover:border-[#04AA6D]">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 px-2">
                      <div className="w-7 h-7 rounded-full bg-[#04AA6D] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="max-w-28 truncate text-xs font-semibold">
                        {profile?.display_name || user.email?.split("@")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 shadow-md border-border">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer font-medium">
                        <User className="h-4 w-4 mr-2 text-[#04AA6D]" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer font-medium">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive font-medium">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="font-semibold text-xs border-border hover:border-[#04AA6D]">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold text-xs px-4 rounded-md shadow-xs transition-colors">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-border animate-fade-in bg-background">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                    {link.name}
                  </Button>
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-border mt-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleSignOut} className="w-full text-sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full text-sm font-medium">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#04AA6D] hover:bg-[#038a58] text-white font-bold text-sm">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* W3Schools Signature Topic Bar (#282A35 Dark Charcoal) */}
      <div className="bg-[#282A35] text-white border-t border-black/20 shadow-inner overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4 flex items-center gap-1 py-1.5 text-[11px] font-semibold tracking-wider whitespace-nowrap">
          {topicRibbon.map((item) => {
            const isSelected = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`px-3 py-1 rounded transition-colors uppercase ${
                  isSelected
                    ? "bg-[#04AA6D] text-white font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
