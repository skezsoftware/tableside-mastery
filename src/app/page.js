// HOME PAGE
// This is the landing page for Tableside Mastery - the first page users see
import "./home.css";
import Link from "next/link";

// PAGE METADATA
// SEO and social sharing metadata for the home page
export const metadata = {
  title: "Tableside Mastery - Restaurant Server Analytics",
  description:
    "Track your restaurant shifts, analyze sales patterns, monitor tip percentages, and maximize your earnings with comprehensive analytics.",
  keywords: [
    "restaurant",
    "server",
    "tips",
    "analytics",
    "shift tracking",
    "earnings",
    "restaurant management",
  ],
};

// HOME PAGE COMPONENT
// Displays the welcome message, value proposition, and call-to-action buttons
export default function Home() {
  return (
    <main className="welcome-page" role="main">
      {/* HERO SECTION */}
      {/* Main banner with app title and primary value proposition */}
      <header className="welcome-page-banner" role="banner">
        <h1>Welcome to Tableside Mastery</h1>
        <p>
          Tableside Mastery is a tool that helps you as a Server, earn more
          money, identify your strengths and weaknesses, pinpoint patterns in
          your shifts, and improve your skills.
        </p>
      </header>

      {/* HOW IT WORKS SECTION */}
      {/* Explains the core functionality and benefits */}
      <section className="welcome-page-section" aria-labelledby="how-it-works">
        <h2 id="how-it-works">How it works</h2>
        <p>
          Track your daily shifts, analyze sales patterns, monitor tip
          percentages, and identify opportunities to maximize your earnings. Our
          comprehensive analytics help you understand what drives your success.
        </p>
      </section>

      {/* CALL TO ACTION SECTION */}
      {/* Navigation buttons to get users started */}
      <section className="welcome-page-section" aria-labelledby="get-started">
        <h3 id="get-started">Get Started Below</h3>
        <div
          className="get-started-buttons"
          role="group"
          aria-label="Navigation options"
        >
          <Link href="/login">
            <button aria-label="Sign in to your account">Login</button>
          </Link>
          <Link href="/register">
            <button aria-label="Create a new account">Sign Up</button>
          </Link>
          <Link href="/restaurants">
            <button aria-label="View your restaurants">Restaurants</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
