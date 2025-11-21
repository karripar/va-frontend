"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface Admin {
  _id: string;
  userName?: string;
  user_level_id: number;
  title?: string;
  email: string;
  avatarUrl?: string;
  showActions?: boolean;
}

interface AdminListProps {
  admins: Admin[];
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
  onDemote: (id: string) => void;
  onElevate: (id: string) => void;
  loading: boolean;
  t: {
    currentAdmins: string;
    noAdmins: string;
    actions: string;
    elevate: string;
    demote: string;
  };
}

const AdminList = ({
  admins,
  setAdmins,
  onDemote,
  onElevate,
  loading,
  t,
}: AdminListProps) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <h3 className="text-lg font-semibold mt-6">{t.currentAdmins}</h3>

      {admins.length > 0 ? (
        <ul className="mt-2 border rounded divide-y">
          {admins.map((admin) => (
            <li key={admin._id} className="p-3 flex items-center gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Image
                  src={admin.avatarUrl || "/images/default-avatar.png"}
                  alt={`${admin.userName || admin.email}'s profile`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover aspect-square shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">
                    {admin.userName || admin.email}
                  </span>
                  <span className="text-[var(--typography)] text-sm break-all">
                    {admin.email}
                  </span>
                </div>
              </div>

              {/* Admin actions */}
              {isAuthenticated &&
                user &&
                user._id !== admin._id &&
                admin.user_level_id !== 3 &&
                Number(user.user_level_id) === 3 && (
                  <div className="relative ml-auto shrink-0">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                      onClick={() =>
                        setAdmins((prev) =>
                          prev.map((a) =>
                            a._id === admin._id
                              ? { ...a, showActions: !a.showActions }
                              : a
                          )
                        )
                      }
                    >
                      {t.actions}
                    </button>

                    {admin.showActions && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border rounded shadow-md z-10 flex flex-col">
                        {admin.user_level_id === 2 && (
                          <button
                            onClick={() => onElevate(admin._id)}
                            disabled={loading}
                            className="px-3 py-1 text-sm hover:bg-blue-100 text-blue-700"
                          >
                            {t.elevate}
                          </button>
                        )}
                        <button
                          onClick={() => onDemote(admin._id)}
                          disabled={loading}
                          className="px-3 py-1 text-sm hover:bg-red-100 text-red-700"
                        >
                          {t.demote}
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[var(--typography)] mt-2">{t.noAdmins}</p>
      )}
    </div>
  );
};

export default AdminList;
