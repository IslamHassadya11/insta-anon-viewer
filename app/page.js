'use client';

import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    if (!username) return;
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const res = await fetch(`/api/profile?username=${username}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-12 text-pink-500">InstaAnon</h1>

        <div className="flex gap-4 mb-12 max-w-md mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadProfile()}
            placeholder="Enter username (e.g. natgeo)"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-pink-500"
          />
          <button 
            onClick={loadProfile}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-10 rounded-2xl font-bold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-8">{error}</p>}

        {profile && (
          <div className="bg-zinc-900 rounded-3xl p-10">
            {/* Profile Info */}
            <div className="flex gap-10">
              <img 
                src={profile.profile_pic_url_hd || profile.profile_pic_url} 
                className="w-52 h-52 rounded-full border-4 border-pink-500 cursor-pointer"
                onClick={() => window.open(profile.profile_pic_url_hd || profile.profile_pic_url, '_blank')}
              />
              <div>
                <h2 className="text-4xl font-bold">{profile.full_name} <span className="text-gray-400">@{profile.username}</span></h2>
                <p className="mt-4 text-lg whitespace-pre-line">{profile.biography}</p>
                <div className="flex gap-8 mt-6 text-xl">
                  <div><b>{profile.followers.toLocaleString()}</b> followers</div>
                  <div><b>{profile.following.toLocaleString()}</b> following</div>
                  <div><b>{profile.posts.toLocaleString()}</b> posts</div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <h3 className="text-2xl mt-16 mb-6">Recent Posts</h3>
            <div className="grid grid-cols-3 gap-4">
              {profile.posts?.map((post, i) => (
                <img key={i} src={post} className="rounded-2xl cursor-pointer hover:scale-105 transition" 
                     onClick={() => window.open(post, '_blank')} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
