import { useEffect, useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "@/store/slices/adminSlice";
import { addBlog, deleteBlog } from "@/services/blog";
import { Editor } from "primereact/editor";

export default function BlogsAdmin() {
  // const [blogs, setBlogs] = useState(initialBlogs);
  const { blogs } = useSelector((state) => state.admin);
  const [showAddForm, setShowAddForm] = useState(false);
  const [content, setContent] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("https://picsum.photos/200/300");
    }

    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add new blog to the list
    dispatch(
      addBlog({
        token: token,
        title: formData.title,
        content: content,
        subtitle: formData.subtitle,
        image: formData.image,
      })
    );
    // Reset form and close it
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      image: null,
    });
    setContent("");
    setImagePreview(null);
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteBlog({ token: token, blogId: id }));
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blogs Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-black cursor-pointer text-white py-2 px-4 rounded-md flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Blog
          </button>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/blogs/${blog._id}`);
                }}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{blog.subtitle}</p>
                  <div className="flex justify-end space-x-2">
                    {/* <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                    <Edit size={18} />
                  </button> */}
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(blog._id);
                      }}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No blogs found</div>
          )}
        </div>

        {/* Add Blog Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Add New Blog</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="subtitle"
                  >
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="content"
                  >
                    Content
                  </label>
                  {/* <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea> */}
                  <Editor
                    value={content}
                    name="content"
                    onTextChange={(e) => setContent(e.htmlValue)}
                    style={{ height: "320px" }}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Featured Image
                  </label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-black cursor-pointer text-white font-medium py-2 px-4 rounded-md"
                  >
                    Save Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
