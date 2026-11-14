
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiGrid,
    FiPackage,
    FiLayers,
    FiPlus,
    FiLogOut,
    FiTrash2,
    FiX,
    FiLoader,
    FiImage,
    FiUploadCloud,
    FiArrowUpRight,
    FiSearch,
    FiExternalLink,
    FiCheck
} from "react-icons/fi";

import Logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL;
const smoothEase = [0.22, 1, 0.36, 1];

const formatPrice = (price) =>
    `₦${Number(price || 0).toLocaleString("en-NG")}`;

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [authMode, setAuthMode] = useState("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCollections, setLoadingCollections] = useState(false);

    const [productSearch, setProductSearch] = useState("");
    const [collectionSearch, setCollectionSearch] = useState("");

    const [deletingProductId, setDeletingProductId] = useState(null);
    const [deletingCollectionId, setDeletingCollectionId] = useState(null);

    // PRODUCT MODAL
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [productPreview, setProductPreview] = useState("");
    const [uploadingProduct, setUploadingProduct] = useState(false);
    const [productError, setProductError] = useState("");
    const [productSuccess, setProductSuccess] = useState("");

    // COLLECTION MODAL
    const [collectionModalOpen, setCollectionModalOpen] = useState(false);
    const [collectionName, setCollectionName] = useState("");
    const [collectionImage, setCollectionImage] = useState(null);
    const [collectionPreview, setCollectionPreview] = useState("");
    const [uploadingCollection, setUploadingCollection] = useState(false);
    const [collectionError, setCollectionError] = useState("");
    const [collectionSuccess, setCollectionSuccess] = useState("");

    // COLLECTION DETAILS + OUTFITS
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [outfits, setOutfits] = useState([]);
    const [loadingOutfits, setLoadingOutfits] = useState(false);

    // OUTFIT MODAL
    const [outfitModalOpen, setOutfitModalOpen] = useState(false);
    const [outfitName, setOutfitName] = useState("");
    const [outfitPrice, setOutfitPrice] = useState("");
    const [outfitImage, setOutfitImage] = useState(null);
    const [outfitPreview, setOutfitPreview] = useState("");
    const [uploadingOutfit, setUploadingOutfit] = useState(false);
    const [outfitError, setOutfitError] = useState("");
    const [outfitSuccess, setOutfitSuccess] = useState("");
    const [deletingOutfitId, setDeletingOutfitId] = useState(null);

    // ==========================================
    // EFFECTS
    // ==========================================

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        return () => {
            if (productPreview) URL.revokeObjectURL(productPreview);
        };
    }, [productPreview]);

    useEffect(() => {
        return () => {
            if (collectionPreview) URL.revokeObjectURL(collectionPreview);
        };
    }, [collectionPreview]);

    useEffect(() => {
        return () => {
            if (outfitPreview) URL.revokeObjectURL(outfitPreview);
        };
    }, [outfitPreview]);

    useEffect(() => {
        if (user) {
            fetchProducts();
            fetchCollections();
        }
    }, [user]);

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                credentials: "include"
            });

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();
            setUser(data.user || data);
        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
        } finally {
            setCheckingAuth(false);
        }
    };

    const handleAuth = async (event) => {
        event.preventDefault();

        setAuthLoading(true);
        setAuthError("");

        const endpoint =
            authMode === "register"
                ? "/api/auth/register"
                : "/api/auth/login";

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed.");
            }

            setUser(data.user || data);
            setUsername("");
            setPassword("");
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setProducts([]);
            setCollections([]);
            setOutfits([]);
            setSelectedCollection(null);
            setActivePage("dashboard");
        }
    };

    const navigate = (page) => {
        setActivePage(page);
        setSidebarOpen(false);
    };

    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {
        setLoadingProducts(true);

        try {
            const response = await fetch(`${API_URL}/api/products`, {
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not load products.");
            }

            setProducts(data.products || []);
        } catch (error) {
            console.error("Products error:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // ==========================================
    // FETCH COLLECTIONS
    // ==========================================

    const fetchCollections = async () => {
        setLoadingCollections(true);

        try {
            const response = await fetch(
                `${API_URL}/api/admin/collections`,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not load collections.");
            }

            setCollections(data.collections || []);
        } catch (error) {
            console.error("Collections error:", error);
        } finally {
            setLoadingCollections(false);
        }
    };

    // ==========================================
    // PRODUCT IMAGE + FORM
    // ==========================================

    const handleProductImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (productPreview) URL.revokeObjectURL(productPreview);

        setProductImage(file);
        setProductPreview(URL.createObjectURL(file));
    };

    const resetProductForm = () => {
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductCategory("");
        setProductImage(null);
        setProductPreview("");
        setProductError("");
        setProductSuccess("");

        const input = document.getElementById("product-image");
        if (input) input.value = "";
    };

    const closeProductModal = () => {
        if (uploadingProduct) return;

        setProductModalOpen(false);
        resetProductForm();
    };

    const handleProductUpload = async (event) => {
        event.preventDefault();

        setProductError("");
        setProductSuccess("");

        if (!productImage) {
            setProductError("Please select a product image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("price", productPrice);
        formData.append("category", productCategory);
        formData.append("image", productImage);

        setUploadingProduct(true);

        try {
            const response = await fetch(`${API_URL}/api/products`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Product upload failed.");
            }

            setProductSuccess("Product uploaded successfully.");
            await fetchProducts();

            setTimeout(() => {
                setProductModalOpen(false);
                resetProductForm();
            }, 800);
        } catch (error) {
            setProductError(error.message);
        } finally {
            setUploadingProduct(false);
        }
    };

    const handleProductDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        setDeletingProductId(productId);

        try {
            const response = await fetch(
                `${API_URL}/api/products/${productId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete product.");
            }

            setProducts((current) =>
                current.filter((product) => product.id !== productId)
            );
        } catch (error) {
            window.alert(error.message);
        } finally {
            setDeletingProductId(null);
        }
    };

    // ==========================================
    // COLLECTION IMAGE + FORM
    // ==========================================

    const handleCollectionImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (collectionPreview) URL.revokeObjectURL(collectionPreview);

        setCollectionImage(file);
        setCollectionPreview(URL.createObjectURL(file));
    };

    const resetCollectionForm = () => {
        setCollectionName("");
        setCollectionImage(null);
        setCollectionPreview("");
        setCollectionError("");
        setCollectionSuccess("");

        const input = document.getElementById("collection-image");
        if (input) input.value = "";
    };

    const closeCollectionModal = () => {
        if (uploadingCollection) return;

        setCollectionModalOpen(false);
        resetCollectionForm();
    };

    const handleCollectionUpload = async (event) => {
        event.preventDefault();

        setCollectionError("");
        setCollectionSuccess("");

        if (!collectionImage) {
            setCollectionError("Please select a collection image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", collectionName);
        formData.append("image", collectionImage);

        setUploadingCollection(true);

        try {
            const response = await fetch(`${API_URL}/api/collections`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Collection upload failed.");
            }

            setCollectionSuccess("Collection created successfully.");
            await fetchCollections();

            setTimeout(() => {
                setCollectionModalOpen(false);
                resetCollectionForm();
            }, 800);
        } catch (error) {
            setCollectionError(error.message);
        } finally {
            setUploadingCollection(false);
        }
    };

    const handleCollectionDelete = async (collectionId) => {
        if (!window.confirm("Are you sure you want to delete this collection?")) {
            return;
        }

        setDeletingCollectionId(collectionId);

        try {
            const response = await fetch(
                `${API_URL}/api/collections/${collectionId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete collection.");
            }

            setCollections((current) =>
                current.filter((collection) => collection.id !== collectionId)
            );

            if (selectedCollection?.id === collectionId) {
                setSelectedCollection(null);
                setOutfits([]);
                setActivePage("collections");
            }
        } catch (error) {
            window.alert(error.message);
        } finally {
            setDeletingCollectionId(null);
        }
    };

    // ==========================================
    // COLLECTION OUTFITS
    // ==========================================

    const fetchCollectionDetails = async (collectionId) => {
        setLoadingOutfits(true);
        setSelectedCollection(null);
        setOutfits([]);
        setActivePage("collection-details");

        try {
            const response = await fetch(
                `${API_URL}/api/admin/collections/${collectionId}`,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not load collection.");
            }

            setSelectedCollection(data.collection);
            setOutfits(data.outfits || []);
        } catch (error) {
            window.alert(error.message);
            setActivePage("collections");
        } finally {
            setLoadingOutfits(false);
        }
    };

    const handleOutfitImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (outfitPreview) {
            URL.revokeObjectURL(outfitPreview);
        }

        setOutfitImage(file);
        setOutfitPreview(URL.createObjectURL(file));
    };

    const resetOutfitForm = () => {
        setOutfitName("");
        setOutfitPrice("");
        setOutfitImage(null);
        setOutfitPreview("");
        setOutfitError("");
        setOutfitSuccess("");

        const input = document.getElementById("outfit-image");
        if (input) input.value = "";
    };

    const closeOutfitModal = () => {
        if (uploadingOutfit) return;

        setOutfitModalOpen(false);
        resetOutfitForm();
    };

    const handleOutfitUpload = async (event) => {
        event.preventDefault();

        setOutfitError("");
        setOutfitSuccess("");

        if (!selectedCollection) {
            setOutfitError("No collection selected.");
            return;
        }

        if (!outfitName.trim()) {
            setOutfitError("Please enter an outfit name.");
            return;
        }

        if (outfitPrice === "" || !Number.isFinite(Number(outfitPrice)) || Number(outfitPrice) < 0) {
            setOutfitError("Please enter a valid outfit price.");
            return;
        }

        if (!outfitImage) {
            setOutfitError("Please select an outfit image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", outfitName.trim());
        formData.append("price", outfitPrice);
        formData.append("image", outfitImage);

        setUploadingOutfit(true);

        try {
            const response = await fetch(
                `${API_URL}/api/collections/${selectedCollection.id}/outfits`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Outfit upload failed.");
            }

            setOutfitSuccess("Outfit added successfully.");

            await fetchCollectionDetails(selectedCollection.id);

            setTimeout(() => {
                setOutfitModalOpen(false);
                resetOutfitForm();
            }, 800);
        } catch (error) {
            setOutfitError(error.message);
        } finally {
            setUploadingOutfit(false);
        }
    };

    const handleOutfitDelete = async (outfitId) => {
        if (!window.confirm("Are you sure you want to delete this outfit?")) {
            return;
        }

        setDeletingOutfitId(outfitId);

        try {
            const response = await fetch(
                `${API_URL}/api/outfits/${outfitId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not delete outfit.");
            }

            setOutfits((current) =>
                current.filter((outfit) => outfit.id !== outfitId)
            );

            setCollections((current) =>
                current.map((collection) =>
                    collection.id === selectedCollection?.id
                        ? {
                            ...collection,
                            outfit_count: Math.max(
                                0,
                                Number(collection.outfit_count || 0) - 1
                            )
                        }
                        : collection
                )
            );
        } catch (error) {
            window.alert(error.message);
        } finally {
            setDeletingOutfitId(null);
        }
    };

    // ==========================================
    // FILTERS
    // ==========================================

    const filteredProducts = products.filter((product) =>
        `${product.name} ${product.category}`
            .toLowerCase()
            .includes(productSearch.toLowerCase())
    );

    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(collectionSearch.toLowerCase())
    );

    // ==========================================
    // AUTH LOADING
    // ==========================================

    if (checkingAuth) {
        return (
            <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
                <FiLoader className="animate-spin text-2xl" />
            </main>
        );
    }

    // ==========================================
    // LOGIN
    // ==========================================

    if (!user) {
        return (
            <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-5 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: smoothEase }}
                    className="w-full max-w-[440px] bg-white px-7 py-12 md:px-12 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"
                >
                    <div className="flex justify-center">
                        <a href="/">
                            <img
                                src={Logo}
                                alt="Haute N Halaal"
                                className="w-[150px] h-auto object-contain"
                            />
                        </a>
                    </div>

                    <div className="mt-12 text-center">
                        <h1 className="mt-4 text-3xl font-medium tracking-tight">
                            {authMode === "login" ? "Sign in." : "Create account."}
                        </h1>

                        <p className="mt-3 text-sm text-neutral-400">
                            {authMode === "login"
                                ? "Access your store dashboard."
                                : "Create your administrator account."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="mt-10 space-y-6">
                        <div>
                            <label className="mb-2 block text-[11px] uppercase tracking-wider text-neutral-500">
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                required
                                autoComplete="username"
                                className="w-full border-b border-neutral-200 py-3 text-sm outline-none transition-colors focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] uppercase tracking-wider text-neutral-500">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                required
                                autoComplete={
                                    authMode === "login"
                                        ? "current-password"
                                        : "new-password"
                                }
                                className="w-full border-b border-neutral-200 py-3 text-sm outline-none transition-colors focus:border-black"
                            />
                        </div>

                        {authError && (
                            <p className="text-xs text-red-600">{authError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            {authLoading && <FiLoader className="animate-spin" />}
                            {authLoading
                                ? "Please wait..."
                                : authMode === "login"
                                    ? "Sign in"
                                    : "Create account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-neutral-400">
                        {authMode === "login" ? (
                            <>
                                New administrator?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode("register");
                                        setAuthError("");
                                    }}
                                    className="text-black underline underline-offset-4"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode("login");
                                        setAuthError("");
                                    }}
                                    className="text-black underline underline-offset-4"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </main>
        );
    }

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    return (
        <main className="min-h-screen bg-[#f8f8f6] text-[#171717]">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                        aria-label="Close navigation"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-neutral-100 bg-white px-7 py-8 transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <a href="/" className="flex items-center justify-center">
                    <img
                        src={Logo}
                        alt="Haute N Halaal"
                        className="w-[155px] h-auto object-contain"
                    />
                </a>

                <p className="mt-14 text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                    Workspace
                </p>

                <nav className="mt-5 space-y-2">
                    <SidebarButton
                        active={activePage === "dashboard"}
                        onClick={() => navigate("dashboard")}
                        icon={<FiGrid />}
                    >
                        Dashboard
                    </SidebarButton>

                    <SidebarButton
                        active={activePage === "products"}
                        onClick={() => navigate("products")}
                        icon={<FiPackage />}
                    >
                        Products
                    </SidebarButton>

                    <SidebarButton
                        active={
                            activePage === "collections" ||
                            activePage === "collection-details"
                        }
                        onClick={() => navigate("collections")}
                        icon={<FiLayers />}
                    >
                        Collections
                    </SidebarButton>
                </nav>

                

                <div className="mt-auto border-t border-neutral-100 pt-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium uppercase">
                            {user.username?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium">
                                {user.username}
                            </p>
                            <p className="mt-1 text-[10px] text-neutral-400">
                                Administrator
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-3 text-xs text-neutral-500 transition-colors hover:text-red-600"
                    >
                        <FiLogOut />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="min-h-screen lg:ml-[260px]">
                <div className="mx-auto max-w-[1500px] px-5 py-9 md:px-10 md:py-12">

                    {/* DASHBOARD */}
                    {activePage === "dashboard" && (
                        <>
                            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                        Your workspace
                                    </p>

                                    <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                                        Welcome back, {user.username}.
                                    </h1>

                                    <p className="mt-3 text-sm text-neutral-400">
                                        Here's what's happening with your store.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        resetProductForm();
                                        setProductModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-3 bg-black px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800"
                                >
                                    <FiPlus />
                                    Add new product
                                </button>
                            </div>

                            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <StatCard
                                    label="Total products"
                                    value={products.length}
                                    icon={<FiPackage />}
                                />

                                <StatCard
                                    label="Collections"
                                    value={collections.length}
                                    icon={<FiLayers />}
                                />

                                <StatCard
                                    label="Categories"
                                    value={[...new Set(products.map((p) => p.category))].length}
                                    icon={<FiGrid />}
                                />
                            </div>

                            <section className="mt-14">
                                <div className="mb-7 flex items-end justify-between">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                                            Recently added
                                        </p>
                                        <h2 className="mt-2 text-xl font-medium">
                                            Your products
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => navigate("products")}
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 hover:text-black"
                                    >
                                        View all <FiArrowUpRight />
                                    </button>
                                </div>

                                {loadingProducts ? (
                                    <Loading />
                                ) : products.length === 0 ? (
                                    <EmptyState
                                        icon={<FiPackage />}
                                        title="Your catalogue is empty."
                                        action="Add a product"
                                        onClick={() => {
                                            resetProductForm();
                                            setProductModalOpen(true);
                                        }}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                        {products.slice(0, 4).map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onDelete={handleProductDelete}
                                                deletingId={deletingProductId}
                                                compact
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="mt-16">
                                <div className="mb-7 flex items-end justify-between">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                                            Your releases
                                        </p>
                                        <h2 className="mt-2 text-xl font-medium">
                                            Collections
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => navigate("collections")}
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 hover:text-black"
                                    >
                                        View all <FiArrowUpRight />
                                    </button>
                                </div>

                                {loadingCollections ? (
                                    <Loading />
                                ) : collections.length === 0 ? (
                                    <EmptyState
                                        icon={<FiLayers />}
                                        title="No collections yet."
                                        action="Create a collection"
                                        onClick={() => {
                                            resetCollectionForm();
                                            setCollectionModalOpen(true);
                                        }}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                                        {collections.slice(0, 4).map((collection) => (
                                            <CollectionCard
                                                key={collection.id}
                                                collection={collection}
                                                onDelete={handleCollectionDelete}
                                                deletingId={deletingCollectionId}
                                                onClick={() => fetchCollectionDetails(collection.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {/* PRODUCTS PAGE */}
                    {activePage === "products" && (
                        <>
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                        Store inventory
                                    </p>

                                    <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                                        Product catalogue.
                                    </h1>
                                </div>

                                <button
                                    onClick={() => {
                                        resetProductForm();
                                        setProductModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-3 bg-black px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
                                >
                                    <FiPlus /> Add product
                                </button>
                            </div>

                            <div className="mt-10 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-neutral-500">
                                    {products.length} products in your catalogue
                                </p>

                                <SearchInput
                                    value={productSearch}
                                    onChange={setProductSearch}
                                    placeholder="Search products..."
                                />
                            </div>

                            {loadingProducts ? (
                                <Loading />
                            ) : filteredProducts.length === 0 ? (
                                <EmptyState
                                    icon={<FiPackage />}
                                    title={
                                        products.length === 0
                                            ? "No products have been added yet."
                                            : "No products match your search."
                                    }
                                    action={products.length === 0 ? "Add a product" : null}
                                    onClick={() => {
                                        resetProductForm();
                                        setProductModalOpen(true);
                                    }}
                                />
                            ) : (
                                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onDelete={handleProductDelete}
                                            deletingId={deletingProductId}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* COLLECTIONS PAGE */}
                    {activePage === "collections" && (
                        <>
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                        Store releases
                                    </p>

                                    <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                                        Collections.
                                    </h1>

                                    <p className="mt-3 text-sm text-neutral-400">
                                        {collections.length} collections
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        resetCollectionForm();
                                        setCollectionModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-3 bg-black px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
                                >
                                    <FiPlus /> Add collection
                                </button>
                            </div>

                            <div className="mt-10 flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-neutral-500">
                                    Manage your collections
                                </p>

                                <SearchInput
                                    value={collectionSearch}
                                    onChange={setCollectionSearch}
                                    placeholder="Search collections..."
                                />
                            </div>

                            {loadingCollections ? (
                                <Loading />
                            ) : filteredCollections.length === 0 ? (
                                <EmptyState
                                    icon={<FiLayers />}
                                    title={
                                        collections.length === 0
                                            ? "No collections have been created."
                                            : "No collections match your search."
                                    }
                                    action={
                                        collections.length === 0
                                            ? "Create a collection"
                                            : null
                                    }
                                    onClick={() => {
                                        resetCollectionForm();
                                        setCollectionModalOpen(true);
                                    }}
                                />
                            ) : (
                                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                                    {filteredCollections.map((collection) => (
                                        <CollectionCard
                                            key={collection.id}
                                            collection={collection}
                                            onDelete={handleCollectionDelete}
                                            deletingId={deletingCollectionId}
                                            onClick={() => fetchCollectionDetails(collection.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* COLLECTION DETAILS PAGE */}
                    {activePage === "collection-details" && (
                        <>
                            <button
                                onClick={() => {
                                    setActivePage("collections");
                                    setSelectedCollection(null);
                                    setOutfits([]);
                                }}
                                className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-black"
                            >
                                <FiArrowUpRight className="rotate-[225deg]" />
                                Back to collections
                            </button>

                            {loadingOutfits && !selectedCollection ? (
                                <Loading />
                            ) : selectedCollection ? (
                                <>
                                    <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                                                Collection management
                                            </p>

                                            <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
                                                {selectedCollection.name}.
                                            </h1>

                                            <p className="mt-3 text-sm text-neutral-400">
                                                {outfits.length} outfits in this collection
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                resetOutfitForm();
                                                setOutfitModalOpen(true);
                                            }}
                                            className="flex items-center justify-center gap-3 bg-black px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800"
                                        >
                                            <FiPlus />
                                            Add outfit
                                        </button>
                                    </div>

                                    <div className="mt-10 border-t border-neutral-200 pt-8">
                                        {loadingOutfits ? (
                                            <Loading />
                                        ) : outfits.length === 0 ? (
                                            <EmptyState
                                                icon={<FiImage />}
                                                title="This collection has no outfits yet."
                                                action="Add your first outfit"
                                                onClick={() => {
                                                    resetOutfitForm();
                                                    setOutfitModalOpen(true);
                                                }}
                                            />
                                        ) : (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                                {outfits.map((outfit) => (
                                                    <motion.article
                                                        layout
                                                        key={outfit.id}
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="group min-w-0"
                                                    >
                                                        <div className="relative aspect-[3/4] overflow-hidden bg-[#efefec]">
                                                            <img
                                                                src={outfit.image_url}
                                                                alt={outfit.name || `${selectedCollection.name} outfit`}
                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                                            />

                                                            <button
                                                                onClick={() => handleOutfitDelete(outfit.id)}
                                                                disabled={deletingOutfitId === outfit.id}
                                                                aria-label="Delete outfit"
                                                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/95 text-neutral-500 transition-colors hover:bg-black hover:text-white"
                                                            >
                                                                {deletingOutfitId === outfit.id ? (
                                                                    <FiLoader className="animate-spin" />
                                                                ) : (
                                                                    <FiTrash2 />
                                                                )}
                                                            </button>
                                                        </div>

                                                        <div className="flex items-start justify-between gap-2 pt-4">
                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-xs font-medium md:text-sm">
                                                                    {outfit.name || "Untitled outfit"}
                                                                </h3>

                                                                <p className="mt-2 text-xs text-neutral-500">
                                                                    {formatPrice(outfit.price)}
                                                                </p>
                                                            </div>

                                                            <FiArrowUpRight className="mt-1 shrink-0 text-neutral-300" />
                                                        </div>
                                                    </motion.article>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </>
                    )}
                </div>
            </div>

            {/* PRODUCT UPLOAD MODAL */}
            <AnimatePresence>
                {productModalOpen && (
                    <Modal
                        title="Add a new product"
                        subtitle="Catalogue management"
                        onClose={closeProductModal}
                        busy={uploadingProduct}
                    >
                        <form onSubmit={handleProductUpload}>
                            <div className="grid grid-cols-1 gap-9 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-9">
                                <ImageUploader
                                    id="product-image"
                                    preview={productPreview}
                                    file={productImage}
                                    onChange={handleProductImageChange}
                                    label="Product photography"
                                    emptyText="Upload product image"
                                />

                                <div className="space-y-5">
                                    <Field label="Product name">
                                        <input
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            placeholder="e.g. Essential Oversized Tee"
                                            required
                                            className="form-input"
                                        />
                                    </Field>

                                    <Field label="Description">
                                        <textarea
                                            value={productDescription}
                                            onChange={(e) => setProductDescription(e.target.value)}
                                            placeholder="Tell customers about this product..."
                                            rows={3}
                                            className="form-input resize-none"
                                        />
                                    </Field>

                                    <Field label="Price (₦)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={productPrice}
                                            onChange={(e) => setProductPrice(e.target.value)}
                                            placeholder="28000"
                                            required
                                            className="form-input"
                                        />
                                    </Field>

                                    <Field label="Category">
                                        <select
                                            value={productCategory}
                                            onChange={(e) => setProductCategory(e.target.value)}
                                            required
                                            className="form-input bg-white"
                                        >
                                            <option value="">Select category</option>
                                            <option value="T-Shirts">T-Shirts</option>
                                            <option value="Hoodies">Hoodies</option>
                                            <option value="Trousers">Trousers</option>
                                            <option value="Sweatpants">Sweatpants</option>
                                            <option value="Jerseys">Jerseys</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </Field>
                                </div>
                            </div>

                            <ModalFooter
                                error={productError}
                                success={productSuccess}
                                busy={uploadingProduct}
                                onCancel={closeProductModal}
                                submitText="Upload product"
                                busyText="Uploading product"
                            />
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* COLLECTION UPLOAD MODAL */}
            <AnimatePresence>
                {collectionModalOpen && (
                    <Modal
                        title="Create a collection"
                        subtitle="Collection management"
                        onClose={closeCollectionModal}
                        busy={uploadingCollection}
                        maxWidth="max-w-[760px]"
                    >
                        <form onSubmit={handleCollectionUpload}>
                            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[1fr_1fr] md:p-9">
                                <ImageUploader
                                    id="collection-image"
                                    preview={collectionPreview}
                                    file={collectionImage}
                                    onChange={handleCollectionImageChange}
                                    label="Collection image"
                                    emptyText="Upload collection image"
                                />

                                <div className="flex flex-col justify-center">
                                    <Field label="Collection name">
                                        <input
                                            value={collectionName}
                                            onChange={(e) => setCollectionName(e.target.value)}
                                            placeholder="e.g. The Everyday Edit"
                                            required
                                            className="form-input"
                                        />
                                    </Field>
                                </div>
                            </div>

                            <ModalFooter
                                error={collectionError}
                                success={collectionSuccess}
                                busy={uploadingCollection}
                                onCancel={closeCollectionModal}
                                submitText="Create collection"
                                busyText="Uploading collection"
                            />
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* OUTFIT UPLOAD MODAL */}
            <AnimatePresence>
                {outfitModalOpen && (
                    <Modal
                        title="Add an outfit"
                        subtitle={selectedCollection?.name || "Collection management"}
                        onClose={closeOutfitModal}
                        busy={uploadingOutfit}
                        maxWidth="max-w-[760px]"
                    >
                        <form onSubmit={handleOutfitUpload}>
                            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[1fr_1fr] md:p-9">
                                <ImageUploader
                                    id="outfit-image"
                                    preview={outfitPreview}
                                    file={outfitImage}
                                    onChange={handleOutfitImageChange}
                                    label="Outfit photography"
                                    emptyText="Upload outfit image"
                                />

                                <div className="flex flex-col justify-center gap-5">
                                    <Field label="Outfit name">
                                        <input
                                            type="text"
                                            value={outfitName}
                                            onChange={(e) => setOutfitName(e.target.value)}
                                            placeholder="e.g. Everyday Essentials"
                                            required
                                            className="form-input"
                                        />
                                    </Field>

                                    <Field label="Price (₦)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={outfitPrice}
                                            onChange={(e) => setOutfitPrice(e.target.value)}
                                            placeholder="35000"
                                            required
                                            className="form-input"
                                        />
                                    </Field>
                                </div>
                            </div>

                            <ModalFooter
                                error={outfitError}
                                success={outfitSuccess}
                                busy={uploadingOutfit}
                                onCancel={closeOutfitModal}
                                submitText="Add outfit"
                                busyText="Uploading outfit"
                            />
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </main>
    );
}

// ==========================================
// SHARED COMPONENTS
// ==========================================

function SidebarButton({ active, onClick, icon, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-4 px-4 py-3.5 text-left text-xs transition-colors ${
                active
                    ? "bg-black text-white"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
            }`}
        >
            <span className="text-base">{icon}</span>
            {children}
        </button>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="border border-neutral-100 bg-white p-7">
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    {label}
                </p>
                <span className="text-lg text-neutral-300">{icon}</span>
            </div>

            <p className="mt-7 text-4xl font-medium tracking-tight">
                {String(value).padStart(2, "0")}
            </p>
        </div>
    );
}

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="flex items-center gap-3 border-b border-neutral-200 px-2 py-2 sm:w-[280px]">
            <FiSearch className="text-neutral-400" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-xs outline-none placeholder:text-neutral-400"
            />
        </div>
    );
}

function Loading() {
    return (
        <div className="flex justify-center py-24">
            <FiLoader className="animate-spin text-xl" />
        </div>
    );
}

function EmptyState({ icon, title, action, onClick }) {
    return (
        <div className="border border-neutral-100 bg-white px-5 py-20 text-center">
            <div className="mx-auto text-3xl text-neutral-300">{icon}</div>

            <p className="mt-5 text-sm font-medium">{title}</p>

            {action && (
                <button
                    onClick={onClick}
                    className="mt-6 bg-black px-6 py-3 text-[10px] uppercase tracking-wider text-white"
                >
                    {action}
                </button>
            )}
        </div>
    );
}

function ProductCard({ product, onDelete, deletingId, compact = false }) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="group min-w-0"
        >
            <div className={`relative overflow-hidden bg-[#efefec] ${compact ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <button
                    onClick={() => onDelete(product.id)}
                    disabled={deletingId === product.id}
                    aria-label={`Delete ${product.name}`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/95 text-neutral-500 opacity-100 transition-colors hover:bg-black hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                    {deletingId === product.id ? (
                        <FiLoader className="animate-spin" />
                    ) : (
                        <FiTrash2 />
                    )}
                </button>

                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-2 text-[9px] uppercase tracking-wider backdrop-blur-sm">
                    {product.category}
                </div>
            </div>

            <div className="flex items-start justify-between gap-2 pt-4">
                <div className="min-w-0">
                    <h3 className="truncate text-xs font-medium md:text-sm">
                        {product.name}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-500">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <FiArrowUpRight className="mt-1 shrink-0 text-neutral-300" />
            </div>
        </motion.article>
    );
}

function CollectionCard({ collection, onDelete, deletingId, onClick }) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="group min-w-0 cursor-pointer"
            onClick={onClick}
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efefec]">
                <img
                    src={collection.cover_image_url}
                    alt={collection.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(collection.id);
                    }}
                    disabled={deletingId === collection.id}
                    aria-label={`Delete ${collection.name}`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/95 text-neutral-500 opacity-100 transition-colors hover:bg-black hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                    {deletingId === collection.id ? (
                        <FiLoader className="animate-spin" />
                    ) : (
                        <FiTrash2 />
                    )}
                </button>
            </div>

            <div className="flex items-start justify-between gap-2 pt-4">
                <div className="min-w-0">
                    <h3 className="truncate text-xs font-medium md:text-sm">
                        {collection.name}
                    </h3>

                    <p className="mt-2 text-[10px] text-neutral-400">
                        {collection.outfit_count || 0} outfits
                    </p>
                </div>

                <FiArrowUpRight className="mt-1 shrink-0 text-neutral-300" />
            </div>
        </motion.article>
    );
}

function Modal({
    title,
    subtitle,
    onClose,
    busy,
    maxWidth = "max-w-[900px]",
    children
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !busy) onClose();
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-[3px] sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.35, ease: smoothEase }}
                className={`relative max-h-[94vh] w-full ${maxWidth} overflow-y-auto bg-white shadow-2xl`}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-5 md:px-9">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                            {subtitle}
                        </p>
                        <h2 className="mt-2 text-xl font-medium">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={busy}
                        className="flex h-10 w-10 items-center justify-center bg-neutral-50 text-neutral-500 transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>

                {children}
            </motion.div>
        </motion.div>
    );
}

function ImageUploader({
    id,
    preview,
    file,
    onChange,
    label,
    emptyText
}) {
    return (
        <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                {label}
            </p>

            <label
                htmlFor={id}
                className="group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#f5f5f2] transition-colors hover:bg-[#efefeb]"
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Image preview"
                            className="absolute inset-0 h-full w-full object-contain p-5"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/65 py-4 text-center text-[10px] uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Change image
                        </div>
                    </>
                ) : (
                    <div className="px-5 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
                            <FiImage className="text-xl text-neutral-400" />
                        </div>

                        <p className="mt-5 text-sm font-medium">{emptyText}</p>

                        <p className="mt-2 text-xs leading-6 text-neutral-400">
                            Click to browse your files
                            <br />
                            JPEG, PNG, WebP or AVIF
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-wider text-neutral-500">
                            <FiUploadCloud />
                            Maximum 8MB
                        </div>
                    </div>
                )}
            </label>

            <input
                id={id}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={onChange}
                className="hidden"
            />

            {file && (
                <p className="mt-3 truncate text-[10px] text-neutral-400">
                    {file.name}
                </p>
            )}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="mb-2 block text-[10px] uppercase tracking-wider text-neutral-500">
                {label}
            </label>
            {children}
        </div>
    );
}

function ModalFooter({
    error,
    success,
    busy,
    onCancel,
    submitText,
    busyText
}) {
    return (
        <div className="border-t border-neutral-100 px-6 py-5 md:px-9">
            {error && (
                <p className="mb-4 text-xs text-red-600">{error}</p>
            )}

            {success && (
                <p className="mb-4 flex items-center gap-2 text-xs text-green-700">
                    <FiCheck /> {success}
                </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={busy}
                    className="px-7 py-4 text-[10px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-black disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={busy}
                    className="flex items-center justify-center gap-3 bg-black px-8 py-4 text-[10px] uppercase tracking-[0.17em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                >
                    {busy ? (
                        <>
                            <FiLoader className="animate-spin" />
                            {busyText}
                        </>
                    ) : (
                        <>
                            <FiUploadCloud />
                            {submitText}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
