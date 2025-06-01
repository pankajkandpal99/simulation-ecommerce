import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 mb-12 overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Premium Products
          <span className="block text-primary">For Modern Life</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          Discover our curated collection of high-quality products designed to
          enhance your everyday experience.
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Shop Now
        </button>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default HeroSection;
