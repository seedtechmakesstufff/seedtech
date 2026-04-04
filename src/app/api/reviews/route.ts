import { NextResponse } from "next/server";

// Google Places API (New) - fetches real reviews for SeedTech
// Uses Place Details when GOOGLE_PLACE_ID is set,
// otherwise auto-discovers the place via Text Search.
// Docs: https://developers.google.com/maps/documentation/places/web-service

export const revalidate = 3600; // cache for 1 hour

interface GoogleReview {
      name: string;
      relativePublishTimeDescription: string;
      rating: number;
      text?: { text: string; languageCode: string };
      originalText?: { text: string; languageCode: string };
      authorAttribution: { displayName: string; uri: string; photoUri: string };
      publishTime: string;
}

interface PlaceDetailsResponse {
      reviews?: GoogleReview[];
      rating?: number;
      userRatingCount?: number;
}

interface TextSearchPlace {
      id: string;
      reviews?: GoogleReview[];
      rating?: number;
      userRatingCount?: number;
}

interface TextSearchResponse {
      places?: TextSearchPlace[];
}

function transformReviews(reviews: GoogleReview[]) {
      return reviews.map((review, index) => ({
              id: `google-review-${index + 1}`,
              author: review.authorAttribution.displayName,
              text: review.text?.text || review.originalText?.text || "",
              rating: review.rating,
              source: "google",
              relativeTime: review.relativePublishTimeDescription,
              profilePhoto: review.authorAttribution.photoUri,
              profileUrl: review.authorAttribution.uri,
      }));
}

export async function GET() {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
          return NextResponse.json(
              { error: "Google Places API key not configured" },
              { status: 500 }
                  );
  }

  const fieldMask = "reviews,rating,userRatingCount";
      const placeId = process.env.GOOGLE_PLACE_ID;

  // ── Path 1: Place ID is known → use Place Details directly ──
  if (placeId) {
          try {
                    const url = `https://places.googleapis.com/v1/places/${placeId}`;
                    const res = await fetch(url, {
                                headers: {
                                              "Content-Type": "application/json",
                                              "X-Goog-Api-Key": apiKey,
                                              "X-Goog-FieldMask": fieldMask,
                                },
                                next: { revalidate: 3600 },
                    });

            if (!res.ok) {
                        const err = await res.json();
                        console.error("Place Details error:", err);
            } else {
                        const data: PlaceDetailsResponse = await res.json();
                        return NextResponse.json({
                                      reviews: transformReviews(data.reviews || []),
                                      totalRating: data.rating,
                                      totalReviews: data.userRatingCount,
                        });
            }
          } catch (err) {
                    console.error("Place Details fetch error:", err);
          }
  }

  // ── Path 2: Discover place via Text Search ──
  const query =
          process.env.GOOGLE_PLACE_QUERY ||
          "SeedTech LLC web development managed IT Northern NJ";

  try {
          const searchRes = await fetch(
                    "https://places.googleapis.com/v1/places:searchText",
              {
                          method: "POST",
                          headers: {
                                        "Content-Type": "application/json",
                                        "X-Goog-Api-Key": apiKey,
                                        "X-Goog-FieldMask": `places.id,places.${fieldMask.replace(/,/g, ",places.")}`,
                          },
                          body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
                          next: { revalidate: 3600 },
              }
                  );

        if (!searchRes.ok) {
                  const err = await searchRes.json();
                  console.error("Text Search error:", err);
                  return NextResponse.json(
                      { error: "Failed to find place via Text Search" },
                      { status: 500 }
                            );
        }

        const searchData: TextSearchResponse = await searchRes.json();
          const place = searchData.places?.[0];

        if (!place) {
                  return NextResponse.json(
                      { error: "Place not found via Text Search" },
                      { status: 404 }
                            );
        }

        return NextResponse.json({
                  reviews: transformReviews(place.reviews || []),
                  totalRating: place.rating,
                  totalReviews: place.userRatingCount,
        });
  } catch (err) {
          console.error("Text Search fetch error:", err);
          return NextResponse.json(
              { error: "Internal server error" },
              { status: 500 }
                  );
  }
}
