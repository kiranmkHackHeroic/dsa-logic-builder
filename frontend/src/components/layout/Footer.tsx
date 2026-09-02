import { Link } from "react-router-dom";
import { Brain, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const learnLinks = [
    { label: "Problems", to: "/problems" },
    { label: "Pattern Library", to: "/patterns" },
    { label: "Interview Mode", to: "/interview" },
    { label: "Progress Analytics", to: "/analytics" },
  ];

  const resourceLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Study Plans", to: "/study-plans" },
    { label: "Pricing", to: "/pricing" },
    { label: "Community", to: "/discussions" },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
            <Link to="/" className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <Brain className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold gradient-text">DSA Logic Builder</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mx-auto sm:mx-0">
              Learn how to think, not just code. Master DSA through logic-first problem solving
              and build real interview confidence.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Practical DSA training with step-locked learning and interview simulation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-center sm:text-left">Learn</h4>
            <ul className="space-y-1 text-sm text-muted-foreground text-center sm:text-left">
              {learnLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex py-1 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-center sm:text-left">Resources</h4>
            <ul className="space-y-1 text-sm text-muted-foreground text-center sm:text-left">
              {resourceLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-flex py-1 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>© {new Date().getFullYear()} DSA Logic Builder. All rights reserved.</p>
            <p className="text-xs mt-1">Built by Kiran M K.</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kiranmkHackHeroic"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/kiran-m-k-43a5aa299/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
