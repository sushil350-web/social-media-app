import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { logoutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels, loading } = PostData();

  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [file, setFile] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  let myPosts = posts?.filter((post) => post.owner._id === user._id);
  let myReels = reels?.filter((reel) => reel.owner._id === user._id);

  useEffect(() => {
    async function followData() {
      try {
        const { data } = await axios.get("/api/user/followdata/" + user._id);
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
      } catch (error) {
        console.log(error);
      }
    }
    followData();
  }, [user]);

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const changleImageHandler = () => {
    const formdata = new FormData();
    formdata.append("file", file);
    updateProfilePic(user._id, formdata, setFile);
  };

  const UpdateName = () => {
    updateProfileName(user._id, name, setShowInput);
  };

  async function updatePassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/" + user._id, {
        oldPassword,
        newPassword,
      });
      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const logoutHandler = () => logoutUser(navigate);

  return loading ? (
    <Loading />
  ) : (
    user && (
    
    <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-8 pb-20 px-4 max-w-5xl mx-auto w-full">

        {show && (
          <Modal value={followersData} title="Followers" setShow={setShow} />
        )}
        {show1 && (
          <Modal value={followingsData} title="Followings" setShow={setShow1} />
        )}

        {/* Profile Section */}
        <div className="bg-white flex flex-col items-center  p-6 rounded-xl shadow-lg ">
          {/* Left Side */}
          <div className="flex flex-col items-center gap-6">
            <img
              src={user.profilePic.url}
              alt="Profile"
              className="w-[160px] h-[160px] rounded-full object-cover shadow"
            />
            <div className="flex flex-col items-center gap-3 ">
              <input
                type="file"
                onChange={changeFileHandler}
                className="text-sm ml-24"
              />
              <button
                onClick={changleImageHandler}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition "
              >
                Update Profile
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="">
            {showInput ? (
              <div className="">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                  className="border rounded-md px-2 py-1 text-sm w-[150px]"
                />
                <button
                  onClick={UpdateName}
                  className="bg-green-500 text-white px-2 py-1 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-red-400 text-white p-2 rounded-full"
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-800 font-semibold text-lg flex items-center gap-2">
                {user.name}
                <button onClick={() => setShowInput(true)}>
                  <CiEdit />
                </button>
              </p>
            )}
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.gender}</p>
            <p
              className="text-blue-500 text-sm cursor-pointer"
              onClick={() => setShow(true)}
            >
              {user.followers.length} Followers
            </p>
            <p
              className="text-blue-500 text-sm cursor-pointer"
              onClick={() => setShow1(true)}
            >
              {user.followings.length} Following
            </p>
            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-fit mt-2 mb-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Update Password */}
        <button
          onClick={() => setShowUpdatePass(!showUpdatePass)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {showUpdatePass ? "Cancel Password Update" : "Update Password"}
        </button>

        {showUpdatePass && (
          <form
            onSubmit={updatePassword}
            className="flex flex-col bg-white p-6 rounded-md shadow-md gap-4 w-full max-w-sm"
          >
            <input
              type="password"
              className="border px-3 py-2 rounded-md"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="border px-3 py-2 rounded-md"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Update Password
            </button>
          </form>
        )}

        {/* Post / Reels Toggle */}
        <div className="flex gap-6 bg-white p-4 rounded-md shadow-md">
          <button
            onClick={() => setType("post")}
            className={`${
              type === "post" ? "font-bold text-blue-600" : "text-gray-600"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setType("reel")}
            className={`${
              type === "reel" ? "font-bold text-blue-600" : "text-gray-600"
            }`}
          >
            Reels
          </button>
        </div>

        {/* Post / Reel Display */}
        {type === "post" ? (
          myPosts && myPosts.length > 0 ? (
            myPosts.map((e) => (
              <PostCard type="post" value={e} key={e._id} />
            ))
          ) : (
            <p>No Posts Yet</p>
          )
        ) : myReels && myReels.length > 0 ? (
          <div className="flex gap-3 justify-center items-center flex-wrap">
            <PostCard
              type="reel"
              value={myReels[index]}
              key={myReels[index]._id}
            />
            <div className="flex flex-col gap-4">
              {index > 0 && (
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded-full"
                  onClick={() => setIndex(index - 1)}
                >
                  <FaArrowUp />
                </button>
              )}
              {index < myReels.length - 1 && (
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded-full"
                  onClick={() => setIndex(index + 1)}
                >
                  <FaArrowDownLong />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>No Reels Yet</p>
        )}
      </div>
    )
  );
};

export default Account;
