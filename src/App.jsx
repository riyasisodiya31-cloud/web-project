import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import Home from "./pages/home"
import Gallery from "./pages/gallery"
import Upload from "./pages/upload"

function App() {
  const [artworks, setArtworks] = useState(() => {
    const saved = localStorage.getItem("artworks")
    return saved ? JSON.parse(saved) : []
  })
  const handleDelete = (id) => {
  setArtworks(prev => prev.filter(a => a.id !== id))
}

  useEffect(() => {
    localStorage.setItem("artworks", JSON.stringify(artworks))
  }, [artworks])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
     <Route path="/gallery" element={<Gallery artworks={artworks} onDelete={handleDelete} />} />
      <Route path="/upload" element={<Upload setArtworks={setArtworks} />} />
    </Routes>
  )
}

export default App