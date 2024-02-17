import { Card, CardContent } from '#ui/card';
import { HiOutlineExclamation } from 'react-icons/hi';

type NoDataProps = {
  title: string;
  subTitle?: string;
  action?: React.ReactNode;
};
function NoData({ title, subTitle, action }: NoDataProps) {
  return (
    <Card className="">
      <CardContent className="flex flex-col justify-center items-center text-center">
        <HiOutlineExclamation size={40} className="mt-4" />
        <h1 className="mt-2 text-xl font-semibold">{title}</h1>
        <p className="text-gray-500 text-sm">{subTitle}</p>

        <div className="mt-4">{action}</div>
      </CardContent>
    </Card>
  );
}

export default NoData;
