import { useState, useEffect } from "react";
import { client, exploreProfiles } from "../api";
import Link from 'next/link'

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      let response = await client.query({
        query: exploreProfiles,
      });

      let profileData = await Promise.all(
        response.data.exploreProfiles.items.map(async (profileInfo) => {
          let profile = { ...profileInfo };
          let picture = profile.picture;

          if (picture && picture.orignal && picture.orignal.url) {
            if (picture.orignal.url.startsWith("ipfs://")) {
              let result = picture.orignal.url.substring(
                7,
                picture.orignal.url.length
              );
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
            } else {
              profile.avatarUrl = picture.orignal.url;
            }
          }
          return profile;
        })
      );
      setProfiles(profileData);
    } catch (err) {
      console.log({
        err,
      });
    }
  }

  return (
    <div className="pt-20">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl mb-6 font-bold">Hello Lens 🌿</h1>
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="w-2/3 shadow-md p-6 rounded-lg mb-8 flex flex-col items-center"
          >
            <img
              className="w-48"
              src={profile.avatarUrl || "https://picsum.photos/200"}
            />
            <p className="text-xl text-center mt-6">{profile.name}</p>
            <p className="text-base text-gray-400  text-center mt-2">
              {profile.bio}
            </p>
            <Link href={`/profile/${profile.handle}`}>
              <p className="cursor-pointer text-violet-600 text-lg font-medium text-center mt-2 mb-2">
                {profile.handle}
              </p>
            </Link>
            <p className="text-pink-600 text-sm font-medium text-center">
              {profile.stats.totalFollowers} followers
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
