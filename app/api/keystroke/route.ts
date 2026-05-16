import connectDB from "@/lib/mongodb";
import TypingSession from "@/models/typingSession";

type IncomingEvent = {
  at?: number;
  key?: unknown;
  expectedChar?: string | null;
  matched?: boolean | null;
  position?: unknown;
};

type CompleteBody = {
  sessionId: string;
  completed: true;
  events: IncomingEvent[];
};

function normalizeEvents(raw: IncomingEvent[]) {
  return raw.map((e) => ({
    at: new Date(
      typeof e.at === "number" && Number.isFinite(e.at) ? e.at : Date.now(),
    ),
    key: String(e.key ?? ""),
    expectedChar:
      e.expectedChar === undefined || e.expectedChar === null
        ? null
        : String(e.expectedChar),
    matched:
      e.matched === undefined || e.matched === null
        ? null
        : Boolean(e.matched),
    position: Number(e.position),
  }));
}

export async function POST(req: Request) {
  let body: CompleteBody;
  try {
    body = (await req.json()) as CompleteBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.sessionId || typeof body.sessionId !== "string") {
    return Response.json({ error: "sessionId is required" }, { status: 400 });
  }

  if (body.completed !== true || !Array.isArray(body.events)) {
    return Response.json(
      { error: "completed session with events array is required" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const userAgent = req.headers.get("user-agent");
    const events = normalizeEvents(body.events);

    try {
      await TypingSession.create({
        sessionId: body.sessionId,
        events,
        endedAt: new Date(),
        clientUserAgent: userAgent ?? null,
      });
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        return Response.json({ ok: true, duplicate: true });
      }
      throw err;
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("keystroke POST error:", err);
    return Response.json(
      { error: "Failed to save typing session" },
      { status: 500 },
    );
  }
}
