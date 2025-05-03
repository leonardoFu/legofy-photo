import Link from 'next/link';
import Container from './ui/Container';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Lego Pic
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/photo-picker" className="hover:text-blue-600 transition-colors">
                  Photo Picker
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
} 