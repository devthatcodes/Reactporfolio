import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import norffCover from '../assets/Norffside (Final Cover).JPG';
import img0684 from '../assets/IMG_0684.JPG';
import img1523 from '../assets/IMG_1523.jpg';
import campaign from '../assets/campaign.jpg';
import './Music.css';

const releases = [
  {
    id: 1,
    title: "MIDNIGHT ECHOES",
    year: "2026",
    image: norffCover,
    description: "A full-length exploration of nocturnal soundscapes and emotional depth.",
    type: "ALBUM"
  },
  {
    id: 2,
    title: "FRAGMENTS",
    year: "2025",
    image: img0684,
    description: "Scattered pieces of memory stitched together with abrasive synths.",
    type: "EP"
  },
  {
    id: 3,
    title: "THE VOID",
    year: "2024",
    image: img1523,
    description: "An experimental dive into minimalist bass and heavy atmospheric textures.",
    type: "SINGLE"
  },
  {
    id: 4,
    title: "CAMPAIGN 001",
    year: "2024",
    image: campaign,
    description: "The initial sonic blueprint that started the SOLUS sound identity.",
    type: "MIXTAPE"
  }
];

const Music = () => {
  return (
    <div className="page music-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>DISCOGRAPHY</h1>
          <p>The complete sonic archive.</p>
        </motion.div>

        <div className="music-grid">
          {releases.map((release, index) => (
            <motion.div 
              className="music-card" 
              key={release.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="music-card-image">
                <img src={release.image} alt={release.title} />
                <div className="play-overlay">
                  <Play fill="white" size={48} />
                </div>
              </div>
              <div className="music-card-info">
                <div className="music-meta">
                  <span>{release.year}</span>
                  <span className="dot">•</span>
                  <span>{release.type}</span>
                </div>
                <h2>{release.title}</h2>
                <p>{release.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
