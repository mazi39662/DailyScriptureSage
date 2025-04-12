import { Verse } from "../interfaces/verse";

// List of popular Bible verses with explanations and applications for fallback
const explanationsAndApplications: Record<string, {explanation: string, application: string}> = {
  "John 3:16": {
    explanation: "This verse encapsulates the core message of Christianity: God's profound love for humanity led Him to sacrifice His Son, Jesus Christ, so that through faith in Him, we can receive salvation and eternal life.",
    application: "Reflect on God's incredible love for you personally. How might you respond to this love today? Consider sharing this message of hope with someone who needs encouragement."
  },
  "Jeremiah 29:11": {
    explanation: "This verse was spoken to the Israelites during their exile in Babylon. God was assuring them that despite their current hardship, He had good plans for their future. It reminds us that even in difficult circumstances, God is working for our ultimate good and has a purpose for our lives.",
    application: "When facing uncertainty or challenges, remember that God has plans for your welfare, not for disaster. Take comfort in knowing that God sees beyond your current situation and is orchestrating events to give you hope and a future."
  },
  "Philippians 4:13": {
    explanation: "Paul wrote these words while imprisoned, teaching that with Christ's strength, we can endure any circumstance – whether abundance or need. This verse isn't about superhuman abilities but about finding contentment and strength in every situation through our relationship with Jesus.",
    application: "Identify a current challenge in your life where you need divine strength. Pray specifically for Christ's power to work through your weakness, and take a small step forward in faith today, relying on His strength rather than your own."
  },
  "Romans 8:28": {
    explanation: "This verse doesn't promise that everything that happens is good, but rather that God can work through all circumstances – even painful ones – to accomplish good for those who love Him. It speaks to God's sovereignty and ultimate plan for our lives.",
    application: "Look back at a difficult situation in your past. Can you identify ways God brought good from it? In your current challenges, practice thanking God in advance for how He will work them for good, even when you can't yet see how."
  },
  "Psalm 23:1": {
    explanation: "This opening verse of the beloved psalm uses the metaphor of God as a shepherd caring for His sheep. It speaks to God's provision, protection, and guidance in our lives. When we follow the Good Shepherd, He provides everything we truly need.",
    application: "Take inventory of your needs versus your wants. Are you trusting God as your provider? Practice contentment today by focusing on gratitude for what you have rather than anxiety about what you lack."
  }
};

// Generic explanation and application for verses not in our list
const genericExplanation = "This verse provides divine wisdom for our spiritual journey. Scripture illuminates God's character and His intentions for our lives.";
const genericApplication = "Take time to reflect on how this verse speaks to your current life situation. What specific action might God be calling you to take based on this truth?";

// Function to fetch a random verse from Bible.org's API
export async function getRandomVerse(): Promise<Verse> {
  try {
    // Use the Bible.org API for random verses
    const response = await fetch('https://labs.bible.org/api/?passage=random&type=json');

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const verseData = data[0]; // API returns an array with a single verse object
    
    // Construct the verse reference (Book Chapter:Verse)
    const reference = `${verseData.bookname} ${verseData.chapter}:${verseData.verse}`;
    
    // Find if we have a specific explanation/application for this verse or book
    // First try exact match by reference
    const bookMatch = Object.keys(explanationsAndApplications).find(key => 
      reference.includes(key) || key.includes(reference)
    );
    
    let explanation = genericExplanation;
    let application = genericApplication;
    
    if (bookMatch) {
      explanation = explanationsAndApplications[bookMatch].explanation;
      application = explanationsAndApplications[bookMatch].application;
    }
    
    // Return the verse with text, reference, explanation and application
    return {
      text: verseData.text,
      reference: reference,
      explanation: explanation,
      application: application
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    
    // Create a fallback verse for error cases
    return {
      text: "The Lord is my shepherd; I shall not want.",
      reference: "Psalm 23:1",
      explanation: explanationsAndApplications["Psalm 23:1"].explanation,
      application: explanationsAndApplications["Psalm 23:1"].application
    };
  }
}
