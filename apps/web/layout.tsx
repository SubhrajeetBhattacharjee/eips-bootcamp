import { ClerkProvider } from '@clerk/nextjs';


export const metadata = {
  title: 'EIPs Insight',
  description: 'Campus Ambassador Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}