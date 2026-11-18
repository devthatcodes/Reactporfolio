import React from 'react';

const BrowseStyle = () => {
  return (
    <section className="browse-style container">
      <div className="browse-style-container">
        <h2 className="section-title">BROWSE BY PLAY STYLE</h2>
        <div className="style-grid">
          <div className="style-row">
            <div className="style-card flex-4 casual">
              <h3>PLAYTIME</h3>
            </div>
            <div className="style-card flex-6 formal">
              <h3>FANCY</h3>
            </div>
          </div>
          <div className="style-row">
            <div className="style-card flex-6 party">
              <h3>BIRTHDAY</h3>
            </div>
            <div className="style-card flex-4 gym">
              <h3>SPORTS</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseStyle;
