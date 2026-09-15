import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Logo from "../components/brand/Logo.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo size={34} />
      <h1 className="mt-8 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button as={Link} to="/dashboard" className="mt-7">
        Back to dashboard
      </Button>
    </div>
  );
}
