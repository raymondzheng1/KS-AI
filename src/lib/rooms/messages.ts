/** Friendly, kid-appropriate messages for room API error codes. */
export function roomErrorMessage(j: { error?: string; reason?: string } | null): string {
  switch (j?.error) {
    case "bad_nick":
      return j?.reason === "blocked"
        ? "Please pick a friendlier nickname. 🙂"
        : "Nicknames are 2–16 letters or numbers.";
    case "rate_limited":
      return "Whoa, slow down a sec — try again shortly.";
    case "no_room":
      return "We couldn't find that room. Check the invite link.";
    case "bad_room":
      return "That room code doesn't look right.";
    case "kv_unavailable":
      return "The server is napping. Please try again in a moment.";
    default:
      return "Something went wrong. Please try again.";
  }
}
