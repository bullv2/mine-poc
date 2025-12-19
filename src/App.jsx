import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <div className="logo">React App</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">Welcome to React</h1>
          <p className="hero-subtitle">A modern web application built with React.js and Vite</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
              Count: {count}
            </button>
            <button className="btn btn-secondary" onClick={() => setCount(0)}>
              Reset
            </button>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast</h3>
              <p>Lightning-fast development with Vite</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚛️</div>
              <h3>React</h3>
              <p>Built with the latest React features</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Modern</h3>
              <p>Beautiful and responsive design</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 React App. Built with ❤️ using React.js</p>
      </footer>
    </div>
  )
}

export default App
