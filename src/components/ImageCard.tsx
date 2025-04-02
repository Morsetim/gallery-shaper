
import React from 'react';
import { Link } from 'react-router-dom';
import { PicsumImage } from '@/services/picsum';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface ImageCardProps {
  image: PicsumImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <Link to={`/edit/${image.id}`} className="block relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={`https://picsum.photos/id/${image.id}/400/300`} 
            alt={`Photo by ${image.author}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ExternalLink className="text-white w-8 h-8" />
          </div>
        </div>
        <CardContent className="p-3">
          <p className="text-sm font-medium truncate">{image.author}</p>
          <p className="text-xs text-muted-foreground">
            {image.width} x {image.height}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ImageCard;
