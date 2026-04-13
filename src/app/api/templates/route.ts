import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/claude";

const SYSTEM_PROMPT = `אתה עוזר כתיבה עבור יניב, מנהל פיתוח עסקי בפורום CFO — קהילה של סמנכ"לי כספים.
יניב צריך הודעות מקצועיות, אישיות ומשכנעות בעברית.
כתוב הודעה ישירה שמוכנה לשליחה. ללא פתיחה וסגירה מיותרת. רק טקסט ההודעה עצמה.`;

const templateTypes = {
  first_outreach: {
    label: "פנייה ראשונה",
    prompt: (vars: Record<string, string>) =>
      `כתוב הודעת פנייה ראשונה ל-CFO בשם ${vars.name || "[שם]"} מחברת ${vars.company || "[חברה]"}.
המטרה: להזמין אותו/ה להצטרף לפורום CFO.
הטון: מקצועי, ישיר, לא מכירתי. הדגש את הערך של הקהילה.`,
  },
  followup: {
    label: "פולואפ",
    prompt: (vars: Record<string, string>) =>
      `כתוב הודעת פולואפ ל-CFO בשם ${vars.name || "[שם]"} שלא ענה לפנייה הקודמת.
הטון: קצר, ידידותי, לא לחצני. זכיר את ההקשר ושאל אם יש זמן לדבר.`,
  },
  welcome: {
    label: "קבלת פנים לחבר חדש",
    prompt: (vars: Record<string, string>) =>
      `כתוב הודעת קבלת פנים ל-CFO חדש בשם ${vars.name || "[שם]"} שהצטרף לפורום CFO.
כלול: ברכה חמה, מה הוא/היא יכול להרוויח מהקהילה, מה הצעד הבא.`,
  },
  reengagement: {
    label: "חידוש קשר",
    prompt: (vars: Record<string, string>) =>
      `כתוב הודעה לחידוש קשר עם ${vars.name || "[שם]"} שהיה חבר בפורום CFO אבל לא פעיל מזה זמן.
הטון: חם, אישי. שאל מה קורה איתו/ה מקצועית ותזמין לחזור לפעילות.`,
  },
  after_meeting: {
    label: "אחרי פגישה",
    prompt: (vars: Record<string, string>) =>
      `כתוב הודעה לאחר פגישה עם ${vars.name || "[שם]"} מחברת ${vars.company || "[חברה]"}.
${vars.meetingNotes ? `הנקודות העיקריות מהפגישה: ${vars.meetingNotes}` : ""}
כלול: תודה, סיכום קצר, צעד הבא.`,
  },
};

export type TemplateType = keyof typeof templateTypes;

export async function POST(req: NextRequest) {
  const { type, variables } = await req.json();

  const template = templateTypes[type as TemplateType];
  if (!template) return NextResponse.json({ error: "סוג תבנית לא ידוע" }, { status: 400 });

  const message = await generateText(SYSTEM_PROMPT, template.prompt(variables || {}));
  return NextResponse.json({ message });
}

export async function GET() {
  const types = Object.entries(templateTypes).map(([value, t]) => ({ value, label: t.label }));
  return NextResponse.json({ types });
}
