
import { motion } from 'framer-motion';

import {
    FaWhatsapp,
    FaInstagram,
    FaXTwitter
} from 'react-icons/fa6';

import { FiArrowUpRight } from 'react-icons/fi';

import whatsapp from '../assets/whatsapp.png';
import Logo from '../assets/logo.png';

const smoothEase = [0.22, 1, 0.36, 1];

const leftVariants = {
    hidden: {
        opacity: 0,
        x: -18
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.9,
            ease: smoothEase
        }
    }
};

const rightVariants = {
    hidden: {
        opacity: 0,
        x: 18
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1.1,
            ease: smoothEase
        }
    }
};

const fadeVariants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            ease: smoothEase
        }
    }
};

export default function Contact() {
    return (
        <section id="contact" className="relative w-full bg-white font-six">

            {/* CONTACT */}
            <div className="relative min-h-[85vh] flex items-center overflow-hidden">

                <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">

                    {/* LEFT CONTENT */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex flex-col items-start"
                    >

                        {/* EYEBROW */}
                        <motion.div
                            variants={leftVariants}
                            className="flex items-center gap-3 mb-5"
                        >
                            <div className="w-10 md:w-14 h-[1.5px] bg-black shrink-0" />

                            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold tracking-[0.15em] uppercase">
                                <p>We're Here</p>
                                <p>•</p>
                                <p>Let's Connect</p>
                            </div>
                        </motion.div>

                        {/* HEADING */}
                        <motion.h2
                            variants={rightVariants}
                            className="text-5xl md:text-[4.5rem] lg:text-[5rem] font-bold leading-[0.95] tracking-[-0.055em] text-black"
                        >
                            Let's Talk
                            <br />
                            on WhatsApp.
                        </motion.h2>

                        {/* DESCRIPTION */}
                        <motion.p
                            variants={fadeVariants}
                            className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed max-w-full"
                        >
                            Have a question, need help, or want to place an order?
                            <br className="hidden md:block" />
                            Chat with us directly on WhatsApp.
                        </motion.p>

                        {/* CTA */}
                        <motion.div
                            variants={fadeVariants}
                            className="mt-5"
                        >
                            <a
                                href="https://wa.me/234XXXXXXXXXX"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-4 bg-black text-white rounded-full px-6 py-3.5 text-xs md:text-sm transition-all duration-300 hover:bg-neutral-800 hover:gap-6"
                            >
                                <FaWhatsapp className="text-base md:text-lg" />

                                <div>Chat on WhatsApp</div>

                                <FiArrowUpRight className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* RIGHT IMAGE */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={rightVariants}
                        className="relative flex items-center justify-center min-h-[350px] md:min-h-[550px]"
                    >
                        <img
                            src={whatsapp}
                            alt="3D WhatsApp icon"
                            className="relative z-10 w-full max-w-[580px] object-contain transition-transform duration-700 hover:scale-105"
                        />
                    </motion.div>

                </div>
            </div>

            
{/* FOOTER */}
<footer className="border-t border-neutral-200">

    <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-7">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            {/* BRAND */}
            <a href="/" className="flex items-center gap-3 w-fit">

                <img
                    src={Logo}
                    alt="Haute N Halaal logo"
                    className="w-8 h-8 object-contain"
                />

                <div className="flex flex-col">
                    <p className="text-xs font-bold tracking-[0.12em] text-black uppercase">
                        Haute N Halaal
                    </p>

                </div>

            </a>

            {/* SOCIALS */}
            <div className="flex items-center gap-5 text-base text-neutral-500">

                <a
                    href="#"
                    aria-label="Instagram"
                    className="hover:text-black transition-colors"
                >
                    <FaInstagram />
                </a>

                <a
                    href="#"
                    aria-label="X"
                    className="hover:text-black transition-colors"
                >
                    <FaXTwitter />
                </a>

                <a
                    href="https://wa.me/234XXXXXXXXXX"
                    aria-label="WhatsApp"
                    className="hover:text-black transition-colors"
                >
                    <FaWhatsapp />
                </a>

            </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-6 pt-5 border-neutral-200">
            <p className="text-[10px] text-neutral-400">
                © {new Date().getFullYear()} Haute N Halaal. All rights reserved.
            </p>
        </div>

    </div>
</footer>


        </section>
    );
}
