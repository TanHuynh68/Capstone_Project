import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <div>
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Link to="/cart">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Cart</span>
        </Link>
      </Button>
    </div>
  );
};

export default Cart;
