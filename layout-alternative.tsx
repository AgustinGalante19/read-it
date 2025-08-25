// Alternativa con barra fija - solo si es necesario
import Container from '@/components/ui/container';
import BottomBar from '@/components/bottombar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className='min-h-screen'
      style={{ '--bottom-bar-height': '6rem' } as React.CSSProperties}
    >
      <div className='pb-[var(--bottom-bar-height)]'>
        <Container>{children}</Container>
      </div>
      <BottomBar />
    </div>
  );
}
