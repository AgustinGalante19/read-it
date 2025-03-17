import Container from '@/components/ui/container';
import BottomBar from '@/components/bottombar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='pb-24'>
      <Container>{children}</Container>
      <BottomBar />
    </div>
  );
}
