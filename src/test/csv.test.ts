import { describe, expect, it } from "vitest";
import { toCsv } from "../lib/csv";
import type { Transaction } from "../types";

const base: Transaction = {
  id: "1",
  date: "2026-07-04",
  description: "Dinner",
  category: "Dining",
  amountCents: -2_550,
};

describe("toCsv", () => {
  it("writes a header and one CRLF-terminated row per transaction", () => {
    expect(toCsv([base])).toBe("Date,Description,Category,Amount\r\n2026-07-04,Dinner,Dining,-25.50\r\n");
  });

  it("quotes fields that contain commas and escapes quotes", () => {
    const csv = toCsv([{ ...base, description: 'Pizza, "large"' }]);
    expect(csv).toContain('2026-07-04,"Pizza, ""large""",Dining,-25.50');
  });

  it("neutralises text that spreadsheet apps would treat as a formula", () => {
    const csv = toCsv([{ ...base, description: "=HYPERLINK(\"http://x\")" }]);
    expect(csv).toContain("\"'=HYPERLINK(\"\"http://x\"\")\"");
  });

  it("does not alter negative amounts", () => {
    expect(toCsv([base])).toContain(",-25.50\r\n");
  });
});
