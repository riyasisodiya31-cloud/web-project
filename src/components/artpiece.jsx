import { motion } from "framer-motion"

function ArtPiece({ image, emotion, text, music}) {

  return (

    <motion.section
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}

      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px"
      }}
    >

      <img
        src={image}
        style={{
          width: "450px",
          borderRadius: "10px"
        }}
      />

      <h2>{emotion}</h2>

      <p>{text}</p>
      {music && (
  <audio controls>
    <source src={music} />
  </audio>
)}

    </motion.section>

  )

}

export default ArtPiece