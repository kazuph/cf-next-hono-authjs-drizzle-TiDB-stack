import type { AdapterUser } from "@auth/core/adapters";
import type { JWT } from "@auth/core/jwt";
import type { Session } from "@auth/core/types";

export type AuthUser = {
	session: Session;
	token?: JWT;
	user?: AdapterUser;
};

import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
	const { data, status } = useQuery<AuthUser>({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await fetch("/api/auth/session");
			return res.json();
		},
		staleTime: 5 * (60 * 1000),
		gcTime: 10 * (60 * 1000),
		refetchOnWindowFocus: true,
	});
	return { session: data, status };
};
