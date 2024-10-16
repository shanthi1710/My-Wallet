// Appbar.tsx
import { IoIosNotifications } from "react-icons/io";
interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Appbar: React.FC<AppbarProps> = ({ user }) => {
  return (
    <div className="flex justify-between border-b px-8 py-3 border-slate-300 bg-white">
      <div className="text-xl flex flex-col font-semibold text-black justify-center">
        MyWallet
      </div>
      {/* <div className="pt-2 ">
        <IoIosNotifications className="size-7" />
      </div> */}
      <div className="flex flex-col justify-center pt-2">
        {user ? (
          <div className="flex items-center">
            <div className="font-semibold text-white bg-purple-700 h-6 w-28 text-center rounded-md">
              {user.name}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
