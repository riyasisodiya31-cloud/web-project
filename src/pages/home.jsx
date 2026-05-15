import { Link } from "react-router-dom"
import "../style/home.css"
import bg from "../assets/gal.jpg"

const MOODS = [
  { emoji: "🌸", label: "nostalgic" },
  { emoji: "🌙", label: "lonely" },
  { emoji: "🌤", label: "hopeful" },
  { emoji: "🌊", label: "overwhelmed" },
  { emoji: "✨", label: "peaceful" },
]

function Home() {
  return (
    <div
  className="home"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: "100% 100%",  // ← stretches to fill exactly
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
    
      

      <div className="home-content">

        {/* top label */}
        <p className="home-eyebrow">A Museum of Feeling</p>

        {/* title */}
        <h1 className="title">
          {"GALLERIAS".split("").map((l, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.07}s` }}>{l}</span>
          ))}
        </h1>

        {/* plaque / divider */}
        <div className="plaque">
          <div className="plaque-line" />
          <div className="plaque-diamond" />
          <div className="plaque-line" />
        </div>

        {/* question */}
        <h2 className="question">How are you feeling today?</h2>

        {/* mood buttons */}
        <div className="mood-buttons">
          {MOODS.map((m) => (
            <button key={m.label} className="mood-btn">
              <span className="mood-emoji">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* nav buttons */}
        <div className="nav-buttons">
          <Link to="/gallery">
            <button className="nav-btn nav-btn-primary">Enter Gallery</button>
          </Link>
          <Link to="/upload">
            <button className="nav-btn nav-btn-outline">Upload Artwork</button>
          </Link>
        </div>

        {/* footer line */}
      </div>
    </div>
  )
}

export default Home
