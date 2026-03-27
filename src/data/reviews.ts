export interface Review {
  id: string;
  author: string;
  role?: string;
  company?: string;
  text: string;
  rating: number; // 1-5
  source?: string; // "google" | "yelp" | etc.
}

export const reviews: Review[] = [
  {
    id: "review-1",
    author: "Verified Client",
    text: "Sam was the essence of professional during our process of our website development. He was patient, thoughtful, and was able to create a user friendly website that professionally represents our business. We highly recommend Sam and his team.",
    rating: 5,
    source: "google",
  },
  {
    id: "review-2",
    author: "Verified Client",
    text: "Sam and Matt do a wonderful job and are an awesome duo for businesses all over!! Sam recently redid my business website and it is awesome! It was lacking a modern flare to it before and now it looks super polished and professional! Sam is extremely knowledgeable, lays out any software pricing ahead of time, and will go through any changes until you are satisfied, so you have the best website for your business! Thank you so much guys! :)",
    rating: 5,
    source: "google",
  },
  {
    id: "review-3",
    author: "Verified Client",
    text: "SEEDTECH IS GREAT. Sam's work is awesome. And he even made us an awesome video on the toy for our promotion as well as handles our website day in and day out.",
    rating: 5,
    source: "google",
  },
  {
    id: "review-4",
    author: "Verified Client",
    text: "I recently had the pleasure of working with Sam and Matt to build my website, and I couldn't be happier with the results. From start to finish, they were incredibly easy to communicate with, always responsive and attentive to my needs. They brought fantastic ideas to the table, helping to shape my vision into a stunning and functional website. I highly recommend SeedTech to anyone looking for a professional and creative web development service. Thank you for making this such a smooth and enjoyable experience!",
    rating: 5,
    source: "google",
  },
  {
    id: "review-5",
    author: "Verified Client",
    text: "Chelsea, Matt, and Sam have been a complete dream team in all that they have done to help my business grow with social media and our website. They are attentive, punctual, flexible, and so kind. I have enjoyed growing with them and look forward to our continued friendship. Can't recommend them enough, this group of professionals will take your business to the next level!",
    rating: 5,
    source: "google",
  },
  {
    id: "review-6",
    author: "Verified Client",
    text: "SeedTech's entire staff is so great and easy to deal with. I usually contact them with the most random issues and they always resolve them quickly and easily. I am not the most computer savvy and they walk me through everything quickly and easily.",
    rating: 5,
    source: "google",
  },
  {
    id: "review-7",
    author: "Verified Client",
    text: "I am so grateful for SeedTech and everything they have been able to do for my brand. When my co-host and I got let go from our 10-year radio career we decided to launch our own business and show and had NO idea where to start when it came to a website. SeedTech swooped in and built a site that was catered to our needs and our viewers needs. They represented our brand PERFECTLY. The site they created is easily navigable yet has EVERYTHING you could possibly find related to our show. Check out CarlaMarieandAnthony.com for yourself!",
    rating: 5,
    source: "google",
  },
  {
    id: "review-8",
    author: "Verified Client",
    text: "SeedTech has a professional group of people that work for you and for your business. They work to please each customer ending with great value to you.",
    rating: 5,
    source: "google",
  },
];
