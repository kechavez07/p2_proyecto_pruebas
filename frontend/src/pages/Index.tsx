import Header from "@/components/Header";
import PinGrid from "@/components/PinGrid";
import UploadModal from "@/components/UploadModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center mb-6">
            <UploadModal />
          </div>
        </div>
        <PinGrid />
      </main>
    </div>
  );
};

export default Index;
