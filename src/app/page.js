import "./home.css";

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
          Tableside Mastery is a tool that helps you as a Server, earn more
          money, identify your strengths and weaknesses, pinpoint patterns in
          your shifts, and improve your skills.
        </p>
      </section>

      <section className="welcome-page-section">
        <h3>Get Started Below</h3>
        <div className="get-started-buttons">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      </section>
    </main>
  );
}
