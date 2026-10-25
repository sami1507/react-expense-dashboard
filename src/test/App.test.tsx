import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";
import { generateTransactions } from "../data/generateTransactions";

describe("generateTransactions", () => {
  it("is deterministic and covers every requested month", () => {
    const first = generateTransactions(7, ["2026-01", "2026-02"]);
    const second = generateTransactions(7, ["2026-01", "2026-02"]);

    expect(second).toEqual(first);
    expect(new Set(first.map((t) => t.date.slice(0, 7)))).toEqual(new Set(["2026-01", "2026-02"]));
  });

  it("includes a salary and rent in every month", () => {
    const transactions = generateTransactions(7, ["2026-03"]);
    expect(transactions.map((t) => t.description)).toEqual(expect.arrayContaining(["Salary", "Rent"]));
  });
});

describe("App", () => {
  it("shows period totals and every transaction by default", () => {
    render(<App />);

    const total = generateTransactions().length;
    expect(screen.getByText(`Showing ${total} of ${total} transactions`)).toBeInTheDocument();
    expect(screen.getByTestId("stat-income")).toHaveTextContent("$");
  });

  it("filters the table by category", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Category"), "Housing");

    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Rent").length).toBeGreaterThan(0);
    expect(within(table).queryByText("Supermarket")).not.toBeInTheDocument();
  });

  it("narrows the table with the search box", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Search"), "zzz-no-match");

    expect(screen.getByText("No transactions match these filters.")).toBeInTheDocument();
  });

  it("toggles sort direction when a column header is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const amountHeader = screen.getByRole("columnheader", { name: /amount/i });
    await user.click(within(amountHeader).getByRole("button"));
    expect(amountHeader).toHaveAttribute("aria-sort", "descending");

    await user.click(within(amountHeader).getByRole("button"));
    expect(amountHeader).toHaveAttribute("aria-sort", "ascending");
  });
});
