import { Link } from 'react-router-dom';

type HeaderProps = {
  right?: React.ReactNode;
};

export default function Header({ right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-baseline gap-2 font-semibold tracking-tight"
        >
          <span>EM Handbook</span>
          <span className="text-xs font-normal text-muted-foreground">
            อุ่นใจตอนเวร
          </span>
        </Link>
        {right ? <div className="flex items-center gap-1">{right}</div> : null}
      </div>
    </header>
  );
}
