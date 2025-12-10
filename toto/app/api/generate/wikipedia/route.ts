import { NextRequest, NextResponse } from "next/server";
import {
  extractTitleFromUrl,
  isValidWikipediaUrl,
  fetchWikipediaArticle,
  truncateContent,
} from "@/utils/wikipedia";
import { generateFlashcards } from "@/lib/ai/generate";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!isValidWikipediaUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a valid Wikipedia URL" },
        { status: 400 }
      );
    }

    // Extract title from URL
    const title = extractTitleFromUrl(url);
    if (!title) {
      return NextResponse.json(
        { error: "Could not extract article title from URL" },
        { status: 400 }
      );
    }

    // Fetch Wikipedia content
    const article = await fetchWikipediaArticle(title);
    if (!article) {
      return NextResponse.json(
        { error: "Could not fetch Wikipedia article. Please check the URL." },
        { status: 404 }
      );
    }

    // Truncate content to fit token limits (~8000 tokens)
    const truncatedContent = truncateContent(article.content, 8000);

    // Generate flashcards
    const cards = await generateFlashcards(truncatedContent);

    return NextResponse.json({
      title: article.title,
      source_url: article.url,
      cards,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards. Please try again." },
      { status: 500 }
    );
  }
}
