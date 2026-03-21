import TavernChat from "@/components/TavernChat";
import PageHeader from "@/components/PageHeader";
import TavernBoardClient from "@/components/TavernBoardClient";
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/features/tavern/actions";
import { getTavernPageData } from "@/features/tavern/server/tavern";

export const metadata = {
  title: "The Tavern",
  description:
    "Share dispatches, news, and fleeting words with other crafters at the Local Hearth.",
};

export default async function Tavern() {
  const { posts, isAuthenticated, chatUser } = await getTavernPageData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <PageHeader
        eyebrow="Community Hall"
        title="The Noticeboard"
        description="Hear ye, hear ye. The noticeboard preserves lasting dispatches, while the Local Hearth handles quick and fleeting exchange."
      />

      <div className="flex min-h-[80vh] flex-col gap-8 md:flex-row">
        <div className="flex-[2]">
          <TavernBoardClient
            posts={posts}
            isAuthenticated={isAuthenticated}
            createPostAction={createPostAction}
            updatePostAction={updatePostAction}
            deletePostAction={deletePostAction}
          />
        </div>

        <TavernChat currentUser={chatUser} />
      </div>
    </div>
  );
}
