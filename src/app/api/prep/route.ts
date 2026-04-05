import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/claude";

const SYSTEM_PROMPT = `אתה עוזר מחקרי ואסטרטגי עבור יניב, מנהל פיתוח עסקי המתמחה בקשרים עם CFOs.
יניב מנהל פורום CFO — קהילה של סמנכ"לי כספים — ורוצה לגייס ולשמר חברים.
לפני כל פגישה עם CFO, יניב צריך להיות מוכן היטב.
כתוב בעברית. הפוסט מובנה עם כותרות ברורות.`;

export async function POST(req: NextRequest) {
  const { name, company, context } = await req.json();

  if (!name) return NextResponse.json({ error: "שם נדרש" }, { status: 400 });

  const userPrompt = `הכן לי בריפינג לפגישה עם:
שם: ${name}
חברה: ${company || "לא ידוע"}
${context ? `הקשר נוסף: ${context}` : ""}

כלול:
1. **רקע ופרופיל** — מה כנראה חשוב לCFO הזה בתפקידו
2. **אתגרים עסקיים סבירים** — על בסיס סוג החברה ותפקיד CFO
3. **שאלות גילוי** — 5 שאלות מצוינות לפתיחת שיחה
4. **נקודות שיחה לפורום CFO** — למה הצטרפות לפורום תועיל לו ספציפית
5. **התנגדויות אפשריות ותשובות** — 3 התנגדויות נפוצות`;

  const briefing = await generateText(SYSTEM_PROMPT, userPrompt);
  return NextResponse.json({ briefing });
}
