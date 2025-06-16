
import Terminal from '@/components/Terminal';
import MobileHomepage from '@/components/MobileHomepage';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 w-screen h-screen">
      {isMobile ? <MobileHomepage /> : <Terminal />}
    </div>
  );
};

export default Index;
