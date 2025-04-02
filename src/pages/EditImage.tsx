
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchImages, getImageUrl, saveEditedImage, getEditedImage } from '@/services/picsum';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const EditImagePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load saved settings if available
  const savedSettings = id ? getEditedImage(id) : null;
  
  const [width, setWidth] = useState(savedSettings?.width || 600);
  const [height, setHeight] = useState(savedSettings?.height || 400);
  const [grayscale, setGrayscale] = useState(savedSettings?.grayscale || false);
  const [blur, setBlur] = useState(savedSettings?.blur || 0);
  
  // Fetch original image details
  const { data: imageDetails, isLoading, isError } = useQuery({
    queryKey: ['images-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const allImages = await fetchImages(1, 100);
      return allImages.find(img => img.id === id) || null;
    },
    enabled: !!id,
  });
  
  // Save changes to local storage
  useEffect(() => {
    if (id) {
      saveEditedImage({
        id,
        width,
        height,
        grayscale,
        blur
      });
    }
  }, [id, width, height, grayscale, blur]);
  
  const imageUrl = id ? getImageUrl(id, width, height, grayscale, blur) : '';
  
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited-image-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // toast({
      //   title: "Image downloaded successfully",
      //   description: "Check your downloads folder",
      // });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the image",
        variant: "destructive",
      });
    }
  };
  
  if (!id) {
    return <div>Invalid image ID</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>
        <h1 className="text-2xl font-bold">Edit Image</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <div className="flex flex-col items-center">
          <div className="rounded-lg overflow-hidden border border-border mb-4 w-full max-w-lg">
            {isLoading ? (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <p>Loading image...</p>
              </div>
            ) : (
              <img 
                src={imageUrl} 
                alt="Edited preview" 
                className="w-full h-auto object-cover"
                style={{ maxHeight: '75vh' }}
              />
            )}
          </div>
          {imageDetails && (
            <p className="text-sm text-muted-foreground">
              Photo by <span className="font-medium">{imageDetails.author}</span>
            </p>
          )}
        </div>
        
        {/* Editor Controls */}
        <Card className="max-w-lg w-full">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image Dimensions</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="100"
                      max="2000"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="2000"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image Effects</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="grayscale" className="cursor-pointer">Grayscale Mode</Label>
                  <Switch
                    id="grayscale"
                    checked={grayscale}
                    onCheckedChange={setGrayscale}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="blur">Blur: {blur}</Label>
                    <span className="text-sm text-muted-foreground">(1-10)</span>
                  </div>
                  <Slider
                    id="blur"
                    min={0}
                    max={10}
                    step={1}
                    value={[blur]}
                    onValueChange={(value) => setBlur(value[0])}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button 
                  onClick={handleDownload} 
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setWidth(600);
                    setHeight(400);
                    setGrayscale(false);
                    setBlur(0);
                  }}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditImagePage;
