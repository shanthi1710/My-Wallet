import Image from "next/image";
interface AppbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    profileImg?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Appbar: React.FC<AppbarProps> = ({ user }) => {
  console.log(user?.name);
  console.log(user?.email);
  console.log(user?.profileImg);

  return (
    <div className="flex justify-between border-b px-8 py-3 border-slate-300 bg-white">
      <div className="text-xl flex flex-col font-semibold text-black justify-center">
        MyWallet
      </div>

      <div className="flex flex-col justify-center ">
        {user ? (
          <div className="flex items-center">
            <Image
              src={user.profileImg || ""}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
