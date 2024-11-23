// app/layouts/components/MainContent.tsx

const MainContent = ({ children }: { children: React.ReactNode }) => {
    return (
      <main className="flex-1 p-6 ml-2 mt-28">
        {children}
      </main>
    );
  };
  
  export default MainContent;
  