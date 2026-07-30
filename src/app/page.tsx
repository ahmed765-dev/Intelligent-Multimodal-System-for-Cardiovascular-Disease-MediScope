import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Doctors from '../components/Doctors';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="bg-[#e8f0fe] min-h-screen">
      <Navbar />
      <Hero />
      <Doctors />
      <Reviews />
    <Footer />
    </main>
  );
}