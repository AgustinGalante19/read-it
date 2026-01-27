import Container from '@/components/ui/container';
import BottomBar from '@/components/bottombar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div
        className='min-h-screen'
        style={{
          paddingBottom: 'var(--bottom-bar-height, 6rem)',
        }}
      >
        <Container>{children}</Container>
      </div>
      <BottomBar />
    </div>
  );
}
