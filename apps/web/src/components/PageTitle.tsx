import { BackButton } from './BackButton';

type PageTitleProps = {
  title: string;
  showBackButton?: boolean;
  extra?: React.ReactNode;
};
function PageTitle({ title, showBackButton, extra }: PageTitleProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b-1 h-20">
      {showBackButton && <BackButton />}
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex-grow" />
      {extra}
    </div>
  );
}

export { PageTitle };
