import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const smoothEase = [0.22, 1, 0.36, 1];

export default function CollectionsSection() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCollections = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_URL}/api/collections`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load collections.');
            }

            setCollections(data.collections || []);

        } catch (error) {
            console.error('Collections fetch error:', error);
            setError('We couldn’t load our collections. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <section
            id="collections"
            className="w-full bg-white px-6 md:px-12 py-16 md:py-24 font-six"
        >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 md:w-14 h-[1.5px] bg-black" />

                        <p className="text-[9px] md:text-[10px] font-semibold tracking-[0.15em] uppercase">
                            Explore Our Pieces
                        </p>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
                        Collections.
                    </h2>

                    <p className="text-sm text-neutral-500 mt-3">
                        Discover pieces made for your everyday style.
                    </p>
                </div>

                <p className="text-xs text-neutral-400">
                    {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
                </p>

            </div>

            {/* LOADING */}
            {loading && (
                <div className="min-h-[250px] flex items-center justify-center">
                    <FiLoader className="text-2xl animate-spin text-neutral-400" />
                </div>
            )}

            {/* ERROR */}
            {!loading && error && (
                <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-neutral-500">{error}</p>

                    <button
                        onClick={fetchCollections}
                        className="bg-black text-white px-6 py-3 rounded-full text-xs"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* EMPTY */}
            {!loading && !error && collections.length === 0 && (
                <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
                    <p className="text-lg font-semibold">
                        Something new is coming.
                    </p>

                    <p className="text-sm text-neutral-500 mt-2">
                        Our collections will be appearing here soon.
                    </p>
                </div>
            )}

            {/* COLLECTION GRID */}
            {!loading && !error && collections.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">

                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.08,
                                ease: smoothEase
                            }}
                        >
                            <Link
                                to={`/collections/${collection.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-lg">

                                    <img
                                        src={collection.cover_image_url}
                                        alt={collection.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white">
                                        <FiArrowUpRight className="text-lg" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <h3 className="text-sm md:text-base font-semibold">
                                        {collection.name}
                                    </h3>

                                    <p className="text-[10px] text-neutral-400">
                                        {Number(collection.outfit_count || 0)} pieces
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                </div>
            )}
        </section>
    );
}