import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  index?: number;
}

const ServiceCard = ({ id, name, description, duration, price, index = 0 }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-elegant transition-all duration-300 border-2 hover:border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-foreground">{name}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold text-lg">
              <DollarSign className="w-5 h-5" />
              <span>{price}</span>
            </div>
          </div>
          <Button variant="hero" className="w-full" asChild>
            <Link to={`/agendar?service=${id}`}>Agendar este serviço</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
