import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BreadcrumbLink } from "./BreadcrumbLink";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("BreadcrumbLink", () => {
  test("hiển thị đúng tiêu đề và đường dẫn", () => {
    renderWithRouter(<BreadcrumbLink href="/home" title="Trang chủ" />);
    const link = screen.getByRole("link", { name: /trang chủ/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
  });

  test("thêm class 'text-muted-foreground' khi là phần tử cuối", () => {
    renderWithRouter(<BreadcrumbLink href="/home" title="Trang chủ" isLast />);
    const link = screen.getByText("Trang chủ");
    expect(link).toHaveClass("text-muted-foreground");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("pointer-events-none");
  });

  test("thêm class 'text-primary' và 'hover:underline' nếu không phải phần tử cuối", () => {
    renderWithRouter(<BreadcrumbLink href="/home" title="Trang chủ" />);
    const link = screen.getByText("Trang chủ");
    expect(link).toHaveClass("text-primary");
    expect(link).toHaveClass("hover:underline");
    expect(link).not.toHaveAttribute("aria-current");
  });
});
