import { motion } from 'framer-motion';
import './Journal.css';

import journalImg1 from '../assets/IMG_2822.JPG';
import journalImg2 from '../assets/SHA00598.jpg';
import journalImg3 from '../assets/IMG_3591.JPG';

const Journal = () => {
  return (
    <div className="page journal-page container">
      <motion.header 
        className="journal-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>THE JOURNAL</h1>
        <p>Creative notes, rollout information, behind-the-scenes stories, and brand editorial.</p>
      </motion.header>
      
      <div className="journal-grid">
        {/* Post 1 */}
        <motion.article 
          className="journal-post large"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="journal-img" style={{backgroundImage: `url(${journalImg1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#111'}}></div>
          <div className="journal-meta">
            <span className="journal-date">OCT 24, 2025</span>
            <span className="journal-category">Rollout</span>
          </div>
          <h2>Documenting the Silence: Behind "Elevated Existence"</h2>
          <p className="journal-excerpt">Exploring the negative space in sound and design for our latest multi-sensory release experience.</p>
        </motion.article>

        {/* Post 2 */}
        <motion.article 
          className="journal-post"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="journal-img" style={{backgroundImage: `url(${journalImg2})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#111'}}></div>
          <div className="journal-meta">
            <span className="journal-date">SEP 12, 2025</span>
            <span className="journal-category">Editorial</span>
          </div>
          <h2>The Architecture of Sound</h2>
          <p className="journal-excerpt">How we map physical spaces to auditory experiences and construct live environments.</p>
        </motion.article>

        {/* Post 3 */}
        <motion.article 
          className="journal-post"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="journal-img" style={{backgroundImage: `url(${journalImg3})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#111'}}></div>
          <div className="journal-meta">
            <span className="journal-date">AUG 05, 2025</span>
            <span className="journal-category">Behind The Scenes</span>
          </div>
          <h2>Campaign 001: Visual Identity</h2>
          <p className="journal-excerpt">A look at the moodboards and sets that defined our visual reset for the season.</p>
        </motion.article>
      </div>
    </div>
  );
};

export default Journal;
