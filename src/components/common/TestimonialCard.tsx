import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  index?: number;
}

const TestimonialCard = ({ name, text, rating, index = 0 }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
    >
      <Card className="h-full bg-gradient-to-br from-rose-light/30 to-background border-2 border-primary/10 hover:shadow-soft transition-all">
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-foreground italic">"{text}"</p>
          <p className="text-primary font-semibold">- {name}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
