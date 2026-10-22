import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Clients } from './components/Clients';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { About } from './components/About';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="bg-[#0c1128] text-white min-h-screen w-full overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Work />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default App;
