import Navbar from "./components/Navbar";
import Contact from "./pages/ContactSection";
import Hero from "./pages/HeroSection";
import Shop from "./pages/ShopSection";

export default function App(){

    return(
        <div className="w-full min-h-screen relative">
            <Navbar />
            <Hero />
            <Shop />
            <Contact />
        </div>
    )
}