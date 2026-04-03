import { NextResponse } from "next/server";

// Google Places API (New) - Place Details endpoint
// Fetches reviews for a specific place using the place ID
// Docs: https://developers.google.com/maps/documentation/places/web-service/place-details

export const revalidate = 3600; // Revalidate every hour

interface GoogleReview {
    name: string;
    relativePublishTimeDescription: string;
    rating: number;
    text?: {
          text: string;
          languageCode: string;
        };
    originalText?: {
          text: string;
          languageCode: string;
        };
    authorAttribution: {
          displayName: string;
          uri: string;
          photoUri: string;
        };
    publishTime: string;
  }

interface PlaceDetailsResponse {
    reviews?: GoogleReview[];
    rating?: number;
    userRatingCount?: number;
  }

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
          return NextResponse.json(
                  { error: "Google Places API key or Place ID not configured" },
                  { status: 500 }
                );
        }

    try {
          const url = `https://places.googleapis.com/v1/places/${placeId}`;

          const response = await fetch(url, {
                  method: "GET",
                  headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": apiKey,
                            "X-Goog-FieldMask":
                              "reviews,rating,userRatingCount",
                          },
                  next: { revalidate: 3600 },
                });

          if (!response.ok) {
                  const errorData = await response.json();
                  console.error("Google Places API error:", errorData);
                  return NextResponse.json(
                            { error: "Failed to fetch reviews from Google Places API" },
                            { status: response.status }
                          );
                }

          const data: PlaceDetailsResponse = await response.json();

          // Transform Google reviews to match our Review interface
          const reviews = (data.reviews || []).map((review, index) => ({
                  id: `google-review-${index + 1}`,
                  author: review.authorAttribution.displayName,
                  text:
                    review.text?.text ||
                    review.originalText?.text ||
                    "",
                  rating: review.rating,
                  source: "google",
                  relativeTime: review.relativePublishTimeDescription,
                  profilePhoto: review.authorAttribution.photoUri,
                  profileUrl: review.authorAttribution.uri,
                }));

          return NextResponse.json({
                  reviews,
                  totalRating: data.rating,
                  totalReviews: data.userRatingCount,
                });
        } catch (error) {
          console.error("Error fetching Google reviews:", error);
          return NextResponse.json(
                  { error: "Internal server error" },
                  { status: 500 }
                );
        }
  }
