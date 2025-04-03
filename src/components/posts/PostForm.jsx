/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { postContent } = globalStore.getState();
  const { inputPostContent, addPost } = globalStore.actions;

  const handleChangePostContent = (e) => {
    inputPostContent(e.target.value);
  };

  const handleSubmit = () => {
    if (postContent.length === 0) {
      return;
    }

    addPost(postContent);
    inputPostContent("");
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        value={postContent}
        onInput={handleChangePostContent}
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        게시
      </button>
    </div>
  );
};
