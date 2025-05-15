import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface PurchaseButtonProps {
  bookId: string;
  title: string;
  price: number;
  isAvailable: boolean;
}

export function PurchaseButton({ bookId, title, price, isAvailable }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handlePurchase = async () => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase books.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/books/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          paymentDetails: {
            amount: price,
            currency: 'USD',
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Purchase Successful',
          description: 'Thank you for your purchase! Check your email for confirmation.',
        });
        setIsOpen(false);
      } else {
        throw new Error(data.error || 'Failed to purchase book');
      }
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: error instanceof Error ? error.message : 'An error occurred during purchase',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          disabled={!isAvailable}
          className="w-full"
        >
          {isAvailable ? `Purchase for $${price}` : 'Not Available'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Book</DialogTitle>
          <DialogDescription>
            You are about to purchase "{title}" for ${price}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm text-muted-foreground">
            <p>Please confirm your purchase. Once confirmed:</p>
            <ul className="list-disc list-inside mt-2">
              <li>You will receive an email confirmation</li>
              <li>The book will be marked as sold</li>
              <li>You can collect the book from the library</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 