import { motion } from 'framer-motion';
import './Merch.css';

import merch1a from '../assets/IMG_1650.JPG';
import merch1b from '../assets/IMG_1993.JPG';

import merch2a from '../assets/IMG_2476.JPG';
import merch2b from '../assets/IMG_4877.JPG';

import merch3a from '../assets/IMG_3901.JPG';
import merch3b from '../assets/cid_401E12F7-6A67-44E6-AE27-CFFB2DDA1FBB-L0-001.jpeg';

const Merch = () => {
  return (
    <div className="page merch-page container">
      <motion.header 
        className="merch-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>COLLECTIONS</h1>
        <p>Curated apparel, mockups, and limited edition releases.</p>
      </motion.header>

      <div className="merch-grid">
        {/* Product 1 */}
        <motion.div 
          className="merch-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <div className="merch-img-container">
            <div className="merch-img" style={{backgroundImage: `url(${merch1a})`, backgroundColor: '#1a1a1a', backgroundPosition: 'center', backgroundSize: 'cover'}}></div>
            <div className="merch-img-hover" style={{backgroundImage: `url(${merch1b})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#2a2a2a'}}></div>
          </div>
          <div className="merch-info">
            <h3 className="merch-title">SOLUS Signature Hoodie</h3>
            <span className="merch-price">$120</span>
          </div>
          <p className="merch-desc">Heavyweight structural cotton. Distressed details.</p>
        </motion.div>

        {/* Product 2 */}
        <motion.div 
          className="merch-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="merch-img-container">
            <div className="merch-img" style={{backgroundImage: `url(${merch2a})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1a1a1a'}}></div>
            <div className="merch-img-hover" style={{backgroundImage: `url(${merch2b})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#2a2a2a'}}></div>
          </div>
          <div className="merch-info">
            <h3 className="merch-title">Project Alpha Vinyl</h3>
            <span className="merch-price">$45</span>
          </div>
          <p className="merch-desc">180g limited pressing. Matte black sleeve.</p>
        </motion.div>

        {/* Product 3 */}
        <motion.div 
          className="merch-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="merch-img-container">
            <div className="merch-img" style={{backgroundImage: `url(${merch3a})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1a1a1a'}}></div>
            <div className="merch-img-hover" style={{backgroundImage: `url(${merch3b})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#2a2a2a'}}></div>
          </div>
          <div className="merch-info">
            <h3 className="merch-title">Syndicate Cap</h3>
            <span className="merch-price">$40</span>
          </div>
          <p className="merch-desc">Embroidered tonal logo. Adjustable.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Merch;
