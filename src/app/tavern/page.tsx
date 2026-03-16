import TavernChat from '@/components/TavernChat';
import PageHeader from '@/components/PageHeader';
import TavernBoardClient from '@/components/TavernBoardClient';
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from '@/features/tavern/actions';
import { getTavernPageData } from '@/features/tavern/server/tavern';

export default async function Tavern() {
  const { posts, isAuthenticated, chatUser } = await getTavernPageData();

  return (
    <div className="page-shell">
      <div className="page-stack">
      <PageHeader
        eyebrow="Community Hall"
        title="The Noticeboard"
        description="Hear ye, hear ye. The noticeboard preserves lasting dispatches, while the Local Hearth handles quick and fleeting exchange."
      />

        <div className="grid min-h-[80vh] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_23rem]">
          <div className="min-w-0">
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
    </div>
  );
}
