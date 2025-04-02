
// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchImages } from '@/services/picsum';
import ImageCard from '@/components/ImageCard';
import Pagination from '@/components/Pagination';
import { useGallery } from '@/context/GalleryContext';
import { Loader2 } from 'lucide-react';

const GalleryPage = () => {
  const { currentPage, setCurrentPage } = useGallery();
  const ITEMS_PER_PAGE = 12;

  const { data: images, isLoading, isError } = useQuery({
    queryKey: ['images', currentPage, ITEMS_PER_PAGE],
    queryFn: () => fetchImages(currentPage, ITEMS_PER_PAGE),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-destructive">Failed to load images</h2>
        <p className="mt-2 text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Image Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images?.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {images && images.length > 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          hasMore={images.length === ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default GalleryPage;
