
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GalleryContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('gallery-current-page');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    // Save to localStorage whenever currentPage changes
    localStorage.setItem('gallery-current-page', currentPage.toString());
  }, [currentPage]);

  return (
    <GalleryContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
