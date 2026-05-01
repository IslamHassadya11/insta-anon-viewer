export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: "No username" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    const data = await res.json();
    const user = data?.data?.user;

    if (!user) throw new Error("Profile not found");

    const posts = user.edge_owner_to_timeline_media?.edges?.map(e => 
      e.node.thumbnail_src || e.node.display_url
    ) || [];

    return Response.json({
      username: user.username,
      full_name: user.full_name,
      biography: user.biography,
      profile_pic_url: user.profile_pic_url,
      profile_pic_url_hd: user.profile_pic_url_hd,
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0,
      recent_posts: posts
    });

  } catch (error) {
    return Response.json({ error: "Could not fetch profile. Instagram may be blocking." }, { status: 500 });
  }
}
