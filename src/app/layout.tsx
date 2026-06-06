import { ReactNode } from "react";
import ClientBootstrap from "@/components/layout/ClientBootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/index.css";

export const metadata = {
  title: "AI-editing module | Demonstration",
  description:
    "Demonstration repository for the intellectual AI-editing module",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientBootstrap />
        <main>{children}</main>
      </body>
    </html>
  );
}
