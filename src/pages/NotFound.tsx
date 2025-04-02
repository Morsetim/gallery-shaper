
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page not found</p>
      <Button asChild>
        <Link to="/">Return to Gallery</Link>
      </Button>
    </div>
  );
};

export default NotFound;
