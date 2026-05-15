import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/linen.jpeg";

const ARTWORKS = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    mood: "overwhelmed",
    moodLabel: "overwhelmed",
    annotation: "painted from an asylum window",
    tag: "post-impressionism · oil on canvas",
    description:
      "Painted from the window of an asylum, Van Gogh's night sky swirls with an energy that feels both terrifying and tender. The village sleeps below, indifferent to the storm above.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    accent: "#3a5a8a",
    rotate: "1deg",
    size: "large",
  },
  {
    id: 2,
    title: "Water Lilies",
    artist: "Claude Monet",
    year: "1906",
    mood: "peaceful",
    moodLabel: "peaceful",
    annotation: "the same pond, over and over",
    tag: "impressionism · oil on canvas",
    description:
      "Monet spent the last decades of his life painting the same pond, over and over — not because he hadn't captured it, but because it kept becoming something new.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg",
    accent: "#6a8a70",
    rotate: "-1deg",
    size: "large",
  },
];

const MOODS = ["all", "peaceful", "lonely", "nostalgic", "hopeful", "overwhelmed"];

const MOOD_DESCRIPTIONS = {
  all: "a curated journey through the full range of human feeling",
  peaceful: "works that invite stillness — spaces where the breath slows",
  lonely: "the private landscape of solitude: its texture, its strange beauty",
  nostalgic: "memory rendered visible — the ache of what once was",
  hopeful: "art that stands at the threshold of something new",
  overwhelmed: "the interior storm. these works do not flinch",
};

function useVisible(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return visible;
}

function useScroll() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return { progress, scrolled };
}
function MusicButton({ artwork }) {
  const [open, setOpen] = useState(false)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    if (artwork.spotifyEmbedUrl) {
      setOpen(prev => !prev)
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <div style={{ marginTop: "1.4rem" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={togglePlay}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #c9b99a",
            background: open || playing ? "#2a120e" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#8a7060"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#c9b99a"}
        >
          {open || playing ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="3" height="8" rx="1" fill="#f5efe6"/>
              <rect x="6" y="1" width="3" height="8" rx="1" fill="#f5efe6"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 1.5l7 3.5-7 3.5V1.5z" fill="#8a7060"/>
            </svg>
          )}
        </button>

        <span style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "0.88rem",
          color: "#b5a898",
          letterSpacing: "0.03em",
        }}>
          {artwork.spotifyEmbedUrl
            ? open ? "now playing" : "playing in my head"
            : playing ? "now playing" : "playing in my head"
          }
        </span>
      </div>

      {/* Spotify embed drops down on click */}
      {artwork.spotifyEmbedUrl && open && (
        <div style={{
          marginTop: 10,
          borderRadius: 10,
          overflow: "hidden",
          animation: "slideUp 0.25s ease",
        }}>
          <iframe
            src={artwork.spotifyEmbedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ display: "block", borderRadius: 10 }}
          />
        </div>
      )}

      {/* Local audio */}
      {artwork.music && !artwork.spotifyEmbedUrl && (
        <audio
          ref={audioRef}
          src={artwork.music}
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  )
}

// ─── ArtworkCard ──────────────────────────────────────────────────────────────
function ArtworkCard({ artwork, index, onDelete }) {
  const ref = useRef(null);
  const visible = useVisible(ref);
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const imgHeight = artwork.size === "large" ? 380 : artwork.size === "medium" ? 310 : 250;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: isEven ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: "clamp(2rem, 5vw, 5rem)",
        marginBottom: "clamp(5rem, 10vw, 9rem)",
        flexWrap: "wrap",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(52px)",
        transition: `opacity 0.85s ease ${index * 0.08}s, transform 0.85s ease ${index * 0.08}s`,
      }}
    >
      {/* ── Photo + frame ── */}
      <div style={{ flexShrink: 0, position: "relative" }}>

        {/* Handwritten annotation above */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1rem",
          color: "#8a6a50",
          marginBottom: "6px",
          transform: `rotate(${artwork.rotate})`,
          display: "inline-block",
          letterSpacing: "0.02em",
        }}>
          ↳ {artwork.annotation}
        </p>

        {/* Tape strip top */}
        <div style={{
          position: "absolute",
          top: 28,
          left: "50%",
          transform: "translateX(-50%) rotate(-1deg)",
          width: 60,
          height: 18,
          background: "rgba(220,200,160,0.55)",
          borderRadius: 2,
          zIndex: 3,
        }} />

        {/* Photo frame */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: "10px 10px 30px 10px",
            background: "#faf6ee",
            boxShadow: hovered
              ? "0 24px 56px rgba(0,0,0,0.28), 0 4px 14px rgba(0,0,0,0.12)"
              : "0 10px 36px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
            transform: `rotate(${artwork.rotate})`,
            transition: "box-shadow 0.4s ease, transform 0.3s ease",
            cursor: "default",
            position: "relative",
            zIndex: 2,
          }}
        >
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            style={{
              display: "block",
              width: "clamp(190px, 28vw, 360px)",
              height: imgHeight,
              objectFit: "cover",
              objectPosition: "center top",
              filter: hovered
                ? "sepia(5%) saturate(1.1) brightness(1.02)"
                : "sepia(18%) saturate(0.85) brightness(0.95)",
              transition: "filter 0.5s ease",
            }}
          />
          {/* Polaroid label */}
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.9rem",
            color: "#8a7260",
            textAlign: "center",
            marginTop: 8,
            letterSpacing: "0.03em",
          }}>
            {artwork.artist}, {artwork.year}
          </p>
        </div>

        {/* Tag below */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "0.82rem",
          color: "#b5a898",
          marginTop: 10,
          transform: `rotate(${artwork.rotate})`,
          display: "inline-block",
          letterSpacing: "0.04em",
        }}>
          #{artwork.tag}
        </p>
      </div>

      {/* ── Text panel ── */}
      <div style={{ flex: "1 1 240px", minWidth: 0, paddingTop: "2rem" }}>

        {/* Mood pill — handwritten style */}
        <span style={{
          display: "inline-block",
          padding: "3px 14px",
          borderRadius: 20,
          background: `${artwork.accent}18`,
          border: `1px solid ${artwork.accent}55`,
          fontFamily: "'Caveat', cursive",
          fontSize: "1rem",
          color: artwork.accent,
          marginBottom: "0.8rem",
          letterSpacing: "0.04em",
        }}>
          {artwork.moodLabel}
        </span>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(1.7rem, 2.8vw, 2.5rem)",
          fontWeight: 700,
          fontStyle: "italic",
          color: "#2a120e",
          lineHeight: 1.15,
          margin: "0 0 0.5rem 0",
        }}>
          {artwork.title}
        </h2>

        {/* Handwritten underline squiggle */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1.3rem",
          color: `${artwork.accent}88`,
          margin: "0 0 1rem 0",
          letterSpacing: "0.1em",
        }}>
          ~~~
        </p>

        {/* Description */}
        <p style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(0.86rem, 1vw, 0.96rem)",
          color: "#6b5040",
          lineHeight: 1.95,
          margin: 0,
          maxWidth: "42ch",
        }}>
          {artwork.description}
        </p>

        {/* Catalogue — handwritten */}
        <p style={{
          marginTop: "1.8rem",
          fontFamily: "'Caveat', cursive",
          fontSize: "0.9rem",
          color: "#c9b99a",
          letterSpacing: "0.05em",
        }}>
          cat. no. {String(artwork.id).slice(-4)} — galleria permanent collection
        </p>
        {(artwork.spotifyEmbedUrl || artwork.music) && (
          <MusicButton artwork={artwork} />
        )}
      {onDelete && artwork.artist === "You" && (
          <button
            onClick={() => onDelete(artwork.id)}
            style={{
              marginTop: "1rem",
              background: "none",
              border: "1px solid rgba(42,18,14,0.15)",
              borderRadius: 4,
              padding: "5px 14px",
              fontFamily: "'Caveat', cursive",
              fontSize: "0.9rem",
              color: "#b08070",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#8a4030"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(42,18,14,0.15)"}
          >
            remove from gallery
          </button>
        )}
      </div>
      </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Gallery({ artworks = [], onDelete}) {
  const navigate = useNavigate();
  const { progress, scrolled } = useScroll();
  const [activeMood, setActiveMood] = useState("all");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);
 const uploadedArtworks = artworks.map((a, i) => ({
  ...a,
  imageUrl: a.image,
  mood: a.emotion,
  moodLabel: a.emotion || "other",
  title: a.title || "Untitled",
  artist: "You",
  year: new Date().getFullYear().toString(),
  annotation: a.title || "submitted work",
  tag: "submitted work",
  description: a.text || "",
  accent: "#8a7060",
  rotate: i % 2 === 0 ? "-1deg" : "1deg",
  size: "medium",
}))

const ALL_ARTWORKS = [...ARTWORKS, ...uploadedArtworks] 

  const filtered = activeMood === "all" ? ALL_ARTWORKS : ALL_ARTWORKS.filter((a) => a.mood === activeMood)
  useEffect(() => {
    const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_270f6fec37.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioPlaying) { audio.pause(); setAudioPlaying(false); }
    else { audio.play().then(() => setAudioPlaying(true)).catch(() => {}); }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Shadows+Into+Light&display=swap');`}</style>

      <div style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "auto",
backgroundRepeat: "repeat",
        backgroundPosition: "center",
        overflowX: "hidden",
      }}>

        {/* Scroll progress */}
        <div style={{ position: "fixed", bottom: 0, left: 0, width: `${progress}%`, height: 2, background: "linear-gradient(to right, #c9b99a, #8a7060)", zIndex: 200, transition: "width 0.1s linear" }} />

        {/* Nav */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem",
          padding: "0 clamp(1rem, 4vw, 3rem)",
          height: scrolled ? 52 : 64,
          background: "rgba(245,239,230,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(42,18,14,0.1)",
          boxShadow: scrolled ? "0 2px 14px rgba(0,0,0,0.06)" : "none",
          transition: "height 0.3s ease, box-shadow 0.3s ease",
        }}>
          <button onClick={() => navigate("/")} style={navBtn}>← galleria</button>

          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {MOODS.map((m) => (
              <button key={m} onClick={() => setActiveMood(m)} style={{
                cursor: "pointer", padding: "4px 13px", borderRadius: 20,
                fontFamily: "'Caveat', cursive", fontSize: "1rem", letterSpacing: "0.04em",
                border: activeMood === m ? "1px solid #2a120e" : "1px solid transparent",
                background: activeMood === m ? "#2a120e" : "transparent",
                color: activeMood === m ? "#f5efe6" : "#8a7060",
                transition: "all 0.2s ease",
              }}>
                {m}
              </button>
            ))}
          </div>

         <div style={{ width: 80 }} />

        </nav>

        {/* Header */}
        <header style={{ textAlign: "center", padding: "clamp(6rem, 12vw, 9rem) clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 3vw, 2.5rem)", position: "relative" }}>
  
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
            fontWeight: 100,
            fontStyle: "italic",
            color: "#2a120e",
            lineHeight: 1,
            margin: "0 0 0.6rem",
          }}>
            {activeMood === "all" ? "Emotions in Paint" : activeMood.charAt(0).toUpperCase() + activeMood.slice(1)}
          </h1>
          <p style={{
            fontFamily: "Shadows Into Light'', cursive",
            fontSize: "1.15rem",
            color: "rgba(42,18,14,0.55)",
            maxWidth: "44ch",
            margin: "0 auto",
            lineHeight: 1.7,
            letterSpacing: "0.02em",
          }}>
            {MOOD_DESCRIPTIONS[activeMood]}
          </p>
        </header>

        {/* Handwritten divider */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.4rem", color: "rgba(42,18,14,0.2)", letterSpacing: "0.2em" }}>
            ∿ ∿ ✦ ∿ ∿
          </span>
        </div>

        {/* Artworks */}
        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)" }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "5rem 0", fontFamily: "'Caveat', cursive", fontSize: "1.3rem", color: "#8a7060" }}>
              nothing here yet for this feeling...
            </p>
          ) : filtered.map((artwork, i) => (
            <ArtworkCard key={artwork.id} artwork={artwork} index={i} onDelete={onDelete} />
          ))}
        </main>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "clamp(3rem, 6vw, 5rem) 2rem", borderTop: "1px solid rgba(42,18,14,0.08)" }}>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem", color: "rgba(42,18,14,0.35)", marginBottom: "1.5rem" }}>
            — end of exhibition —
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", fontWeight: 400, fontStyle: "italic", color: "#2a120e", margin: "0 0 0.4rem" }}>
            Have a work to share?
          </h3>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#8a7060", marginBottom: "2rem" }}>
            every emotion deserves a frame ✦
          </p>
          <button
            onClick={() => navigate("/upload")}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#4a2e28"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#2a120e"; e.currentTarget.style.transform = "translateY(0)"; }}
            style={{ background: "#2a120e", color: "#f5efe6", border: "none", padding: "13px 38px", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", letterSpacing: "0.05em", cursor: "pointer", transition: "background 0.25s ease, transform 0.2s ease", borderRadius: 2 }}
          >
            Submit Your Work
          </button>
  
        </footer>

        {/* Back to top */}
        {scrolled && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            style={{ position: "fixed", bottom: "2rem", right: "2rem", width: 42, height: 42, borderRadius: "50%", background: "#2a120e", color: "#f5efe6", border: "none", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 14px rgba(0,0,0,0.2)", zIndex: 150, transition: "transform 0.2s ease" }}
          >
            ↑
          </button>
        )}
      </div>
    </>
  );
}

const navBtn = {
  background: "none", border: "none", cursor: "pointer",
  fontFamily: "'Caveat', cursive", fontSize: "1rem",
  letterSpacing: "0.05em", color: "#8a7060",
};
