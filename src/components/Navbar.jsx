
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Logo from '../assets/logo.png';

import { IoBagOutline } from 'react-icons/io5';
import { FiMenu, FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

import {
    FaInstagram,
    FaFacebookF,
    FaXTwitter,
    FaWhatsapp
} from 'react-icons/fa6';

const CART_KEY = 'haute-n-halaal-cart';

// Include country code, without + or spaces.
const WHATSAPP_NUMBER = '2348137811382';

const formatPrice = (price) =>
    `₦${Number(price).toLocaleString('en-NG')}`;

const panelVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    closed: {
        x: '100%',
        transition: {
            delay: 0.55,
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const contentVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.065,
            delayChildren: 0.12
        }
    },
    closed: {
        transition: {
            staggerChildren: 0.055,
            staggerDirection: -1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 25 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    },
    closed: {
        opacity: 0,
        x: 25,
        transition: {
            duration: 0.18,
            ease: 'easeIn'
        }
    }
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Navbar background changes after the first viewport.
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY >= window.innerHeight);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    // Load cart and listen for updates from Shop.jsx.
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = JSON.parse(
                    localStorage.getItem(CART_KEY)
                ) || [];

                setCart(Array.isArray(savedCart) ? savedCart : []);
            } catch {
                setCart([]);
            }
        };

        loadCart();

        window.addEventListener('cartUpdated', loadCart);
        window.addEventListener('storage', loadCart);

        return () => {
            window.removeEventListener('cartUpdated', loadCart);
            window.removeEventListener('storage', loadCart);
        };
    }, []);

    const saveCart = (updatedCart) => {
        localStorage.setItem(
            CART_KEY,
            JSON.stringify(updatedCart)
        );

        setCart(updatedCart);

        window.dispatchEvent(
            new CustomEvent('cartUpdated', {
                detail: updatedCart
            })
        );
    };

    const updateQuantity = (id, size, change) => {
        const updatedCart = cart
            .map((item) => {
                if (item.id === id && item.size === size) {
                    return {
                        ...item,
                        quantity: item.quantity + change
                    };
                }

                return item;
            })
            .filter((item) => item.quantity > 0);

        saveCart(updatedCart);
    };

    const removeItem = (id, size) => {
        const updatedCart = cart.filter(
            (item) => !(item.id === id && item.size === size)
        );

        saveCart(updatedCart);
    };

    const handlePreOrder = () => {
        if (!cart.length || WHATSAPP_NUMBER === 'YOURNUMBER') {
            return;
        }

        const message = [
            'Hello Haute N Halaal! I would like to pre-order:',
            '',
            ...cart.map(
                (item, index) =>
                    `${index + 1}. ${item.name}\nSize: ${item.size}\nQuantity: ${item.quantity}\nPrice: ${formatPrice(item.price * item.quantity)}`
            ),
            '',
            `Total: ${formatPrice(subtotal)}`,
            '',
            'Please let me know the next steps. Thank you!'
        ].join('\n');

        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        const whatsappWindow = window.open(whatsappUrl, '_blank');

        if (whatsappWindow) {
            whatsappWindow.opener = null;
            saveCart([]);
            setCartOpen(false);
        }
    };

    return (
        <>
            {/* MAIN NAVBAR */}
            <div
                className={`fixed top-0 left-0 w-full overflow-x-hidden z-50 grid grid-cols-2 py-4 transition-colors duration-500 ${
                    isScrolled ? 'bg-white' : 'bg-transparent'
                }`}
            >

                {/* LOGO */}
                <div className="px-3 md:px-18 flex flex-row items-center">
                    <img
                        src={Logo}
                        className="h-14 w-13"
                        alt="Logo"
                    />

                    <div className="font-five text-[0.75em] font-bold px-2 flex flex-col justify-center items-center">
                        <p>HAUTE N</p>
                        <p className="-mt-1.5">HALAAL</p>
                    </div>
                </div>

                {/* NAV ACTIONS */}
                <div className="pr-3 md:pr-18 flex flex-row gap-8 justify-end items-center">

                    {/* CART BUTTON */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setCartOpen(true);
                        }}
                        aria-label={`Shopping bag, ${cartCount} items`}
                        className="relative flex items-center"
                    >
                        <IoBagOutline className="text-xl" />

                        {cartCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-black text-white rounded-full min-w-4 h-4 px-1 flex items-center justify-center text-[9px]">
                                {cartCount}
                            </div>
                        )}
                    </button>

                    {/* MENU BUTTON */}
                    <FiMenu
                        className="text-2xl cursor-pointer"
                        onClick={() => {
                            setCartOpen(false);
                            setIsOpen(true);
                        }}
                    />
                </div>
            </div>

            {/* CART DRAWER */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setCartOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60]"
                        />

                        <motion.div
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="closed"
                            className="fixed top-0 right-0 h-screen w-[80%] md:w-[30%] bg-white z-[70] rounded-l-2xl overflow-hidden"
                        >
                            <motion.div
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="closed"
                                className="h-full flex flex-col px-6 md:px-8 py-8 overflow-hidden"
                            >

                                {/* CART HEADER */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex justify-between items-center shrink-0"
                                >
                                    <div>
                                        <h2 className="font-five text-lg font-bold">
                                            Your Bag
                                        </h2>

                                        <p className="text-[10px] text-neutral-400 mt-1">
                                            {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>

                                    <FiX
                                        className="text-2xl cursor-pointer"
                                        onClick={() => setCartOpen(false)}
                                    />
                                </motion.div>

                                {/* CART CONTENT */}
                                {cart.length === 0 ? (
                                    <motion.div
                                        variants={itemVariants}
                                        className="flex-1 flex flex-col items-center justify-center text-center"
                                    >
                                        <IoBagOutline className="text-4xl text-neutral-300 mb-4" />

                                        <p className="font-five text-sm font-semibold">
                                            Your bag is empty
                                        </p>

                                        <p className="text-xs text-neutral-400 mt-2 max-w-[200px]">
                                            Looks like you haven't added anything yet.
                                        </p>

                                        <button
                                            onClick={() => setCartOpen(false)}
                                            className="mt-6 bg-black text-white rounded-full px-6 py-3 text-[10px] tracking-widest"
                                        >
                                            CONTINUE SHOPPING
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* CART ITEMS */}
                                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mt-6 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                                            {cart.map((item) => (
                                                <motion.div
                                                    key={`${item.id}-${item.size}`}
                                                    variants={itemVariants}
                                                    className="flex gap-3 py-4 border-b border-neutral-100"
                                                >
                                                    <div className="w-20 h-24 bg-neutral-50 rounded-lg shrink-0 overflow-hidden">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-medium">
                                                                    {item.name}
                                                                </p>

                                                                <p className="text-[10px] text-neutral-400 mt-1">
                                                                    Size: {item.size}
                                                                </p>
                                                            </div>

                                                            <button
                                                                onClick={() => removeItem(item.id, item.size)}
                                                                aria-label={`Remove ${item.name}`}
                                                                className="text-neutral-400 hover:text-black shrink-0"
                                                            >
                                                                <FiTrash2 className="text-sm" />
                                                            </button>
                                                        </div>

                                                        <div className="flex justify-between items-center mt-4 gap-2">
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.size, -1)}
                                                                    aria-label="Decrease quantity"
                                                                    className="text-sm"
                                                                >
                                                                    <FiMinus />
                                                                </button>

                                                                <div className="text-xs">
                                                                    {item.quantity}
                                                                </div>

                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.size, 1)}
                                                                    aria-label="Increase quantity"
                                                                    className="text-sm"
                                                                >
                                                                    <FiPlus />
                                                                </button>
                                                            </div>

                                                            <p className="text-xs font-semibold whitespace-nowrap">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                        </div>

                                        {/* CART FOOTER */}
                                        <motion.div
                                            variants={itemVariants}
                                            className="pt-5 border-t border-neutral-100 shrink-0"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-xs text-neutral-500">
                                                    Subtotal
                                                </p>

                                                <p className="text-base font-semibold">
                                                    {formatPrice(subtotal)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={handlePreOrder}
                                                className="w-full bg-black text-white rounded-full py-4 text-[10px] tracking-[0.15em] font-semibold hover:bg-neutral-800 transition-colors"
                                            >
                                                PRE-ORDER VIA WHATSAPP
                                            </button>

                                            <p className="text-[9px] text-neutral-400 text-center mt-3">
                                                Your order will be confirmed with us on WhatsApp.
                                            </p>
                                        </motion.div>
                                    </>
                                )}

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* NAVIGATION DRAWER */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60]"
                        />

                        <motion.div
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="closed"
                            className="fixed top-0 right-0 h-screen w-[80%] md:w-[40%] lg:w-[20%] bg-white z-[70] rounded-l-2xl overflow-hidden"
                        >
                            <motion.div
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="closed"
                                className="h-full flex flex-col px-8 md:px-10 py-8 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >

                                {/* CLOSE BUTTON */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex justify-end shrink-0"
                                >
                                    <FiX
                                        className="text-2xl cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    />
                                </motion.div>

                                {/* LOGO */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center mt-5 shrink-0"
                                >
                                    <img
                                        src={Logo}
                                        className="h-12 w-11"
                                        alt="Logo"
                                    />

                                    <div className="font-five text-[0.7em] font-bold px-2 flex flex-col items-center">
                                        <p>HAUTE N</p>
                                        <p className="-mt-1.5">HALAAL</p>
                                    </div>
                                </motion.div>

                                {/* NAV LINKS */}
                                <div className="flex flex-col gap-4 mt-8 font-six text-lg">
                                    {['Home', 'Shop', 'About Us', 'Contact'].map((link) => (
                                        <motion.a
                                            key={link}
                                            href="#"
                                            variants={itemVariants}
                                            onClick={() => setIsOpen(false)}
                                            className="w-fit"
                                        >
                                            {link}
                                        </motion.a>
                                    ))}
                                </div>

                                {/* SOCIAL LINKS */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center gap-4 mt-8 pb-3"
                                >
                                    <a href="#" aria-label="Instagram">
                                        <FaInstagram className="text-xl" />
                                    </a>

                                    <a href="#" aria-label="Facebook">
                                        <FaFacebookF className="text-xl" />
                                    </a>

                                    <a href="#" aria-label="X">
                                        <FaXTwitter className="text-xl" />
                                    </a>

                                    <a href="#" aria-label="WhatsApp">
                                        <FaWhatsapp className="text-xl" />
                                    </a>
                                </motion.div>

                                {/* WHATSAPP CTA */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-6 flex flex-col gap-3"
                                >
                                    <p className="font-five text-sm">
                                        Got a special request?
                                    </p>

                                    <a
                                        href="https://wa.me/YOURNUMBER"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full bg-black rounded-full text-white py-3 px-4 text-center text-xs tracking-widest font-five hover:bg-neutral-800 transition-colors"
                                    >
                                        CHAT WITH US
                                    </a>
                                </motion.div>

                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
