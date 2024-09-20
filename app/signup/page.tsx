import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-3xl font-bold mb-4">Sign Up for FreshPlate</h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Full Name" />
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Input type="password" placeholder="Confirm Password" />
        <Button className="w-full">Sign Up</Button>
      </form>
      <p className="mt-4">
        Already have an account? <Link href="/login" className="text-green-600 hover:underline">Log In</Link>
      </p>
      <Link href="/" className="block mt-8 text-green-600 hover:underline">Back to Home</Link>
    </div>
  );
}