"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, GitFork, Users } from "lucide-react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate URL
      if (!url.includes("wikipedia.org")) {
        throw new Error("Please enter a valid Wikipedia URL");
      }

      // Navigate to generate page with URL
      const encoded = encodeURIComponent(url);
      router.push(`/generate?url=${encoded}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-ink-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-toto-600">toto</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/explore" className="btn-ghost">
              Explore
            </a>
            <a href="/login" className="btn-ghost">
              Log in
            </a>
            <a href="/signup" className="btn-primary">
              Sign up
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-ink-950 sm:text-6xl">
            GitHub for flashcards
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-ink-600">
            Turn any Wikipedia page into study-ready flashcards in seconds.
            Fork, improve, and share with the community.
          </p>

          {/* URL Input */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-2xl"
          >
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a Wikipedia URL..."
                className="input flex-1 py-3 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn-primary px-6 py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    Generate <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </form>

          <p className="mt-4 text-sm text-ink-500">
            Try it free — no sign up required to generate your first deck
          </p>
        </section>

        {/* Features */}
        <section className="grid gap-8 py-16 md:grid-cols-3">
          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-toto-100">
              <Sparkles className="h-6 w-6 text-toto-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900">
              AI-Powered Generation
            </h3>
            <p className="mt-2 text-ink-600">
              Paste any Wikipedia URL and get perfectly crafted flashcards
              in seconds. No manual work required.
            </p>
          </div>

          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-toto-100">
              <GitFork className="h-6 w-6 text-toto-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900">
              Fork & Improve
            </h3>
            <p className="mt-2 text-ink-600">
              Found a great deck? Fork it, customize it, make it yours.
              Your changes, your learning style.
            </p>
          </div>

          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-toto-100">
              <Users className="h-6 w-6 text-toto-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900">
              Community Library
            </h3>
            <p className="mt-2 text-ink-600">
              Browse thousands of decks created by learners worldwide.
              Star, fork, and contribute back.
            </p>
          </div>
        </section>

        {/* Popular Decks Preview */}
        <section className="py-16">
          <h2 className="text-2xl font-bold text-ink-900">
            Popular decks
          </h2>
          <p className="mt-2 text-ink-600">
            Jump into learning with community favorites
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder deck cards */}
            {[
              { title: "World War II", cards: 45, stars: 234 },
              { title: "Python Programming", cards: 62, stars: 189 },
              { title: "Human Anatomy", cards: 78, stars: 156 },
              { title: "Machine Learning", cards: 54, stars: 142 },
              { title: "Japanese History", cards: 38, stars: 98 },
              { title: "Organic Chemistry", cards: 67, stars: 87 },
            ].map((deck) => (
              <div
                key={deck.title}
                className="card cursor-pointer transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-ink-900">{deck.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-ink-500">
                  <span>{deck.cards} cards</span>
                  <span>★ {deck.stars}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="/explore" className="btn-secondary">
              Explore all decks
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-ink-500">
          <p>Built with ♥ for learners everywhere</p>
        </div>
      </footer>
    </div>
  );
}
