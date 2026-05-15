import { ModernHeader } from "./ModernHeader";
import { Footer } from "./Footer";
import { BottomNavigation } from "./BottomNavigation";
import { SplashScreen } from "./SplashScreen";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashScreen />
      <div className="flex min-h-screen flex-col">
        <ModernHeader />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNavigation />
      </div>
    </>
  );
}
