import Link from "next/link";

const tools = [
  {
    href: "/linkedin",
    title: "מחולל פוסטים ל-LinkedIn",
    description: "כתוב פוסטים ממוקדים לקהל ה-CFO שלך. בחר נושא וטון, וקבל פוסט מוכן לפרסום.",
    icon: "✍️",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
  },
  {
    href: "/members",
    title: "מעקב חברים (CRM)",
    description: "נהל את רשימת ה-CFO שלך — פרוספקטים, חברים פעילים, וחברים שצריך לחדש קשר.",
    icon: "👥",
    color: "bg-green-50 border-green-200 hover:border-green-400",
  },
  {
    href: "/prep",
    title: "הכנה לפגישה",
    description: "לפני פגישה עם CFO — קבל בריפינג, שאלות גילוי, ונקודות שיחה מותאמות אישית.",
    icon: "📋",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
  },
  {
    href: "/templates",
    title: "ספריית תבניות",
    description: "הודעות מוכנות לפנייה ראשונה, פולואפ, קבלת פנים לחברים חדשים, ועוד.",
    icon: "💬",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">שלום 👋</h1>
        <p className="text-gray-500 text-lg">
          מרכז הפיקוד שלך לגידול הפורום ולניהול קשרים עם CFOs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`block p-6 rounded-xl border-2 transition-all ${tool.color}`}
          >
            <div className="text-3xl mb-3">{tool.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {tool.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
