import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/claude";
import { readData, writeData } from "@/lib/storage";

export interface LinkedInPost {
  id: string;
  topic: string;
  tone: string;
  content: string;
  createdAt: string;
}

const SYSTEM_PROMPT = `אתה מומחה לכתיבת תוכן ל-LinkedIn עבור מובילי חשיבה בתחום הפיננסי.
אתה כותב עבור יניב, מנהל פיתוח עסקי המתמחה בקשרים עם CFOs ומנהלי פיננסים.
הסגנון: ישיר, אמין, עם תובנות מעשיות. הפוסטים ממוקדים ומעוררי מחשבה.
כתוב בעברית. אל תוסיף האשטאגים יותר מ-3. הפוסט צריך להיות בין 100-200 מילים.`;

export async function POST(req: NextRequest) {
  const { topic, tone } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "נושא נדרש" }, { status: 400 });
  }

  const toneDescriptions: Record<string, string> = {
    thought_leader: "סגנון מנהיגות חשיבה — תובנה מקצועית עם עמדה ברורה",
    storytelling: "סגנון סיפורי — התחל עם אנקדוטה קצרה או מצב מוכר",
    question: "סגנון שאלתי — פתח עם שאלה מעוררת מחשבה לקהל",
  };

  const toneDesc = toneDescriptions[tone] || toneDescriptions.thought_leader;

  const content = await generateText(
    SYSTEM_PROMPT,
    `כתוב פוסט ל-LinkedIn בנושא: "${topic}"\nסגנון: ${toneDesc}\nכתוב רק את טקסט הפוסט, ללא כותרות או הסברים נוספים.`
  );

  const post: LinkedInPost = {
    id: Date.now().toString(),
    topic,
    tone,
    content,
    createdAt: new Date().toISOString(),
  };

  const posts = readData<LinkedInPost[]>("linkedin_posts", []);
  posts.unshift(post);
  writeData("linkedin_posts", posts.slice(0, 50));

  return NextResponse.json({ post });
}

export async function GET() {
  const posts = readData<LinkedInPost[]>("linkedin_posts", []);
  return NextResponse.json({ posts });
}
