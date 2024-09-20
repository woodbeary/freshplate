import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Log In to FreshPlate</h1>
      <form className="space-y-4">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button className="w-full">Log In</Button>
      </form>
      <p className="mt-4">
        Don't have an account? <Link href="/signup" className="text-green-600 hover:underline">Sign Up</Link>
      </p>
      <Link href="/" className="block mt-8 text-green-600 hover:underline">Back to Home</Link>
    </div>
  );
}