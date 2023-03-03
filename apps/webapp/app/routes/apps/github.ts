import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { z } from "zod";
import { StartAppInstallation } from "~/services/github/startAppInstallation.server";
import { requireUserId } from "~/services/session.server";

const SearchParamsSchema = z.object({
  redirectTo: z.string().default("/"),
});

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const { redirectTo } = SearchParamsSchema.parse(
    Object.fromEntries(url.searchParams.entries())
  );

  const service = new StartAppInstallation();

  const location = await service.call({
    userId,
    redirectTo,
  });

  return redirect(location ?? `/`);
}