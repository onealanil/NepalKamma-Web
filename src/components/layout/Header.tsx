import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/NepalKamma.png"
            alt="NepalKamma Logo"
            width={250}
            height={100}
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          <Link href="#features" className="text-black hover:text-gray-500 transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-black hover:text-gray-500 transition-colors">
            Testimonials
          </Link>
          <Link href="/auth/signin" className="text-black hover:text-gray-500 transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup" className="bg-primary text-white hover:bg-primary-foreground transition-colors px-4 py-2 rounded-md">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
