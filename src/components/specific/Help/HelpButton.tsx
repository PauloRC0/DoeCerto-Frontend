"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  ChevronRight,
  ArrowLeft,
  Banknote,
  Package,
  UserCircle,
  History,
  Star,
  Building2,
  ClipboardList,
  KeyRound,
  LucideProps,
} from "lucide-react";
import { helpArticles, featuredArticleIds, type HelpArticle } from "./helpArticles";

// Mapa de nome → componente Lucide
const iconMap: Record<string, React.FC<LucideProps>> = {
  Banknote,
  Package,
  UserCircle,
  History,
  Star,
  Building2,
  ClipboardList,
  KeyRound,
};

function ArticleIcon({
  iconName,
  iconBg,
  iconColor,
  size = 20,
  containerSize = 44,
  radius = 14,
}: {
  iconName: string;
  iconBg: string;
  iconColor: string;
  size?: number;
  containerSize?: number;
  radius?: number;
}) {
  const Icon = iconMap[iconName];
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: radius,
        background: iconBg,
      }}
    >
      {Icon ? <Icon size={size} color={iconColor} strokeWidth={1.8} /> : null}
    </div>
  );
}

export default function HelpButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const featured = featuredArticleIds
    .map((id) => helpArticles.find((a) => a.id === id))
    .filter(Boolean) as HelpArticle[];

  const searchResults =
    query.trim().length > 0
      ? helpArticles.filter((a) => {
          const hay = (a.title + " " + a.desc + " " + a.tags.join(" ")).toLowerCase();
          return query
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .some((t) => hay.includes(t));
        })
      : [];

  const listToShow = query.trim().length > 0 ? searchResults : helpArticles;
  const listLabel =
    query.trim().length > 0
      ? `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""}`
      : "Todas as dúvidas";

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery("");
      setActiveArticle(null);
    }
  }, [isOpen]);

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-5 z-[200] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl bg-[#6B39A7]"
        aria-label="Ajuda"
      >
        ?
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[301] rounded-t-3xl overflow-hidden flex flex-col bg-[#0f0f0f] max-h-[92vh]"
            >
              <AnimatePresence mode="wait">
                {!activeArticle ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col flex-1 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-5 pt-5 pb-4">
                      <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
                      <div className="flex items-start justify-between mb-5">
                        <h2 className="text-2xl font-bold text-white leading-tight">
                          Como podemos te{" "}
                          <span style={{ color: "#a78bfa" }}>ajudar</span> hoje?
                        </h2>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-2 rounded-full mt-0.5 flex-shrink-0"
                          style={{ background: "#2a2a2a" }}
                        >
                          <X size={16} color="#aaa" />
                        </button>
                      </div>

                      {/* Search */}
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                        style={{ background: "#1e1333", border: "1px solid #3d2a6e" }}
                      >
                        <Search size={18} color="#a78bfa" />
                        <input
                          ref={inputRef}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Qual é sua dúvida?"
                          className="flex-1 bg-transparent outline-none text-base font-medium placeholder:font-normal"
                          style={{ color: "#a78bfa", fontFamily: "inherit" }}
                        />
                        {query.length > 0 && (
                          <button onClick={() => setQuery("")}>
                            <X size={16} color="#a78bfa" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto px-5 pb-10">

                      {/* Featured horizontal cards — só sem busca */}
                      {query.trim().length === 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold mb-3" style={{ color: "#555" }}>
                            Dúvidas que podem te ajudar
                          </p>
                          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                            {featured.map((art) => (
                              <button
                                key={art.id}
                                onClick={() => setActiveArticle(art)}
                                className="flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-colors active:scale-95"
                                style={{
                                  background: "#1a1a1a",
                                  border: "1px solid #2a2a2a",
                                  width: 190,
                                }}
                              >
                                <ArticleIcon
                                  iconName={art.iconName}
                                  iconBg={art.iconBg}
                                  iconColor={art.iconColor}
                                  size={18}
                                  containerSize={36}
                                  radius={10}
                                />
                                <span
                                  className="text-sm font-semibold leading-snug"
                                  style={{ color: "#e0e0e0" }}
                                >
                                  {art.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main list */}
                      <p className="text-xs font-semibold mb-2" style={{ color: "#555" }}>
                        {listLabel}
                      </p>

                      {listToShow.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-base font-medium" style={{ color: "#555" }}>
                            Nenhum resultado encontrado
                          </p>
                          <p className="text-sm mt-1" style={{ color: "#444" }}>
                            Tente outras palavras
                          </p>
                        </div>
                      ) : (
                        listToShow.map((art, idx) => (
                          <div key={art.id}>
                            <button
                              onClick={() => setActiveArticle(art)}
                              className="w-full flex items-center gap-4 py-3.5 text-left transition-colors active:opacity-70"
                            >
                              <ArticleIcon
                                iconName={art.iconName}
                                iconBg={art.iconBg}
                                iconColor={art.iconColor}
                                size={20}
                                containerSize={44}
                                radius={14}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate" style={{ color: "#e8e8e8" }}>
                                  {art.title}
                                </p>
                                <p className="text-xs mt-0.5 truncate" style={{ color: "#666" }}>
                                  {art.desc}
                                </p>
                              </div>
                              <ChevronRight size={18} color="#444" className="flex-shrink-0" />
                            </button>
                            {idx < listToShow.length - 1 && (
                              <div
                                className="ml-[60px]"
                                style={{ height: "0.5px", background: "#1e1e1e" }}
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* ── ARTICLE VIEW ── */
                  <motion.div
                    key="article"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col flex-1 overflow-hidden"
                  >
                    {/* Article header */}
                    <div
                      className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
                      style={{ borderBottom: "1px solid #1a1a1a" }}
                    >
                      <div className="w-10 h-1 rounded-full bg-white/20 absolute top-3 left-1/2 -translate-x-1/2" />
                      <button
                        onClick={() => setActiveArticle(null)}
                        className="p-2 rounded-full flex-shrink-0"
                        style={{ background: "#2a2a2a" }}
                      >
                        <ArrowLeft size={16} color="#aaa" />
                      </button>
                      <p className="text-sm font-semibold truncate flex-1" style={{ color: "#ccc" }}>
                        {activeArticle.title}
                      </p>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full flex-shrink-0"
                        style={{ background: "#2a2a2a" }}
                      >
                        <X size={16} color="#aaa" />
                      </button>
                    </div>

                    {/* Article body — scrollable */}
                    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
                      {/* Hero icon */}
                      <ArticleIcon
                        iconName={activeArticle.iconName}
                        iconBg={activeArticle.iconBg}
                        iconColor={activeArticle.iconColor}
                        size={26}
                        containerSize={56}
                        radius={16}
                      />

                      <h2
                        className="text-xl font-bold leading-tight mt-4 mb-3"
                        style={{ color: "#f0f0f0" }}
                      >
                        {activeArticle.title}
                      </h2>

                      {activeArticle.infoBox && (
                        <div
                          className="rounded-xl px-4 py-3 mb-5 text-sm leading-relaxed"
                          style={{
                            background: "#1e1333",
                            borderLeft: "3px solid #6B39A7",
                            color: "#c4a8e8",
                          }}
                        >
                          {activeArticle.infoBox}
                        </div>
                      )}

                      <div className="flex flex-col gap-4 mb-4">
                        {activeArticle.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{
                                background: "#1e1333",
                                color: "#a78bfa",
                                border: "1px solid #3d2a6e",
                              }}
                            >
                              {i + 1}
                            </div>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: "#aaa" }}
                              dangerouslySetInnerHTML={{
                                __html: step.replace(
                                  /"([^"]+)"/g,
                                  '<strong style="color:#e0e0e0">"$1"</strong>'
                                ),
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA — fixo no fundo */}
                    <div
                      className="px-5 pb-10 pt-3 flex-shrink-0"
                      style={{ borderTop: "1px solid #1a1a1a" }}
                    >
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(activeArticle.ctaRoute);
                        }}
                        className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98] bg-[#6B39A7] hover:bg-[#5a2d90]"
                      >
                        {activeArticle.cta} →
                      </button>

                      {activeArticle.ctaSecondary && activeArticle.ctaSecondaryRoute && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push(activeArticle.ctaSecondaryRoute!);
                          }}
                          className="w-full py-3.5 rounded-2xl text-sm font-semibold mt-3 transition-all active:scale-[0.98]"
                          style={{
                            background: "transparent",
                            border: "1px solid #3d2a6e",
                            color: "#a78bfa",
                          }}
                        >
                          {activeArticle.ctaSecondary}
                        </button>
                      )}

                      <button
                        onClick={() => setActiveArticle(null)}
                        className="w-full py-3 mt-1 text-sm font-medium"
                        style={{ color: "#555" }}
                      >
                        Voltar para ajuda
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}