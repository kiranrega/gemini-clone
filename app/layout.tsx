import { ReactNode } from "react";
// import AppLayout from "@/components/AppLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" 
    suppressHydrationWarning={true}
     data-lt-installed="true">
      <body>
        {/* <AppLayout> */}
          {children}
        {/* </AppLayout> */}
      </body>
    </html>
  );
}

