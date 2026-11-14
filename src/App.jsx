
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Contact from "./pages/ContactSection";
import Hero from "./pages/HeroSection";
import Shop from "./pages/ShopSection";
import AdminPage from "./pages/AdminPage";

import CollectionsSection from "./pages/CollectionsSection";
import CollectionPage from "./pages/CollectionPage";

function HomePage() {
    return (
        <div className="w-full min-h-screen relative">
            <Navbar />
            <Hero />
            <Shop />
            <CollectionsSection />
            <Contact />
        </div>
    );
}

function CollectionLayout() {
    return (
        <div className="w-full min-h-screen relative">
            <Navbar />
            <CollectionPage />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/collections/:slug"
                    element={<CollectionLayout />}
                />

                <Route path="/admin" element={<AdminPage />} />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
