import { Verse } from "../interfaces/verse";

// List of popular Bible verses with explanations and applications
const popularVerses: Verse[] = [
  {
    reference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    explanation: "This verse encapsulates the core message of Christianity: God's profound love for humanity led Him to sacrifice His Son, Jesus Christ, so that through faith in Him, we can receive salvation and eternal life.",
    application: "Reflect on God's incredible love for you personally. How might you respond to this love today? Consider sharing this message of hope with someone who needs encouragement."
  },
  {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
    explanation: "This verse was spoken to the Israelites during their exile in Babylon. God was assuring them that despite their current hardship, He had good plans for their future. It reminds us that even in difficult circumstances, God is working for our ultimate good and has a purpose for our lives.",
    application: "When facing uncertainty or challenges, remember that God has plans for your welfare, not for disaster. Take comfort in knowing that God sees beyond your current situation and is orchestrating events to give you hope and a future. Consider journaling about an area where you need to trust God's plans."
  },
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    explanation: "Paul wrote these words while imprisoned, teaching that with Christ's strength, we can endure any circumstance – whether abundance or need. This verse isn't about superhuman abilities but about finding contentment and strength in every situation through our relationship with Jesus.",
    application: "Identify a current challenge in your life where you need divine strength. Pray specifically for Christ's power to work through your weakness, and take a small step forward in faith today, relying on His strength rather than your own."
  },
  {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    explanation: "This verse doesn't promise that everything that happens is good, but rather that God can work through all circumstances – even painful ones – to accomplish good for those who love Him. It speaks to God's sovereignty and ultimate plan for our lives.",
    application: "Look back at a difficult situation in your past. Can you identify ways God brought good from it? In your current challenges, practice thanking God in advance for how He will work them for good, even when you can't yet see how."
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd; I shall not want.",
    explanation: "This opening verse of the beloved psalm uses the metaphor of God as a shepherd caring for His sheep. It speaks to God's provision, protection, and guidance in our lives. When we follow the Good Shepherd, He provides everything we truly need.",
    application: "Take inventory of your needs versus your wants. Are you trusting God as your provider? Practice contentment today by focusing on gratitude for what you have rather than anxiety about what you lack."
  }
];

// Function to fetch a random verse from a Bible API
export async function getRandomVerse(): Promise<Verse> {
  try {
    const apiKey = process.env.BIBLE_API_KEY || "3f9211b2a14fbe6e1bf4";
    
    // List of verses to randomly select from
    const verseReferences = [
      "John 3:16", "Psalm 23:1", "Proverbs 3:5-6", "Philippians 4:13", 
      "Jeremiah 29:11", "Romans 8:28", "Isaiah 40:31", "Matthew 6:33",
      "Romans 12:2", "Philippians 4:6-7"
    ];
    
    // Select a random verse reference
    const randomReference = verseReferences[Math.floor(Math.random() * verseReferences.length)];
    
    const response = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/verses/${randomReference}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`, {
      method: 'GET',
      headers: {
        'api-key': apiKey
      }
    });

    if (!response.ok) {
      // If API fails, fallback to local verses
      return popularVerses[Math.floor(Math.random() * popularVerses.length)];
    }

    const data = await response.json();
    
    // Since the API doesn't provide explanations and applications,
    // we'll match it with our local data if available or generate generic ones
    const matchedVerse = popularVerses.find(v => v.reference === randomReference);
    
    if (matchedVerse) {
      return {
        ...matchedVerse,
        text: data.data.content
      };
    }
    
    // If no match, create a new verse with generic explanation and application
    return {
      text: data.data.content,
      reference: randomReference,
      explanation: "This verse reminds us of God's wisdom and guidance throughout our lives. Scripture gives us insights into God's character and His plans for humanity.",
      application: "Consider meditating on this verse throughout your day. How might its truth apply to your current circumstances and decisions?"
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    // Fallback to local verses if API fails
    return popularVerses[Math.floor(Math.random() * popularVerses.length)];
  }
}
