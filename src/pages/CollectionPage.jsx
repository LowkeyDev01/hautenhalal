import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
    FiPlus,
    FiX,
    FiMinus,
    FiArrowLeft,
    FiLoader
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const CART_KEY = 'haute-n-halaal-cart';
const sizes = ['S', 'M', 'L', 'XL'];

const formatPrice = (price) =>
    `₦${Number(price).toLocaleString('en-NG')}`;

const getSavedCart = () => {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
};

export default function CollectionPage() {
    const { slug } = useParams();

    const [collection, setCollection] = useState(null);
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const [selectedOutfit, setSelectedOutfit] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // ==========================================
    // FETCH COLLECTION
    // ==========================================

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setLoading(true);
                setError('');
                setNotFound(false);

                setCollection(null);
                setOutfits([]);

                const response = await fetch(
                    `${API_URL}/api/collections/${encodeURIComponent(slug)}`
                );

                const data = await response.json();

                if (response.status === 404) {
                    setNotFound(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load this collection.'
                    );
                }

                setCollection(data.collection);
                setOutfits(data.outfits || []);

            } catch (error) {
                console.error('Collection fetch error:', error);
                setError('We couldn’t load this collection. Please try again.');

            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [slug]);

    // ==========================================
    // MODAL
    // ==========================================

    const openModal = (outfit) => {
        setSelectedOutfit(outfit);
        setSelectedSize('');
        setQuantity(1);
        setAdded(false);
    };

    const closeModal = () => {
        setSelectedOutfit(null);
        setSelectedSize('');
        setQuantity(1);
        setAdded(false);
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = () => {
        if (!selectedOutfit || !selectedSize || added) return;

        const cart = getSavedCart();

        const existingItem = cart.find(
            (item) =>
                String(item.id) === String(selectedOutfit.id) &&
                item.size === selectedSize
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map((item) =>
                String(item.id) === String(selectedOutfit.id) &&
                item.size === selectedSize
                    ? {
                        ...item,
                        quantity: Number(item.quantity) + quantity
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...cart,
                {
                    id: selectedOutfit.id,
                    name: selectedOutfit.name,
                    price: Number(selectedOutfit.price),
                    image: selectedOutfit.image_url,
                    size: selectedSize,
                    quantity
                }
            ];
        }

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(updatedCart)
        );

        window.dispatchEvent(
            new CustomEvent('cartUpdated', {
                detail: updatedCart
            })
        );

        setAdded(true);

        setTimeout(() => {
            closeModal();
        }, 700);
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center font-six">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="text-2xl animate-spin" />

                    <p className="text-xs text-neutral-500">
                        Loading collection...
                    </p>
                </div>
            </main>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error || notFound || !collection) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center font-six">

                <h1 className="text-3xl font-bold">
                    {notFound ? 'Collection not found.' : 'Something went wrong.'}
                </h1>

                <p className="text-sm text-neutral-500 mt-3">
                    {notFound
                        ? 'This collection may no longer be available.'
                        : error}
                </p>

                {!notFound && (
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-black text-white px-6 py-3 rounded-full text-xs"
                    >
                        Try Again
                    </button>
                )}

                <Link
                    to="/"
                    className="mt-6 text-xs underline underline-offset-4"
                >
                    Back to Home
                </Link>

            </main>
        );
    }

    return (
        <main className="bg-white min-h-screen font-six">

            {/* COLLECTION HERO */}

            <section className="pt-24 px-6 md:px-12">

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-black transition-colors mb-8"
                >
                    <FiArrowLeft />
                    Back to Home
                </Link>

                <div className="relative w-full aspect-[16/9] md:aspect-[21/8] overflow-hidden rounded-xl bg-neutral-100">

                    {collection.cover_image_url && (
                        <img
                            src={collection.cover_image_url}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/20" />

                    <div className="absolute inset-0 flex items-end p-6 md:p-12">
                        <div>
                            <p className="text-[10px] text-white uppercase tracking-[0.2em] mb-3">
                                Haute N Halaal Collection
                            </p>

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                                {collection.name}.
                            </h1>
                        </div>
                    </div>

                </div>

            </section>

            {/* OUTFITS */}

            <section className="px-6 md:px-12 py-16 md:py-20">

                <div className="flex items-end justify-between mb-10">

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3">
                            Explore the pieces
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            The Collection.
                        </h2>
                    </div>

                    <p className="text-xs text-neutral-400">
                        {outfits.length} {outfits.length === 1 ? 'piece' : 'pieces'}
                    </p>

                </div>

                {outfits.length === 0 ? (
                    <div className="min-h-[250px] flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold">
                            Pieces coming soon.
                        </h3>

                        <p className="text-sm text-neutral-500 mt-2">
                            We're preparing something special.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">

                        {outfits.map((outfit) => (
                            <div key={outfit.id} className="group">

                                <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-lg">

                                    <img
                                        src={outfit.image_url}
                                        alt={outfit.name}
                                        loading="lazy"
                                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <button
                                        onClick={() => openModal(outfit)}
                                        aria-label={`Choose size for ${outfit.name}`}
                                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        <FiPlus className="text-lg" />
                                    </button>

                                </div>

                                <div className="mt-3">
                                    <p className="text-sm font-medium text-black">
                                        {outfit.name}
                                    </p>

                                    <p className="text-sm font-semibold mt-1">
                                        {formatPrice(outfit.price)}
                                    </p>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

            {/* SIZE SELECTION MODAL */}

            {selectedOutfit && (
                <div
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Select size for ${selectedOutfit.name}`}
                        onClick={(event) => event.stopPropagation()}
                        className="relative bg-white w-full max-w-md rounded-xl p-5 md:p-7"
                    >

                        <button
                            onClick={closeModal}
                            aria-label="Close modal"
                            className="absolute top-5 right-5 text-xl"
                        >
                            <FiX />
                        </button>

                        {/* OUTFIT INFORMATION */}

                        <div className="flex gap-4 items-center pr-8">

                            <div className="w-24 aspect-[4/5] bg-neutral-50 rounded-lg overflow-hidden shrink-0">
                                <img
                                    src={selectedOutfit.image_url}
                                    alt={selectedOutfit.name}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                                    {collection.name}
                                </p>

                                <h2 className="text-base font-semibold">
                                    {selectedOutfit.name}
                                </h2>

                                <p className="text-sm font-semibold mt-2">
                                    {formatPrice(selectedOutfit.price)}
                                </p>
                            </div>

                        </div>

                        <div className="border-t border-neutral-100 my-6" />

                        {/* SIZE */}

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-semibold">
                                    Select your size
                                </p>

                                <p className="text-[10px] text-neutral-400">
                                    Required
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 border rounded-lg text-sm transition-all duration-200 ${
                                            selectedSize === size
                                                ? 'bg-black text-white border-black'
                                                : 'border-neutral-200 hover:border-black'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* QUANTITY */}

                        <div className="flex justify-between items-center mt-7">

                            <p className="text-sm font-semibold">
                                Quantity
                            </p>

                            <div className="flex items-center gap-5">

                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity === 1}
                                    aria-label="Decrease quantity"
                                    className="text-lg disabled:opacity-30"
                                >
                                    <FiMinus />
                                </button>

                                <p className="text-sm font-medium w-4 text-center">
                                    {quantity}
                                </p>

                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    aria-label="Increase quantity"
                                    className="text-lg"
                                >
                                    <FiPlus />
                                </button>

                            </div>

                        </div>

                        {/* ADD TO CART */}

                        <button
                            onClick={addToCart}
                            disabled={!selectedSize || added}
                            className={`w-full mt-8 py-4 rounded-full text-xs tracking-widest font-semibold transition-all duration-300 ${
                                added
                                    ? 'bg-neutral-200 text-neutral-500'
                                    : !selectedSize
                                        ? 'bg-neutral-200 text-neutral-400'
                                        : 'bg-black text-white hover:bg-neutral-800'
                            }`}
                        >
                            {added ? 'ADDED TO CART ✓' : 'ADD TO BAG'}
                        </button>

                    </div>
                </div>
            )}

        </main>
    );
}