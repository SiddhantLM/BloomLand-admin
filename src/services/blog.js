import axios from "axios";
import { blogEndpoints } from "./apis";
import { getBlogs } from "@/store/slices/adminSlice";

export const addBlog = ({ token, title, subtitle, content, image }) => {
  return async (dispatch) => {
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("subtitle", subtitle);
      data.append("content", content);
      if (image) {
        data.append("image", image);
      }

      await axios.post(blogEndpoints.create, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getBlogs());
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteBlog = ({ token, blogId }) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${blogEndpoints.delete}/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getBlogs());
    } catch (error) {
      console.log(error);
    }
  };
};

export const getBlogById = async ({ token, blogId }) => {
  try {
    const response = await axios.get(`${blogEndpoints.fetchOne}/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.blog;
  } catch (error) {
    console.log(error);
  }
};
