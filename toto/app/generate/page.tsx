"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Edit2,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { GeneratedCard } from "@/types";

interface GenerationResult {
  title: string;
  source_url: string;
  cards: GeneratedCard[];
}

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const { isAuthenticated, openAuthModal } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [cards, setCards] = useState<GeneratedCard[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ front: "", back: "" });

  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    generateCards();
  }, [url]);

  const generateCards = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/generate/wikipedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cards");
      }

      setResult(data);
      setCards(data.cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({
      front: cards[index].front,
      back: cards[index].back,
    });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const updated = [...cards];
    updated[editingIndex] = {
      ...updated[editingIndex],
      front: editForm.front,
      back: editForm.back,
    };
    setCards(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleAddCard = () => {
    setCards([...cards, { front: "", back: "", reversible: false }]);
    setEditingIndex(cards.length);
    setEditForm({ front: "", back: "" });
  };

  const handlePublish = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info("Please log in to save your deck");
      openAuthModal("signup");
      return;
    }

    // Validate cards
    if (cards.length === 0) {
      toast.error("Please add at least one card");
      return;
    }

    // Check for empty cards
    const hasEmptyCards = cards.some(
      (card) => !card.front.trim() || !card.back.trim()
    );
    if (hasEmptyCards) {
      toast.error("Please fill in all cards or delete empty ones");
      return;
    }

    try {
      setIsSaving(true);

      // Create deck
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result?.title || "Untitled Deck",
          description: `Generated from Wikipedia`,
          source_url: result?.source_url,
          is_public: false,
          cards: cards,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save deck");
      }

      toast.success("Deck saved successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save deck");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-toto-600" />
          <p className="mt-4 text-lg text-ink-600">
            Generating flashcards...
          </p>
          <p className="mt-2 text-sm text-ink-500">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="btn-secondary mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <button
            onClick={() => router.push("/")}
            className="btn-ghost"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? "Saving..." : "Save Deck"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {result && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-ink-900">
                {result.title}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Generated from{" "}
                <a
                  href={result.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-toto-600 hover:underline"
                >
                  Wikipedia
                </a>
              </p>
              <p className="mt-2 text-ink-600">
                {cards.length} cards • Review and edit before publishing
              </p>
            </div>

            {/* Cards list */}
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={index} className="card">
                  {editingIndex === index ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-ink-700">
                          Front (Question)
                        </label>
                        <textarea
                          value={editForm.front}
                          onChange={(e) =>
                            setEditForm({ ...editForm, front: e.target.value })
                          }
                          className="input min-h-[80px]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-ink-700">
                          Back (Answer)
                        </label>
                        <textarea
                          value={editForm.back}
                          onChange={(e) =>
                            setEditForm({ ...editForm, back: e.target.value })
                          }
                          className="input min-h-[80px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="btn-primary"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="btn-secondary"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-ink-900">
                            {card.front}
                          </p>
                          <p className="mt-2 text-ink-600">{card.back}</p>
                        </div>
                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="btn-ghost p-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add card button */}
              <button
                onClick={handleAddCard}
                className="card flex w-full items-center justify-center gap-2 border-dashed text-ink-500 hover:border-toto-500 hover:text-toto-600"
              >
                <Plus className="h-5 w-5" />
                Add card
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
