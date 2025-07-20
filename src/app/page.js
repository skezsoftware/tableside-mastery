// HOME PAGE
import "./home.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className="welcome-page">
      <header className="welcome-page-banner">
        <h1>Welcome to Tableside Mastery</h1>
        <p>
          Tableside Mastery is a tool that helps you as a Server, earn more
          money, identify your strengths and weaknesses, pinpoint patterns in
          your shifts, and improve your skills.
        </p>
      </header>

      <section className="welcome-page-section">
        <h2>How it works</h2>
        <p>
          Track your daily shifts, analyze sales patterns, monitor tip
          percentages, and identify opportunities to maximize your earnings. Our
          comprehensive analytics help you understand what drives your success.
        </p>
      </section>

      <section className="welcome-page-section">
        <h3>Get Started Below</h3>
        <div className="get-started-buttons">
          <Link href="/login">
            <button>Login</button>
          </Link>
          <Link href="/register">
            <button>Sign Up</button>
          </Link>
          <Link href="/restaurants">
            <button>Restaurants</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
