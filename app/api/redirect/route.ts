import { NextRequest, NextResponse } from "next/server";
import type { IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";

export const runtime = "nodejs";

const EMOTICON_URL_PATTERN = /^https?:\/\/(?:www\.)?emoticon\.kakao\.com\/items\/(.+)$/i;
const EMOTICON_ID_PATTERN = /^[a-zA-Z0-9_-]+=?$/;

type SuccessResponse = {
  url: string;
};

type ErrorResponse = {
  error: string;
};

function json(
  body: SuccessResponse | ErrorResponse,
  status = 200
): NextResponse<SuccessResponse | ErrorResponse> {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "max-age=86400"
    }
  });
}

function parseEmoticonId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  // Check if it's already just an ID
  if (EMOTICON_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  // Try to extract from URL
  try {
    const url = new URL(trimmed);

    if (!/emoticon\.kakao\.com$/i.test(url.hostname)) {
      return null;
    }

    const [, id] = url.pathname.match(/^\/items\/(.+)$/) ?? [];
    return id ?? null;
  } catch {
    const match = trimmed.match(EMOTICON_URL_PATTERN);
    return match?.[1] ?? null;
  }
}

function requestHeaders(): Record<string, string> {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "ko-KR,ko;q=0.9",
    DNT: "1"
  };
}

function requestText(url: string, headers: Record<string, string>): Promise<{ url: string | null }> {
  return new Promise((resolve, reject) => {
    const outgoingRequest = httpsRequest(url, { headers }, (incomingResponse) => {
      const location = incomingResponse.headers.location;
      const finalUrl = typeof location === "string" ? location : null;

      resolve({
        url: finalUrl
      });
    });

    outgoingRequest.setTimeout(15000, () => {
      outgoingRequest.destroy(new Error("Request timed out."));
    });
    outgoingRequest.on("error", reject);
    outgoingRequest.end();
  });
}

async function getRedirectUrl(emoticonId: string): Promise<string | null> {
  try {
    const result = await requestText(
      `https://emoticon.kakao.com/items/${emoticonId}`,
      requestHeaders()
    );

    return result.url;
  } catch (error) {
    console.error("Error fetching redirect URL:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const emoticonId =
    parseEmoticonId(searchParams.get("url")) ?? parseEmoticonId(searchParams.get("id"));

  if (!emoticonId) {
    return json(
      {
        error:
          "Pass a valid Kakao emoticon URL with ?url= or an emoticon ID with ?id=."
      },
      400
    );
  }

  const redirectUrl = await getRedirectUrl(emoticonId);

  if (!redirectUrl) {
    return json(
      {
        error: "Could not find redirect URL for the given emoticon ID."
      },
      404
    );
  }

  return json({
    url: redirectUrl
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      url?: string;
      id?: string;
    };

    const emoticonId = parseEmoticonId(body.url ?? null) ?? parseEmoticonId(body.id ?? null);

    if (!emoticonId) {
      return json(
        {
          error:
            "Pass a valid Kakao emoticon URL with 'url' or an emoticon ID with 'id'."
        },
        400
      );
    }

    const redirectUrl = await getRedirectUrl(emoticonId);

    if (!redirectUrl) {
      return json(
        {
          error: "Could not find redirect URL for the given emoticon ID."
        },
        404
      );
    }

    return json({
      url: redirectUrl
    });
  } catch {
    return json(
      {
        error: "Invalid request body."
      },
      400
    );
  }
}
