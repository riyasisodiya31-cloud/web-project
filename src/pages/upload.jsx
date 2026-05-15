
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import linenBg from "../assets/bgg.jpeg"


function Upload({ setArtworks }) {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [emotion, setEmotion] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [music, setMusic] = useState(null)
  const [musicName, setMusicName] = useState("")
  const [musicMode, setMusicMode] = useState("file")
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState("")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [noImageError, setNoImageError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const imageRef = useRef()
  const musicRef = useRef()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith("image/")) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleMusicChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMusic(file)
    setMusicName(file.name)
  }

  const handleSpotifyUrl = (val) => {
    setSpotifyUrl(val)
    const match = val.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
    if (match) {
      setSpotifyEmbedUrl(`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`)
    } else {
      setSpotifyEmbedUrl("")
    }
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    setComments(prev => [
      ...prev,
      { id: Date.now(), text: comment.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
    ])
    setComment("")
  }
  const toBase64 = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.readAsDataURL(file)
})
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) { setNoImageError(true); return }
    setNoImageError(false)
    const newArt = {
      id: Date.now(),
      image: await toBase64 (image),
      emotion,
      title: title || "Untitled",
      text,
      music: music ? await toBase64 (music) : null,
      spotifyEmbedUrl: spotifyEmbedUrl || null,
      comments,
    }
    setArtworks(prev => [...prev, newArt])
    setSubmitted(true)
    setTimeout(() => {
      setImage(null); setImagePreview(null); setEmotion("")
      setTitle("")
      setText(""); setMusic(null); setMusicName("")
      setComment(""); setComments([]); setSpotifyUrl(""); setSpotifyEmbedUrl(""); setMusicMode("file"); setSubmitted(false)
      navigate("/gallery")
    }, 2500)
  }

  const emotions = [
    { value: "nostalgic",    label: "Nostalgic" },
    { value: "lonely",       label: "Lonely" },
    { value: "hopeful",      label: "Hopeful" },
    { value: "overwhelmed",  label: "Overwhelmed" },
    { value: "peaceful",     label: "Peaceful" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Sora:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .up-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: url(${linenBg}) center center / cover fixed no-repeat;
          padding: 70px 24px 100px;
          position: relative;
        }

        .up-inner {
          max-width: 540px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .up-header { margin-bottom: 52px; }

        .up-eyebrow {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #b5a99a;
          font-weight: 400;
          margin: 0 0 14px;
        }

        .up-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 400;
          color: #1c1a18;
          margin: 0 0 12px;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .up-title em {
          font-style: italic;
          color: #8b7355;
        }

        .up-subtitle {
          font-size: 13px;
          font-weight: 300;
          color: #9b9087;
          margin: 0;
          line-height: 1.7;
        }

        .up-card {
          background: rgba(255, 248, 243, 0.52);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: box-shadow 0.2s;
        }

        .up-card:focus-within {
          box-shadow: 0 4px 28px rgba(0,0,0,0.08);
        }

        .up-card-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c0b8ae;
          font-weight: 400;
          margin-bottom: 20px;
        }

        .up-card-label-dot {
          width: 4px;
          height: 4px;
          background: #d4c9bc;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .drop-zone {
          border: 1.5px dashed #ddd8d1;
          border-radius: 12px;
          padding: 44px 24px;
          text-align: center;
          cursor: pointer;
          background: rgba(255, 248, 243, 0.35);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .drop-zone.drag-over {
          border-color: #b5a99a;
          background: rgba(255, 248, 243, 0.55);
        }

        .drop-zone.has-image {
          border-style: solid;
          border-color: #e8e3dd;
          padding: 0;
        }

        .drop-zone:hover:not(.has-image) {
          border-color: #c8c0b6;
          background: rgba(255, 248, 243, 0.5);
        }

        .drop-zone img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .dz-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          background: #f0ede8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dz-main { font-size: 14px; color: #7a7068; margin: 0 0 4px; }
        .dz-sub  { font-size: 12px; color: #bbb3a8; font-weight: 300; margin: 0; }

        .dz-change {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          font-size: 11px;
          font-family: 'Sora', sans-serif;
          color: #555;
          padding: 5px 12px;
          cursor: pointer;
          letter-spacing: 0.3px;
        }

        .emotion-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .emotion-pill {
          padding: 7px 16px;
          border-radius: 100px;
          border: 1px solid #e5e0d9;
          background: #faf9f7;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          font-weight: 300;
          color: #7a7068;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.2px;
        }

        .emotion-pill:hover { border-color: #c8bfb4; color: #4a4038; }

        .emotion-pill.active {
          background: #1c1a18;
          border-color: #1c1a18;
          color: #fff;
          font-weight: 400;
        }

        .up-textarea {
          width: 100%;
          border: 1.5px solid #ece9e4;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          font-weight: 300;
          color: #1c1a18;
          resize: none;
          min-height: 100px;
          line-height: 1.7;
          background: rgba(255, 248, 243, 0.35);
          transition: border-color 0.2s, background 0.2s;
        }

        .up-textarea:focus {
          outline: none;
          border-color: #c8bfb4;
          background: rgba(255, 248, 243, 0.6);
        }

        .up-textarea::placeholder { color: #c8c0b6; }

        .music-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1.5px dashed #ddd8d1;
          border-radius: 12px;
          cursor: pointer;
          background: rgba(255, 248, 243, 0.35);
          transition: all 0.18s;
        }

        .music-row:hover { border-color: #c8c0b6; background: rgba(255, 248, 243, 0.52); }

        .music-row.has-music {
          border-style: solid;
          border-color: #d4c9bc;
          background: rgba(255, 248, 243, 0.55);
        }

        .music-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f0ede8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .music-circle.active { background: #1c1a18; }

        .music-info { flex: 1; overflow: hidden; }

        .music-name {
          font-size: 13px;
          color: #4a4038;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .music-placeholder { color: #b5a99a; font-weight: 300; }

        .music-hint { font-size: 11px; color: #b5a99a; font-weight: 300; margin-top: 2px; }

        .music-toggle {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          background: rgba(0, 0, 0, 0.07);
          border-radius: 10px;
          padding: 4px;
        }

        .music-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-radius: 7px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-family: 'Sora', sans-serif;
          font-weight: 400;
          color: #9b9087;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.2px;
        }

        .music-tab:hover { color: #4a4038; }

        .music-tab.active {
          background: rgba(255, 248, 243, 0.7);
          color: #1c1a18;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .spotify-section { display: flex; flex-direction: column; gap: 14px; }

        .spotify-input-row { display: flex; flex-direction: column; gap: 8px; }

        .spotify-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .spotify-input-icon {
          position: absolute;
          left: 13px;
          pointer-events: none;
          flex-shrink: 0;
        }

        .spotify-input {
          width: 100%;
          border: 1.5px solid #ece9e4;
          border-radius: 10px;
          padding: 11px 38px 11px 36px;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          font-weight: 300;
          color: #1c1a18;
          background: rgba(255, 248, 243, 0.35);
          transition: border-color 0.2s, background 0.2s;
        }

        .spotify-input:focus {
          outline: none;
          border-color: #1DB954;
          background: rgba(255, 248, 243, 0.6);
        }

        .spotify-input::placeholder { color: #c8c0b6; }

        .spotify-clear {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .spotify-embed-wrap {
          border-radius: 12px;
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }

        .spotify-hint {
          font-size: 12px;
          color: #b5a99a;
          font-weight: 300;
          margin: 0;
          line-height: 1.6;
        }

        .spotify-hint em { font-style: normal; color: #8b7355; }

        .spotify-hint-error {
          font-size: 12px;
          color: #c97a6a;
          font-weight: 300;
          margin: 0;
        }

        .comment-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .comment-input {
          flex: 1;
          border: 1.5px solid #ece9e4;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          font-weight: 300;
          color: #1c1a18;
          background: rgba(255, 248, 243, 0.35);
          transition: border-color 0.2s, background 0.2s;
        }

        .comment-input:focus {
          outline: none;
          border-color: #c8bfb4;
          background: rgba(255, 248, 243, 0.6);
        }

        .comment-input::placeholder { color: #c8c0b6; }

        .comment-add-btn {
          background: #1c1a18;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-size: 12px;
          font-family: 'Sora', sans-serif;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .comment-add-btn:hover { background: #3a3530; }

        .comment-list { display: flex; flex-direction: column; gap: 8px; }

        .comment-bubble {
          background: rgba(255, 248, 243, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          animation: slideUp 0.22s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .comment-text { font-size: 13px; color: #3a3530; line-height: 1.6; flex: 1; font-weight: 300; }
        .comment-time { font-size: 10px; color: #c8c0b6; flex-shrink: 0; margin-top: 3px; letter-spacing: 0.3px; }

        .no-comments {
          font-size: 13px;
          color: #c8c0b6;
          font-style: italic;
          font-weight: 300;
        }

        .up-submit {
          width: 100%;
          margin-top: 24px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-family: 'Sora', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s;
          background: #1c1a18;
          color: #fff;
        }

        .up-submit:hover:not(:disabled) {
          background: #3a3530;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(28,26,24,0.14);
        }

        .up-submit:active:not(:disabled) { transform: translateY(0); }

        .up-submit:disabled {
          background: #e8e4df;
          color: #c0b8ae;
          cursor: not-allowed;
        }

        .up-submit.success { background: #4a7c59; }
      `}</style>

      <div className="up-root">
        <div className="up-inner">

          <header className="up-header">
            <p className="up-eyebrow">Studio</p>
            <h1 className="up-title">Share your <em>artwork</em></h1>
            <p className="up-subtitle">Upload a piece, set the mood, add a soundtrack — make it yours.</p>
          </header>

          <form onSubmit={handleSubmit}>

            {/* Artwork */}
            <div className="up-card">
              <div className="up-card-label"><span className="up-card-label-dot"/>Artwork</div>
              <div
                className={`drop-zone${imagePreview ? " has-image" : ""}${dragOver ? " drag-over" : ""}`}
                onClick={() => imageRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview"/>
                    <button type="button" className="dz-change" onClick={e => { e.stopPropagation(); imageRef.current.click() }}>
                      Change
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dz-icon">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#a09080" strokeWidth="1.2"/>
                        <circle cx="6.5" cy="6.5" r="1.5" stroke="#a09080" strokeWidth="1.2"/>
                        <path d="M1 12l4-3 3 2.5 3-2.5 6 4.5" stroke="#a09080" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="dz-main">Drop an image or click to browse</p>
                    <p className="dz-sub">JPG · PNG · GIF · WEBP</p>
                  </>
                )}
                <input ref={imageRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImageChange}/>
              </div>
            </div>

            {/* Emotion */}
            <div className="up-card">
              <div className="up-card-label"><span className="up-card-label-dot"/>Emotion</div>
              <div className="emotion-pills">
                {emotions.map(e => (
                  <button
                    key={e.value}
                    type="button"
                    className={`emotion-pill${emotion === e.value ? " active" : ""}`}
                    onClick={() => setEmotion(emotion === e.value ? "" : e.value)}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
<div className="up-card">
  <div className="up-card-label"><span className="up-card-label-dot"/>Title</div>
  <input
    className="comment-input"
    type="text"
    placeholder="Give your artwork a name…"
    value={title}
    onChange={e => setTitle(e.target.value)}
  />
</div>

            {/* Thoughts */}
            <div className="up-card">
              <div className="up-card-label"><span className="up-card-label-dot"/>Your thoughts</div>
              <textarea
                className="up-textarea"
                placeholder="What did you feel while creating this?"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
              />
            </div>

            {/* Music */}
            <div className="up-card">
              <div className="up-card-label"><span className="up-card-label-dot"/>Music</div>

              {/* Mode toggle */}
              <div className="music-toggle">
                <button
                  type="button"
                  className={`music-tab${musicMode === "file" ? " active" : ""}`}
                  onClick={() => setMusicMode("file")}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{marginRight:6}}>
                    <path d="M6 12V4l8-2v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                  Upload file
                </button>
                <button
                  type="button"
                  className={`music-tab${musicMode === "spotify" ? " active" : ""}`}
                  onClick={() => setMusicMode("spotify")}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:6}}>
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.233 1.329a.78.78 0 01.257 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 01-1.067 1.543l.113.065z"/>
                  </svg>
                  Spotify
                </button>
              </div>

              {/* File upload */}
              {musicMode === "file" && (
                <div className={`music-row${music ? " has-music" : ""}`} onClick={() => musicRef.current.click()}>
                  <div className={`music-circle${music ? " active" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12V4l8-2v8" stroke={music ? "#fff" : "#a09080"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="4" cy="12" r="2" stroke={music ? "#fff" : "#a09080"} strokeWidth="1.2"/>
                      <circle cx="12" cy="10" r="2" stroke={music ? "#fff" : "#a09080"} strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="music-info">
                    <p className={`music-name${!music ? " music-placeholder" : ""}`}>
                      {music ? musicName : "Attach a track"}
                    </p>
                    <p className="music-hint">{music ? "Click to change" : "MP3 · WAV · OGG · FLAC"}</p>
                  </div>
                  {music && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#c8bfb4" strokeWidth="1"/>
                      <path d="M5 8l2.5 2.5L11 5" stroke="#c8bfb4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <input ref={musicRef} type="file" accept="audio/*" style={{display:"none"}} onChange={handleMusicChange}/>
                </div>
              )}

              {/* Spotify */}
              {musicMode === "spotify" && (
                <div className="spotify-section">
                  <div className="spotify-input-row">
                    <div className="spotify-input-wrap">
                      <svg className="spotify-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.233 1.329a.78.78 0 01.257 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 01-1.067 1.543l.113.065z"/>
                      </svg>
                      <input
                        className="spotify-input"
                        type="text"
                        placeholder="Paste a Spotify track, album, or playlist link…"
                        value={spotifyUrl}
                        onChange={e => handleSpotifyUrl(e.target.value)}
                      />
                      {spotifyUrl && (
                        <button type="button" className="spotify-clear" onClick={() => { setSpotifyUrl(""); setSpotifyEmbedUrl("") }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 1l10 10M11 1L1 11" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {spotifyEmbedUrl && (
                    <div className="spotify-embed-wrap">
                      <iframe
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        style={{borderRadius:"12px", display:"block"}}
                      />
                    </div>
                  )}

                  {spotifyUrl && !spotifyEmbedUrl && (
                    <p className="spotify-hint-error">Paste a valid Spotify track, album, or playlist link to preview.</p>
                  )}

                  {!spotifyUrl && (
                    <p className="spotify-hint">
                      Copy a link from Spotify: <em>Share → Copy link</em>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="up-card">
              <div className="up-card-label"><span className="up-card-label-dot"/>Comments</div>
              <div className="comment-input-row">
                <input
                  className="comment-input"
                  type="text"
                  placeholder="Write something…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddComment() } }}
                />
                <button type="button" className="comment-add-btn" onClick={handleAddComment}>Add</button>
              </div>
              <div className="comment-list">
                {comments.length === 0
                  ? <p className="no-comments">No comments yet.</p>
                  : comments.map(c => (
                      <div className="comment-bubble" key={c.id}>
                        <span className="comment-text">{c.text}</span>
                        <span className="comment-time">{c.time}</span>
                      </div>
                    ))
                }
              </div>
            </div>

            <button
              type="submit"
              className={`up-submit${submitted ? " success" : ""}`}
            >
              {submitted ? "✓  Uploaded" : "Publish artwork"}
            </button>
            {noImageError && (
              <p style={{textAlign:"center", fontSize:"13px", color:"#c97a6a", fontWeight:300, marginTop:"10px"}}>
                Please upload an artwork image first.
              </p>
            )}

          </form>
        </div>
      </div>
    </>
  )
}

export default Upload
