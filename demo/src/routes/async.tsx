import { createFileRoute } from "@tanstack/react-router";
import { createStore, useStore } from "statekit";

export const Route = createFileRoute("/async")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    state: { posts, loading },
    actions: { refresh },
  } = useStore(store);

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <div className="flex flex-col gap-4 mt-4 max-w-[500px]">
        {loading ? (
          <div>Fetching posts...</div>
        ) : (
          posts.map((post, index) => (
            <div key={post.id} className="border p-4 rounded w-full">
              <h3
                className="font-bold mb-2"
                data-testid={`post-${index}-title`}
              >
                {post.title}
              </h3>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface State {
  posts: Post[];
  loading: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPosts = async () => {
  await sleep(500);
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return await response.json();
};

const store = createStore(
  { posts: [], loading: true } as State,
  (set) => ({
    refresh: async () => {
      set({ posts: [], loading: true });
      const posts = await fetchPosts();
      set({ posts, loading: false });
    },
  }),
  {
    onAttach: async (_, set) => {
      const posts = await fetchPosts();
      set({ posts, loading: false });
    },
  },
);
