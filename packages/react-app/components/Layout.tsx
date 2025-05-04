import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
        {/* <div className="max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8"> */}
        <div>{children}</div>
      </div>
    </>
  );
};

export default Layout;

// import { ThirdwebProvider } from "thirdweb/react";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <ThirdwebProvider>{children}</ThirdwebProvider>
//     </html>
//   );
// }
