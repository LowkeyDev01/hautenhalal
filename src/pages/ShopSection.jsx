
import { useEffect, useState } from 'react';

import {
    FiPlus,
    FiX,
    FiMinus,
    FiChevronDown,
    FiCheck,
    FiLoader
} from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

const sizes = ['S', 'M', 'L', 'XL'];
const CART_KEY = 'haute-n-halaal-cart';

const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString('en-NG')}`;
};

const getSavedCart = () => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
};

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [sort, setSort] = useState('newest');
    const [cartCount, setCartCount] = useState(0);
    const [added, setAdded] = useState(false);

    // ==========================================
    // FETCH PRODUCTS FROM BACKEND
    // ==========================================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(
                    `${API_URL}/api/products`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to fetch products.');
                }

                setProducts(data.products || []);

            } catch (error) {
                console.error('Products fetch error:', error);
                setError('We couldn’t load the collection. Please try again.');

            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // ==========================================
    // CART COUNT
    // ==========================================

    useEffect(() => {
        const updateCartCount = () => {
            const cart = getSavedCart();

            setCartCount(
                cart.reduce((total, item) => total + item.quantity, 0)
            );
        };

        updateCartCount();

        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('storage', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    // ==========================================
    // SORT PRODUCTS
    // ==========================================

    const sortedProducts = [...products].sort((a, b) => {
        if (sort === 'low') {
            return Number(a.price) - Number(b.price);
        }

        if (sort === 'high') {
            return Number(b.price) - Number(a.price);
        }

        return new Date(b.created_at) - new Date(a.created_at);
    });

    // ==========================================
    // MODAL
    // ==========================================

    const openModal = (product) => {
        setSelectedProduct(product);
        setSelectedSize('');
        setQuantity(1);
        setAdded(false);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setSelectedSize('');
        setQuantity(1);
        setAdded(false);
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = () => {
        if (!selectedProduct || !selectedSize || added) return;

        const cart = getSavedCart();

        const existingItem = cart.find(
            (item) =>
                item.id === selectedProduct.id &&
                item.size === selectedSize
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = cart.map((item) =>
                item.id === selectedProduct.id &&
                item.size === selectedSize
                    ? {
                        ...item,
                        quantity: item.quantity + quantity
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...cart,
                {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: Number(selectedProduct.price),
                    image: selectedProduct.image_url,
                    size: selectedSize,
                    quantity
                }
            ];
        }

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(updatedCart)
        );

        const newCount = updatedCart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        setCartCount(newCount);

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
    // RETRY FETCH
    // ==========================================

    const retryFetch = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setProducts(data.products || []);

        } catch (error) {
            console.error(error);
            setError('We couldn’t load the collection. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="shop"
            className="bg-white px-6 md:px-12 py-16 md:py-20 font-six"
        >

            {/* SHOP HEADER */}

            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">

                <div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
                        Shop.
                    </h1>

                    <p className="text-sm text-neutral-500 mt-3">
                        Find your next everyday favourite.
                    </p>
                </div>

                {/* SORT SELECTOR */}

                <div className="relative flex items-center border border-neutral-300 rounded-full px-4 py-2.5 hover:border-neutral-500 transition-colors w-fit">

                    <FiCheck className="text-neutral-400 text-xs mr-2" />

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-transparent text-xs outline-none appearance-none cursor-pointer pr-5"
                    >
                        <option value="newest">Newest</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>

                    <FiChevronDown className="absolute right-3 text-xs pointer-events-none" />

                </div>

            </div>

            {/* LOADING */}

            {loading && (
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">

                    <FiLoader className="text-2xl animate-spin" />

                    <p className="text-xs text-neutral-500">
                        Loading collection...
                    </p>

                </div>
            )}

            {/* ERROR */}

            {!loading && error && (
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">

                    <p className="text-sm text-neutral-500">
                        {error}
                    </p>

                    <button
                        onClick={retryFetch}
                        className="bg-black text-white px-6 py-3 rounded-full text-xs"
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* EMPTY COLLECTION */}

            {!loading && !error && products.length === 0 && (
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">

                    <h2 className="text-xl font-semibold">
                        Nothing here just yet.
                    </h2>

                    <p className="text-sm text-neutral-500">
                        Our collection is getting ready. Check back soon.
                    </p>

                </div>
            )}

            {/* PRODUCT GRID */}

            {!loading && !error && products.length > 0 && (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">

                    {sortedProducts.map((product) => (

                        <div key={product.id} className="group">

                            {/* PRODUCT IMAGE */}

                            <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden rounded-lg">

                                <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-full">
                                    <p className="text-[9px] uppercase tracking-wider">
                                        Pre-order
                                    </p>
                                </div>

                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                />

                                <button
                                    onClick={() => openModal(product)}
                                    aria-label={`Choose size for ${product.name}`}
                                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    <FiPlus className="text-lg" />
                                </button>

                            </div>

                            {/* PRODUCT DETAILS */}

                            <div className="mt-3">

                                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                                    {product.category}
                                </p>

                                <p className="text-sm font-medium text-black">
                                    {product.name}
                                </p>

                                <p className="text-sm font-semibold mt-1">
                                    {formatPrice(product.price)}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* SIZE SELECTION MODAL */}

            {selectedProduct && (

                <div
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Select size for ${selectedProduct.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white w-full max-w-md rounded-xl p-5 md:p-7"
                    >

                        {/* CLOSE BUTTON */}

                        <button
                            onClick={closeModal}
                            aria-label="Close modal"
                            className="absolute top-5 right-5 text-xl"
                        >
                            <FiX />
                        </button>

                        {/* PRODUCT INFORMATION */}

                        <div className="flex gap-4 items-center pr-8">

                            <div className="w-24 aspect-[4/5] bg-neutral-50 rounded-lg overflow-hidden shrink-0">

                                <img
                                    src={selectedProduct.image_url}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-contain p-2"
                                />

                            </div>

                            <div>

                                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                                    Pre-order
                                </p>

                                <h2 className="text-base font-semibold">
                                    {selectedProduct.name}
                                </h2>

                                <p className="text-sm font-semibold mt-2">
                                    {formatPrice(selectedProduct.price)}
                                </p>

                            </div>

                        </div>

                        <div className="border-t border-neutral-100 my-6" />

                        {/* SIZE SELECTION */}

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
                                    className="text-lg disabled:opacity-30"
                                    aria-label="Decrease quantity"
                                >
                                    <FiMinus />
                                </button>

                                <p className="text-sm font-medium w-4 text-center">
                                    {quantity}
                                </p>

                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="text-lg"
                                    aria-label="Increase quantity"
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
                            {added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
                        </button>

                    </div>

                </div>

            )}

        </section>
    );
}
